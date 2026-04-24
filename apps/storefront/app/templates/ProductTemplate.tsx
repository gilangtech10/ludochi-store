import { SubmitButton } from '@app/components/common/remix-hook-form/buttons/SubmitButton';
import { QuantitySelector } from '@app/components/common/remix-hook-form/field-groups/QuantitySelector';
import { ProductImageGallery } from '@app/components/product/ProductImageGallery';
import { ProductOptionSelectorRadio } from '@app/components/product/ProductOptionSelectorRadio';
import { ProductOptionSelectorSelect } from '@app/components/product/ProductOptionSelectorSelect';
import { ProductPrice } from '@app/components/product/ProductPrice';
import { ProductPriceRange } from '@app/components/product/ProductPriceRange';
import { Share } from '@app/components/share';
import { useCart } from '@app/hooks/useCart';
import { useProductInventory } from '@app/hooks/useProductInventory';
import { useRegion } from '@app/hooks/useRegion';
import { createLineItemSchema } from '@app/routes/api.cart.line-items.create';
import { zodResolver } from '@hookform/resolvers/zod';
import { FetcherKeys } from '@libs/util/fetcher-keys';
import {
  getFilteredOptionValues,
  getOptionValuesWithDiscountLabels,
  selectVariantFromMatrixBySelectedOptions,
  selectVariantMatrix,
} from '@libs/util/products';
import { StoreProduct, StoreProductOptionValue, StoreProductVariant } from '@medusajs/types';
import truncate from 'lodash/truncate';
import { type ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useFetcher } from 'react-router';
import { RemixFormProvider, useRemixForm } from 'remix-hook-form';
import { motion, Variants } from 'framer-motion';
import { ArrowLeftIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

const stagger: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

export interface ProductTemplateProps {
  product: StoreProduct;
}

const variantIsSoldOut = (v: StoreProductVariant | undefined) =>
  !!(v?.manage_inventory && v?.inventory_quantity! < 1);

export const ProductTemplate = ({ product }: ProductTemplateProps) => {
  const formRef       = useRef<HTMLFormElement>(null);
  const addToCartFetcher = useFetcher<any>({ key: FetcherKeys.cart.createLineItem });
  const { toggleCartDrawer } = useCart();
  const { region }    = useRegion();
  const hasErrors     = Object.keys(addToCartFetcher.data?.errors || {}).length > 0;
  const isAddingToCart = ['submitting', 'loading'].includes(addToCartFetcher.state);

  const defaultValues = {
    productId: product.id!,
    quantity:  '1',
    options: useMemo(() => {
      const first = product.variants?.[0];
      if (first?.options) {
        return first.options.reduce((acc, o) => {
          if (o.option_id && o.value) acc[o.option_id] = o.value;
          return acc;
        }, {} as Record<string, string>);
      }
      return product.options?.reduce((acc, o) => {
        if (o.id && o.values?.length) acc[o.id] = o.values[0].value;
        return acc;
      }, {} as Record<string, string>) || {};
    }, [product]),
  };

  const form = useRemixForm({
    resolver: zodResolver(createLineItemSchema),
    defaultValues,
    fetcher: addToCartFetcher,
    submitConfig: {
      method: 'post',
      action: '/api/cart/line-items/create',
      encType: 'multipart/form-data',
    },
  });

  const currencyCode = region.currency_code;
  const [opts, setOpts] = useState<Record<string, string>>(defaultValues.options);

  const selectedOptions = useMemo(
    () => product.options?.map(({ id }) => opts[id]),
    [product, opts],
  );
  const variantMatrix = useMemo(() => selectVariantMatrix(product), [product]);
  const selectedVariant = useMemo(
    () => selectVariantFromMatrixBySelectedOptions(variantMatrix, selectedOptions),
    [variantMatrix, selectedOptions],
  );

  const productSelectOptions = useMemo(
    () => product.options?.map((option, idx) => {
      if (idx === 0) {
        const vals = getOptionValuesWithDiscountLabels(idx, currencyCode, option.values || [], variantMatrix, selectedOptions);
        return { title: option.title, product_id: option.product_id as string, id: option.id, values: vals };
      }
      const filtered  = getFilteredOptionValues(product, opts, option.id);
      const available = (option.values?.filter((v) =>
        filtered.some((f) => f.value === v.value),
      ) || []) as StoreProductOptionValue[];
      const vals = getOptionValuesWithDiscountLabels(idx, currencyCode, available, variantMatrix, selectedOptions);
      return { title: option.title, product_id: option.product_id as string, id: option.id, values: vals };
    }),
    [product, opts, currencyCode, variantMatrix, selectedOptions],
  );

  const productSoldOut = useProductInventory(product).averageInventory === 0;
  const soldOut        = variantIsSoldOut(selectedVariant) || productSoldOut;
  const hasOptions     = !!productSelectOptions?.length;

  const updateOpts = (current: Record<string, string>, changedId: string, val: string) => {
    const next = { ...current, [changedId]: val };
    const ids  = product.options?.map((o) => o.id) || [];
    const idx  = ids.indexOf(changedId);
    if (idx >= 0) {
      ids.slice(idx + 1).forEach((id) => {
        if (!id) return;
        const f = getFilteredOptionValues(product, next, id);
        next[id] = f[0]?.value ?? '';
      });
    }
    return next;
  };

  const handleSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const id   = e.target.name.replace('options.', '');
    const next = updateOpts(opts, id, e.target.value);
    setOpts(next);
    form.setValue('options', next);
  };

  const handleRadio = (name: string, value: string) => {
    const next = updateOpts(opts, name, value);
    setOpts(next);
    form.setValue('options', next);
  };

  useEffect(() => {
    if (!isAddingToCart && !hasErrors && formRef.current) {
      formRef.current.reset();
      const qEl = formRef.current.querySelector('input[name="quantity"]') as HTMLInputElement;
      if (qEl) qEl.value = '1';
      const pEl = formRef.current.querySelector('input[name="productId"]') as HTMLInputElement;
      if (pEl) pEl.value = product.id!;
    }
  }, [isAddingToCart, hasErrors, product.id]);

  useEffect(() => {
    if (!Object.keys(opts).length) setOpts(defaultValues.options);
  }, [defaultValues.options]);

  useEffect(() => { setOpts(defaultValues.options); }, [defaultValues.options]);

  useEffect(() => {
    if (addToCartFetcher.state === 'idle' && addToCartFetcher.data?.cart && !hasErrors) {
      toggleCartDrawer(true);
    }
  }, [addToCartFetcher.state, addToCartFetcher.data, hasErrors, toggleCartDrawer]);

  return (
    <div className="w-full" style={{ backgroundColor: '#FFFAF4' }}>
      <RemixFormProvider {...form}>
        <addToCartFetcher.Form
          id="addToCartForm"
          ref={formRef}
          method="post"
          action="/api/cart/line-items/create"
          onSubmit={form.handleSubmit}
        >
          <input type="hidden" name="productId"        value={product.id} />
          <input type="hidden" name="productTitle"     value={product.title} />
          <input type="hidden" name="productThumbnail" value={product.images?.[0]?.url || product.thumbnail || ''} />

          {/* ═══════════════════════════════════════════
              LAYOUT: mobile = fixed image + scroll card
                      desktop = normal page flow
          ═══════════════════════════════════════════ */}
          <div className="flex flex-col md:block" style={{ height: '100svh' }}>

            {/* ── HERO IMAGE (stays at top on mobile) ── */}
            <div
              className="relative flex-shrink-0 overflow-hidden"
              style={{
                height: '58vw',
                minHeight: '260px',
                maxHeight: '420px',
                backgroundColor: '#F5EDE0',
              }}
            >
              <div className="absolute inset-0">
                <ProductImageGallery key={product.id} product={product} />
              </div>

              {/* gradient fade into card */}
              <div
                className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
                style={{ background: 'linear-gradient(to top, #FFFAF4 0%, transparent 100%)' }}
              />

              {/* Back */}
              <Link
                to="/products"
                className="absolute top-12 left-4 z-10 flex items-center justify-center w-9 h-9 rounded-full transition-all active:scale-95"
                style={{
                  backgroundColor: 'rgba(255,250,244,0.9)',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 2px 10px rgba(61,43,31,0.10)',
                }}
                aria-label="Kembali"
              >
                <ArrowLeftIcon className="w-4 h-4" strokeWidth={2} style={{ color: '#3D2B1F' }} />
              </Link>

              {/* Share */}
              <div
                className="absolute top-12 right-4 z-10 rounded-full overflow-hidden"
                style={{
                  backgroundColor: 'rgba(255,250,244,0.9)',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 2px 10px rgba(61,43,31,0.10)',
                }}
              >
                <Share
                  itemType="product"
                  shareData={{
                    title: product.title,
                    text: truncate(product.description || '', { length: 200, separator: ' ' }),
                  }}
                />
              </div>

              {/* Koleksi badge */}
              {product.collection && (
                <div
                  className="absolute top-12 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full whitespace-nowrap"
                  style={{
                    backgroundColor: 'rgba(61,43,31,0.65)',
                    backdropFilter: 'blur(6px)',
                    color: '#E8D5B0',
                    fontFamily: 'var(--font-label)',
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                  }}
                >
                  {product.collection.title}
                </div>
              )}
            </div>

            {/* ── INFO CARD — mobile: scrollable, desktop: normal ── */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="flex-1 min-h-0 overflow-y-auto md:overflow-visible -mt-5"
              style={{ borderRadius: '22px 22px 0 0', backgroundColor: '#FFFAF4' }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-2.5 pb-0">
                <div className="w-9 h-1 rounded-full" style={{ backgroundColor: '#DDD0C4' }} />
              </div>

              {/* ─ Content ─ */}
              {/* pb accounts for: sticky bar (~56px) + BottomNav (64px) + gap */}
              <div className="px-5 pt-3 pb-40 md:pb-32">

                {/* Kategori chips */}
                {!!product.categories?.length && (
                  <motion.div variants={fadeUp} className="flex flex-wrap gap-1.5 mb-2">
                    {product.categories.map((cat, i) => (
                      <Link
                        key={i}
                        to={`/products?category=${cat.handle}`}
                        className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase transition-all active:scale-95"
                        style={{
                          backgroundColor: '#FFF3E4',
                          color: '#6B3A1F',
                          border: '1px solid #E2CCB0',
                          fontFamily: 'var(--font-label)',
                        }}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </motion.div>
                )}

                {/* Judul + sold-out badge */}
                <motion.div variants={fadeUp} className="flex items-start justify-between gap-2 mb-1">
                  <h1
                    className="text-2xl leading-snug flex-1"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 600,
                      color: '#3D2B1F',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {product.title}
                  </h1>
                  {soldOut && (
                    <span
                      className="flex-shrink-0 mt-1 px-2.5 py-1 rounded-full text-[10px] font-semibold"
                      style={{ backgroundColor: '#F5EDE0', color: '#9C8070', fontFamily: 'var(--font-label)' }}
                    >
                      Habis
                    </span>
                  )}
                </motion.div>

                {/* Deskripsi */}
                {!!product.description && (
                  <motion.p
                    variants={fadeUp}
                    className="text-sm leading-relaxed mb-4 mt-1"
                    style={{ color: '#7A5C4E', fontFamily: 'var(--font-body)', fontWeight: 300 }}
                  >
                    {product.description}
                  </motion.p>
                )}

                {/* Divider "Pilihan" hanya jika ada options */}
                {hasOptions && (
                  <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
                    <div className="flex-1 h-px" style={{ backgroundColor: '#E2CCB0' }} />
                    <span
                      className="text-[10px] tracking-[0.25em] uppercase"
                      style={{ color: '#C47C3A', fontFamily: 'var(--font-label)' }}
                    >
                      Pilihan
                    </span>
                    <div className="flex-1 h-px" style={{ backgroundColor: '#E2CCB0' }} />
                  </motion.div>
                )}

                {/* Options — Select (> 5 nilai) */}
                {hasOptions && productSelectOptions!.length > 5 && (
                  <motion.section variants={fadeUp} className="mb-4 space-y-4">
                    {productSelectOptions!.map((option, i) => (
                      <ProductOptionSelectorSelect
                        key={i}
                        option={option}
                        value={opts[option.id]}
                        onChange={handleSelect}
                        currencyCode={currencyCode}
                      />
                    ))}
                  </motion.section>
                )}

                {/* Options — Radio chip (≤ 5 nilai) */}
                {hasOptions && productSelectOptions!.length <= 5 && (
                  <motion.section variants={fadeUp} className="mb-4 grid gap-4">
                    {productSelectOptions!.map((option, i) => (
                      <div key={i}>
                        <p
                          className="text-[10px] tracking-[0.2em] uppercase mb-2"
                          style={{ color: '#C47C3A', fontFamily: 'var(--font-label)' }}
                        >
                          {option.title}
                        </p>
                        <ProductOptionSelectorRadio
                          option={option}
                          value={opts[option.id]}
                          onChange={handleRadio}
                          currencyCode={currencyCode}
                        />
                      </div>
                    ))}
                  </motion.section>
                )}

                {/* Tags */}
                {!!product.tags?.length && (
                  <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mt-1">
                    {product.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-[11px]"
                        style={{
                          backgroundColor: '#F5EDE0',
                          color: '#9C8070',
                          fontFamily: 'var(--font-body)',
                          fontWeight: 300,
                        }}
                      >
                        #{tag.value}
                      </span>
                    ))}
                  </motion.div>
                )}

              </div>
            </motion.div>

          </div>{/* end flex layout */}

          {/* ═══════════════════════════════════════════
              STICKY BOTTOM BAR
              Mobile: bottom-16 (di atas BottomNav)
              Desktop: bottom-0
          ═══════════════════════════════════════════ */}
          <div
            className="fixed left-0 right-0 z-40 bottom-16 md:bottom-0"
            style={{
              backgroundColor: '#FFFFFF',
              borderTop: '1.5px solid #F0E6D6',
              boxShadow: '0 -4px 20px rgba(61,43,31,0.08)',
              paddingBottom: 'env(safe-area-inset-bottom)',
            }}
          >
            <div className="flex items-center gap-2.5 px-4 py-2.5">

              {/* Harga — compact */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-[9px] tracking-[0.18em] uppercase leading-none mb-0.5"
                  style={{ color: '#C47C3A', fontFamily: 'var(--font-label)' }}
                >
                  Harga
                </p>
                <p
                  className="text-sm leading-none font-semibold truncate"
                  style={{ fontFamily: 'var(--font-display)', color: '#3D2B1F' }}
                >
                  {selectedVariant
                    ? <ProductPrice product={product} variant={selectedVariant} currencyCode={currencyCode} />
                    : <ProductPriceRange product={product} currencyCode={currencyCode} />
                  }
                </p>
              </div>

              {/* Stepper */}
              {!soldOut && <QuantitySelector variant={selectedVariant} />}

              {/* CTA */}
              {!soldOut ? (
                <SubmitButton
                  className="cursor-pointer flex-shrink-0 flex items-center gap-1.5 px-4 h-10 rounded-xl text-[13px] font-semibold"
                  style={{
                    backgroundColor: '#3D2B1F',
                    color: '#FFFAF4',
                    fontFamily: 'var(--font-label)',
                    boxShadow: '0 3px 12px rgba(61,43,31,0.2)',
                    border: 'none',
                    letterSpacing: '0.01em',
                  }}
                >
                  {isAddingToCart
                    ? <span className="w-3.5 h-3.5 rounded-full border-[1.5px] animate-spin flex-shrink-0" style={{ borderColor: 'rgba(255,250,244,0.3)', borderTopColor: '#FFFAF4' }} />
                    : <ShoppingBagIcon className="w-3.5 h-3.5 flex-shrink-0" />
                  }
                  {isAddingToCart ? 'Menambahkan…' : 'Tambah'}
                </SubmitButton>
              ) : (
                <div
                  className="flex-shrink-0 px-4 h-10 flex items-center rounded-xl text-[13px] font-semibold opacity-45"
                  style={{ backgroundColor: '#E2CCB0', color: '#9C8070', fontFamily: 'var(--font-label)' }}
                >
                  Habis
                </div>
              )}

            </div>
          </div>

        </addToCartFetcher.Form>
      </RemixFormProvider>
    </div>
  );
};
