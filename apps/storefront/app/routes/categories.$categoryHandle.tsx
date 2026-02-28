import { Container } from '@app/components/common/container';
import { ProductListWithPagination } from '@app/components/product/ProductListWithPagination';
import { listCategories } from '@libs/util/server/data/categories.server';
import { fetchProducts } from '@libs/util/server/products.server';
import clsx from 'clsx';
import { LoaderFunctionArgs, redirect } from 'react-router';
import { NavLink, useLoaderData } from 'react-router';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const handle = params.categoryHandle as string;

  const categories = await listCategories();
  const category = categories.find((c) => c.handle === handle);

  if (!category) {
    throw redirect('/products');
  }

  const { products, count, limit, offset } = await fetchProducts(request, {
    category_id: category.id,
  });

  return { products, count, limit, offset, category, categories };
};

export type ProductCategoryRouteLoader = typeof loader;

const PAPER_TEXTURE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default function ProductCategoryRoute() {
  const data = useLoaderData<ProductCategoryRouteLoader>();

  if (!data) return null;

  const { products, count, limit, offset, categories, category } = data;

  return (
    <div
      className="min-h-screen relative selection:bg-[#C9A962] selection:text-[#1C1714]"
      style={{ backgroundColor: '#1C1714', color: '#E8DFD4' }}
    >
      {/* Paper texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-50 mix-blend-overlay"
        style={{ backgroundImage: PAPER_TEXTURE, opacity: 0.03 }}
      />
      {/* Vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-40 vignette-overlay"
      />

      <Container className="relative z-10 pt-12 pb-24">

        {/* ── Page heading ─────────────────────────────────────── */}
        <div className="text-center mt-12 md:mt-20 mb-6">
          <span
            className="academia-label mb-4 block"
            aria-hidden="true"
          >
            Collection &nbsp;·&nbsp; Catalogue
          </span>

          <h1
            className="text-5xl xs:text-6xl md:text-7xl italic leading-tight"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 400, color: '#E8DFD4' }}
          >
            {category.name}
          </h1>

          <div className="ornate-divider w-48 mx-auto mt-8" />
        </div>

        {/* ── Category tabs ─────────────────────────────────── */}
        {categories.length > 1 && (
          <div className="flex justify-center mb-16 mt-4">
            <div
              className="inline-flex gap-1 p-1 rounded"
              style={{ backgroundColor: '#251E19', border: '1px solid #4A3F35' }}
            >
              {categories.map((cat) => (
                <NavLink
                  to={`/categories/${cat.handle}`}
                  key={cat.id}
                  prefetch="viewport"
                  className={({ isActive }) =>
                    clsx(
                      'px-5 py-2.5 text-sm italic transition-all duration-300 rounded',
                      {
                        'text-[#1C1714] bg-[#C9A962]': isActive,
                        'text-[#9C8B7A] hover:text-[#E8DFD4]': !isActive,
                      },
                    )
                  }
                  style={({ isActive }) => ({
                    fontFamily: 'var(--font-display)',
                    fontWeight: 400,
                  })}
                >
                  {cat.name}
                </NavLink>
              ))}
            </div>
          </div>
        )}

        {/* ── Product grid ──────────────────────────────────── */}
        <div className="flex flex-col gap-4 sm:flex-row mt-4">
          <div className="flex-1">
            <ProductListWithPagination
              products={products}
              paginationConfig={{ count, offset, limit }}
              context="products"
            />
          </div>
        </div>

      </Container>
    </div>
  );
}
