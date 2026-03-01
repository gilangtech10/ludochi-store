import { Breadcrumb, Breadcrumbs } from '@app/components/common/breadcrumbs/Breadcrumbs';
import { Button } from '@app/components/common/buttons/Button';
import { Container } from '@app/components/common/container/Container';
import { FieldLabel } from '@app/components/common/forms/fields/FieldLabel';
import { Grid } from '@app/components/common/grid/Grid';
import { GridColumn } from '@app/components/common/grid/GridColumn';
import { SubmitButton } from '@app/components/common/remix-hook-form/buttons/SubmitButton';
import { QuantitySelector } from '@app/components/common/remix-hook-form/field-groups/QuantitySelector';
import { ProductImageGallery } from '@app/components/product/ProductImageGallery';
import { ProductOptionSelectorRadio } from '@app/components/product/ProductOptionSelectorRadio';
import { ProductOptionSelectorSelect } from '@app/components/product/ProductOptionSelectorSelect';
import { ProductPrice } from '@app/components/product/ProductPrice';
import { ProductPriceRange } from '@app/components/product/ProductPriceRange';
import { ProductReviewStars } from '@app/components/reviews/ProductReviewStars';
import { Share } from '@app/components/share';
import { useCart } from '@app/hooks/useCart';
import { useProductInventory } from '@app/hooks/useProductInventory';
import { useRegion } from '@app/hooks/useRegion';
import { createLineItemSchema } from '@app/routes/api.cart.line-items.create';
import { zodResolver } from '@hookform/resolvers/zod';
import { StoreProductReviewStats } from '@lambdacurry/medusa-plugins-sdk';
import { FetcherKeys } from '@libs/util/fetcher-keys';
import {
  getFilteredOptionValues,
  getOptionValuesWithDiscountLabels,
  selectVariantFromMatrixBySelectedOptions,
  selectVariantMatrix,
} from '@libs/util/products';
import { StoreProduct, StoreProductOptionValue, StoreProductVariant } from '@medusajs/types';
import truncate from 'lodash/truncate';
import { type ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useFetcher } from 'react-router';
import { RemixFormProvider, useRemixForm } from 'remix-hook-form';
import { motion, Variants } from 'framer-motion';

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const getBreadcrumbs = (product: StoreProduct) => {
  const breadcrumbs: Breadcrumb[] = [
    { label: 'Home', url: '/' },
    { label: 'The Catalogue', url: '/products' },
  ];

  if (product.collection) {
    breadcrumbs.push({
      label: product.collection.title,
      url: `/collections/${product.collection.handle}`,
    });
  }

  return breadcrumbs;
};

export interface ProductTemplateProps {
  product: StoreProduct;
  reviewsCount: number;
  reviewStats?: StoreProductReviewStats;
}

const variantIsSoldOut: (variant: StoreProductVariant | undefined) => boolean = (variant) => {
  return !!(variant?.manage_inventory && variant?.inventory_quantity! < 1);
};

// Paper texture (matches global)
const PAPER_TEXTURE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export const ProductTemplate = ({ product, reviewsCount, reviewStats }: ProductTemplateProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const addToCartFetcher = useFetcher<any>({ key: FetcherKeys.cart.createLineItem });
  const { toggleCartDrawer } = useCart();
  const { region } = useRegion();
  const hasErrors = Object.keys(addToCartFetcher.data?.errors || {}).length > 0;
  const isAddingToCart = ['submitting', 'loading'].includes(addToCartFetcher.state);

  const defaultValues = {
    productId: product.id!,
    quantity: '1',
    options: useMemo(() => {
      const firstVariant = product.variants?.[0];
      if (firstVariant && firstVariant.options) {
        return firstVariant.options.reduce(
          (acc, option) => {
            if (option.option_id && option.value) acc[option.option_id] = option.value;
            return acc;
          },
          {} as Record<string, string>,
        );
      }
      return (
        product.options?.reduce(
          (acc, option) => {
            if (!option.id || !option.values?.length) return acc;
            acc[option.id] = option.values[0].value;
            return acc;
          },
          {} as Record<string, string>,
        ) || {}
      );
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

  const breadcrumbs = getBreadcrumbs(product);
  const currencyCode = region.currency_code;
  const [controlledOptions, setControlledOptions] = useState<Record<string, string>>(defaultValues.options);
  const selectedOptions = useMemo(
    () => product.options?.map(({ id }) => controlledOptions[id]),
    [product, controlledOptions],
  );

  const variantMatrix = useMemo(() => selectVariantMatrix(product), [product]);
  const selectedVariant = useMemo(
    () => selectVariantFromMatrixBySelectedOptions(variantMatrix, selectedOptions),
    [variantMatrix, selectedOptions],
  );

  const productSelectOptions = useMemo(
    () =>
      product.options?.map((option, index) => {
        if (index === 0) {
          const optionValuesWithPrices = getOptionValuesWithDiscountLabels(
            index, currencyCode, option.values || [], variantMatrix, selectedOptions,
          );
          return { title: option.title, product_id: option.product_id as string, id: option.id, values: optionValuesWithPrices };
        }
        const filteredOptionValues = getFilteredOptionValues(product, controlledOptions, option.id);
        const availableOptionValues = option.values?.filter((optionValue) =>
          filteredOptionValues.some((filteredValue) => filteredValue.value === optionValue.value),
        ) as StoreProductOptionValue[];
        const optionValuesWithPrices = getOptionValuesWithDiscountLabels(
          index, currencyCode, availableOptionValues || [], variantMatrix, selectedOptions,
        );
        return { title: option.title, product_id: option.product_id as string, id: option.id, values: optionValuesWithPrices };
      }),
    [product, controlledOptions, currencyCode, variantMatrix, selectedOptions],
  );

  const productSoldOut = useProductInventory(product).averageInventory === 0;

  const updateControlledOptions = (
    currentOptions: Record<string, string>,
    changedOptionId: string,
    newValue: string,
  ): Record<string, string> => {
    const newOptions = { ...currentOptions };
    newOptions[changedOptionId] = newValue;
    const allOptionIds = product.options?.map((option) => option.id) || [];
    const changedOptionIndex = allOptionIds.indexOf(changedOptionId);
    const subsequentOptionIds = changedOptionIndex >= 0 ? allOptionIds.slice(changedOptionIndex + 1) : [];
    if (subsequentOptionIds.length > 0) {
      subsequentOptionIds.forEach((optionId) => {
        if (!optionId) return;
        const filteredValues = getFilteredOptionValues(product, newOptions, optionId);
        newOptions[optionId] = filteredValues.length > 0 ? filteredValues[0].value : '';
      });
    }
    return newOptions;
  };

  const handleOptionChangeBySelect = (e: ChangeEvent<HTMLInputElement>) => {
    const changedOptionId = e.target.name.replace('options.', '');
    const newOptions = updateControlledOptions(controlledOptions, changedOptionId, e.target.value);
    setControlledOptions(newOptions);
    form.setValue('options', newOptions);
  };

  const handleOptionChangeByRadio = (name: string, value: string) => {
    const newOptions = updateControlledOptions(controlledOptions, name, value);
    setControlledOptions(newOptions);
    form.setValue('options', newOptions);
  };

  useEffect(() => {
    if (!isAddingToCart && !hasErrors) {
      if (formRef.current) {
        formRef.current.reset();
        const quantityInput = formRef.current.querySelector('input[name="quantity"]') as HTMLInputElement;
        if (quantityInput) quantityInput.value = '1';
        const productIdInput = formRef.current.querySelector('input[name="productId"]') as HTMLInputElement;
        if (productIdInput) productIdInput.value = product.id!;
      }
    }
  }, [isAddingToCart, hasErrors, product.id]);

  useEffect(() => {
    if (Object.keys(controlledOptions).length === 0) setControlledOptions(defaultValues.options);
  }, [defaultValues.options, controlledOptions]);

  useEffect(() => {
    setControlledOptions(defaultValues.options);
  }, [defaultValues.options]);

  const soldOut = variantIsSoldOut(selectedVariant) || productSoldOut;
  const handleAddToCart = useCallback(() => { toggleCartDrawer(true); }, [toggleCartDrawer]);

  return (
    <>
      <section
        className="relative min-h-screen selection:bg-[#C9A962] selection:text-[#1C1714]"
        style={{ backgroundColor: '#1C1714', color: '#E8DFD4' }}
      >
        {/* Atmospheric overlays */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-50 mix-blend-overlay"
          style={{ backgroundImage: PAPER_TEXTURE, opacity: 0.03 }}
        />
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-40 vignette-overlay" />

        <RemixFormProvider {...form}>
          <addToCartFetcher.Form
            id="addToCartForm"
            ref={formRef}
            method="post"
            action="/api/cart/line-items/create"
            onSubmit={handleAddToCart}
            className="relative z-10"
          >
            <input type="hidden" name="productId" value={product.id} />
            <input type="hidden" name="productTitle" value={product.title} />
            <input
              type="hidden"
              name="productThumbnail"
              value={(product.images && product.images[0] && product.images[0].url) || product.thumbnail || ''}
            />

            <Container className="px-0 sm:px-6 md:px-8 pt-8 pb-24">

              {/* ── Breadcrumb ── */}
              <div className="flex items-center gap-2 mb-10 px-4 sm:px-0">
                {breadcrumbs.map((crumb, i) => (
                  <span key={i} className="flex items-center gap-2">
                    {i > 0 && <span style={{ color: '#4A3F35' }}>·</span>}
                    {crumb.url ? (
                      <Link
                        to={crumb.url}
                        className="transition-colors duration-200 hover:text-[#C9A962]"
                        style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9C8B7A' }}
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span
                        style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A962' }}
                      >
                        {crumb.label}
                      </span>
                    )}
                  </span>
                ))}
              </div>

              {/* ── Main two-column layout ── */}
              <motion.div 
                className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-16 xl:gap-24"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >

                {/* ── Left: Image Gallery ── */}
                <motion.div variants={fadeUpVariant} className="mb-10 lg:mb-0">
                  {/* Ornate frame wrapper */}
                  <div
                    className="ornate-frame ornate-frame-lg relative p-3"
                    style={{ backgroundColor: '#251E19', border: '1px solid #4A3F35' }}
                  >
                    <ProductImageGallery key={product.id} product={product} />

                    {/* Caption tag */}
                    <div
                      className="absolute -bottom-4 -left-4 py-2 px-4 z-20"
                      style={{ backgroundColor: '#251E19', border: '1px solid #4A3F35' }}
                    >
                      <p className="text-xs italic" style={{ fontFamily: 'var(--font-body)', color: '#9C8B7A' }}>
                        Fig. — {product.title}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* ── Right: Product Info ── */}
                <motion.div variants={staggerContainer} className="flex flex-col px-4 sm:px-0">

                  {/* Header */}
                  <motion.header variants={fadeUpVariant} className="pb-6 mb-6 border-b border-[#4A3F35]">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="academia-label mb-3 block">
                          {product.collection ? product.collection.title : 'Single Edition'}
                        </span>
                        <h1
                          className="text-4xl md:text-5xl leading-tight"
                          style={{ fontFamily: 'var(--font-display)', fontWeight: 400, color: '#E8DFD4' }}
                        >
                          {product.title}
                        </h1>
                      </div>
                      <Share
                        itemType="product"
                        shareData={{
                          title: product.title,
                          text: truncate(product.description || 'Check out this product', { length: 200, separator: ' ' }),
                        }}
                      />
                    </div>

                    {/* Review stars */}
                    <div className="mt-4">
                      <ProductReviewStars reviewsCount={reviewsCount} reviewStats={reviewStats} />
                    </div>
                  </motion.header>

                  {/* Price */}
                  <section aria-labelledby="product-information" className="mb-8">
                    <h2 id="product-information" className="sr-only">Product information</h2>
                    <div className="flex items-baseline gap-3">
                      <span className="academia-label">Offered At</span>
                      <p
                        className="text-3xl"
                        style={{ fontFamily: 'var(--font-display)', color: '#C9A962' }}
                      >
                        {selectedVariant ? (
                          <ProductPrice product={product} variant={selectedVariant} currencyCode={currencyCode} />
                        ) : (
                          <ProductPriceRange product={product} currencyCode={currencyCode} />
                        )}
                      </p>
                    </div>
                  </section>

                  {/* Options — Select (> 5) */}
                  {productSelectOptions && productSelectOptions.length > 5 && (
                    <section aria-labelledby="product-options" className="mb-6">
                      <h2 id="product-options" className="sr-only">Product options</h2>
                      <div className="space-y-4">
                        {productSelectOptions.map((option, optionIndex) => (
                          <ProductOptionSelectorSelect
                            key={optionIndex}
                            option={option}
                            value={controlledOptions[option.id]}
                            onChange={handleOptionChangeBySelect}
                            currencyCode={currencyCode}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Options — Radio (≤ 5) */}
                  {productSelectOptions && productSelectOptions.length <= 5 && (
                    <section aria-labelledby="product-options" className="mb-6 grid gap-5">
                      <h2 id="product-options" className="sr-only">Product options</h2>
                      {productSelectOptions.map((option, optionIndex) => (
                        <div key={optionIndex}>
                          <FieldLabel className="mb-2">{option.title}</FieldLabel>
                          <ProductOptionSelectorRadio
                            option={option}
                            value={controlledOptions[option.id]}
                            onChange={handleOptionChangeByRadio}
                            currencyCode={currencyCode}
                          />
                        </div>
                      ))}
                    </section>
                  )}

                  {/* Divider */}
                  <div className="ornate-divider ornate-divider-alt mb-8" aria-hidden="true" />

                  {/* Add to Cart */}
                  <div className="flex items-center gap-4 mb-8">
                    {!soldOut && (
                      <QuantitySelector
                        variant={selectedVariant}
                        className="!border-[#4A3F35] !rounded-none focus:!ring-[#C9A962] !bg-[#251E19] !text-[#E8DFD4]"
                      />
                    )}
                    <div className="flex-1">
                      {!soldOut ? (
                        <SubmitButton className="btn-brass engraved group relative w-full gap-3 !rounded cursor-pointer">
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            {isAddingToCart ? (
                              <>
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Adding to Cart…
                              </>
                            ) : (
                              <>
                                Add to Cart
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4" aria-hidden="true">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                </svg>
                              </>
                            )}
                          </span>
                        </SubmitButton>
                      ) : (
                        <SubmitButton
                          disabled
                          className="pointer-events-none w-full h-12 border border-[#4A3F35] text-[#9C8B7A] bg-transparent !rounded"
                          style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}
                        >
                          Sold Out
                        </SubmitButton>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {!!product.description && (
                    <div className="pt-6 border-t border-[#4A3F35]">
                      <h3 className="academia-label mb-4">I. &nbsp;About This Entry</h3>
                      <div
                        className="whitespace-pre-wrap leading-relaxed text-justify"
                        style={{ fontFamily: 'var(--font-body)', fontSize: '1.0625rem', color: 'rgba(232,223,212,0.8)' }}
                      >
                        {product.description}
                      </div>
                    </div>
                  )}

                  {/* Categories */}
                  {product.categories && product.categories.length > 0 && (
                    <nav aria-label="Categories" className="mt-8">
                      <h3 className="academia-label mb-3">II. &nbsp;Classification</h3>
                      <ol className="flex flex-wrap items-center gap-2">
                        {product.categories.map((category, categoryIndex) => (
                          <li key={categoryIndex}>
                            <Link
                              to={`/categories/${category.handle}`}
                              className="inline-block py-1 px-3 transition-colors duration-200"
                              style={{
                                fontFamily: 'var(--font-label)',
                                fontSize: '0.55rem',
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                border: '1px solid #4A3F35',
                                color: '#9C8B7A',
                              }}
                              onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.borderColor = '#C9A962';
                                (e.currentTarget as HTMLElement).style.color = '#C9A962';
                              }}
                              onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.borderColor = '#4A3F35';
                                (e.currentTarget as HTMLElement).style.color = '#9C8B7A';
                              }}
                            >
                              {category.name}
                            </Link>
                          </li>
                        ))}
                      </ol>
                    </nav>
                  )}

                  {/* Tags */}
                  {product.tags && product.tags.length > 0 && (
                    <nav aria-label="Tags" className="mt-6">
                      <h3 className="academia-label mb-3">III. &nbsp;Keywords</h3>
                      <ol className="flex flex-wrap items-center gap-2">
                        {product.tags.map((tag, tagIndex) => (
                          <li key={tagIndex}>
                            <span
                              className="inline-block py-1 px-3"
                              style={{
                                fontFamily: 'var(--font-label)',
                                fontSize: '0.55rem',
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                backgroundColor: '#251E19',
                                border: '1px solid #4A3F35',
                                color: '#9C8B7A',
                              }}
                            >
                              {tag.value}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </nav>
                  )}

                </motion.div>
              </motion.div>
            </Container>
          </addToCartFetcher.Form>
        </RemixFormProvider>
      </section>
    </>
  );
};
