import { SiteDetailsRootData } from '@libs/types';
import { useRootLoaderData } from './useRootLoaderData';

export const useSiteDetails = (): SiteDetailsRootData => {
  const data = useRootLoaderData();

  return (data?.siteDetails || {}) as SiteDetailsRootData;
};
