import { Container } from '@app/components/common/container';
import { ProductListWithPagination } from '@app/components/product/ProductListWithPagination';
import { PageHeading } from '@app/components/sections/PageHeading';
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

  return {
    products,
    count,
    limit,
    offset,
    category,
    categories,
  };
};

export type ProductCategoryRouteLoader = typeof loader;

export default function ProductCategoryRoute() {
  const data = useLoaderData<ProductCategoryRouteLoader>();

  if (!data) return null;

  const { products, count, limit, offset, categories } = data;

  return (
    <div className="min-h-screen bg-[#F5F2EB] text-[#2C1E16] selection:bg-[#B0894A] selection:text-[#F5F2EB] relative pt-12 pb-24">
      {/* Global Paper Texture Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-multiply" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      <Container className="relative z-10 pb-16">
        <PageHeading className="w-full text-center text-5xl xs:text-6xl md:text-7xl font-display italic mt-12 md:mt-24 text-[#2C1E16]">
          {data.category.name}
        </PageHeading>

        {categories.length > 1 && (
          <div className="flex flex-col w-full items-center">
            <div className="flex-1">
              <div className="inline-flex gap-8 text-xl md:text-2xl font-display font-medium border-b border-[#2C1E16]/20 mt-8 mb-16">
                {categories.map((category) => (
                  <NavLink
                    to={`/categories/${category.handle}`}
                    key={category.id}
                    prefetch="viewport"
                    className={({ isActive }) =>
                      clsx('h-full p-4 transition-colors', {
                        'text-[#B0894A] border-b-2 border-[#B0894A]': isActive,
                        'text-[#2C1E16]/60 hover:text-[#2C1E16] !border-transparent border-b-2': !isActive,
                      })
                    }
                  >
                    {category.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row mt-8">
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
