import { TabButton } from '@app/components/tabs/TabButton';
import { TabList } from '@app/components/tabs/TabList';
import { Tab, TabGroup } from '@headlessui/react';
import { StoreProductCategory } from '@medusajs/types';
import { type FC, Fragment } from 'react';

export interface ProductCategoryTabsProps {
  categories: StoreProductCategory[];
  selectedIndex?: number;
  onChange?: (index: number) => void;
}

export const ProductCategoryTabs: FC<ProductCategoryTabsProps> = ({ categories, selectedIndex = 0, onChange }) => {
  if (!categories?.length) return null;

  return (
    <TabGroup selectedIndex={selectedIndex} onChange={onChange}>
      <TabList>
        <Tab as={Fragment}>
          <TabButton selected={selectedIndex === 0}>All</TabButton>
        </Tab>

        {categories.map((category, idx) => (
          <Tab key={category.id} as={Fragment}>
            <TabButton selected={selectedIndex === idx + 1}>{category.name}</TabButton>
          </Tab>
        ))}
      </TabList>
    </TabGroup>
  );
};
