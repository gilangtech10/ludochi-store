import { Breadcrumbs } from '@app/components/common/breadcrumbs';
import { Container } from '@app/components/common/container';
import { ProductListWithPagination } from '@app/components/product/ProductListWithPagination';
import HomeIcon from '@heroicons/react/24/solid/HomeIcon';
import { fetchProducts } from '@libs/util/server/products.server';
import { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { products, count, limit, offset } = await fetchProducts(request, {});

  return { products, count, limit, offset };
};

export type ProductsIndexRouteLoader = typeof loader;

export default function ProductsIndexRoute() {
  const data = useLoaderData<ProductsIndexRouteLoader>();

  if (!data) return null;

  const { products, count, limit, offset } = data;

  const breadcrumbs = [
    {
      label: (
        <span className="flex whitespace-nowrap">
          <HomeIcon className="inline h-4 w-4" />
          <span className="sr-only">Home</span>
        </span>
      ),
      url: `/`,
    },
    {
      label: 'All Products',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F2EB] text-[#2C1E16] selection:bg-[#B0894A] selection:text-[#F5F2EB] relative pt-12 pb-24">
      {/* Global Paper Texture Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-multiply" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      <Container className="relative z-10 pb-16">
        <div className="my-8 flex flex-wrap items-center justify-between gap-4 font-body">
          <Breadcrumbs breadcrumbs={breadcrumbs} />
        </div>

        <div className="mb-16 mt-8">
          <h1 className="w-full text-center text-5xl xs:text-6xl md:text-7xl font-display italic text-[#2C1E16]">
            Seluruh Katalog Baru
          </h1>
          <div className="w-24 h-px bg-[#B0894A] mx-auto mt-6"></div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
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
