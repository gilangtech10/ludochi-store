import { HttpTypes, StoreCollection, StoreProductCategory } from '@medusajs/types';
import { getSelectedRegion } from './data/regions.server';
import { fetchProducts } from './products.server';

export const getProductListData = async (request: Request) => {
  const region = await getSelectedRegion(request.headers);

  if (!region) {
    throw new Error('Region not found');
  }

  const { products } = await fetchProducts(request, {
    limit: 10,
    offset: 0,
    region_id: region.id,
    fields: 'id,title,handle,thumbnail,variants.*,variants.prices.*',
  });
  const collectionTabs = new Map<string, StoreCollection>();
  const categoryTabs = new Map<string, StoreProductCategory>();

  products.forEach((product) => {
    product?.categories?.forEach((category) => {
      categoryTabs.set(category.id, category);
    });

    if (product.collection) {
      collectionTabs.set(product.collection.id, product.collection);
    }
  });

  return {
    products,
    collection_tabs: [...collectionTabs.values()],
    category_tabs: [...categoryTabs.values()],
  };
};
