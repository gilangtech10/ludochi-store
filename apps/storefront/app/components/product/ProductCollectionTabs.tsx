import { TabButton } from '@app/components/tabs/TabButton';
import { TabList } from '@app/components/tabs/TabList';
import { Tab, TabGroup } from '@headlessui/react';
import { StoreCollection } from '@medusajs/types';
import { type FC, Fragment } from 'react';

export interface ProductCollectionTabsProps {
  collections: StoreCollection[];
  selectedIndex?: number;
  onChange?: (index: number) => void;
}

export const ProductCollectionTabs: FC<ProductCollectionTabsProps> = ({ collections, selectedIndex = 0, onChange }) => {
  if (!collections?.length) return null;

  return (
    <TabGroup selectedIndex={selectedIndex} onChange={onChange}>
      <TabList>
        <Tab as={Fragment}>
          <TabButton selected={selectedIndex === 0}>All</TabButton>
        </Tab>

        {collections.map((collection, idx) => (
          <Tab key={collection.id} as={Fragment}>
            <TabButton selected={selectedIndex === idx + 1}>{collection.title}</TabButton>
          </Tab>
        ))}
      </TabList>
    </TabGroup>
  );
};
