import { NavigationCollection, NavigationItemLocation } from '@libs/types';

export const headerNavigationItems: NavigationCollection = [
  {
    id: 1,
    label: 'View our Menu',
    url: '/categories/donut',
    sort_order: 0,
    location: NavigationItemLocation.header,
    new_tab: false,
  },
  {
    id: 3,
    label: 'Our Story',
    url: '/about-us',
    sort_order: 1,
    location: NavigationItemLocation.header,
    new_tab: false,
  },
  {
    id: 2,
    label: 'Shop All',
    url: '/products',
    sort_order: 1,
    location: NavigationItemLocation.header,
    new_tab: false,
  },
];

export const footerNavigationItems: NavigationCollection = [
  {
    id: 1,
    label: 'Shop All',
    url: '/products',
    location: NavigationItemLocation.footer,
    sort_order: 1,
    new_tab: false,
  },
  {
    id: 2,
    label: 'Donut',
    url: '/categories/donut',
    location: NavigationItemLocation.footer,
    sort_order: 2,
    new_tab: false,
  },
  {
    id: 3,
    label: 'Drink',
    url: '/categories/drink',
    location: NavigationItemLocation.footer,
    sort_order: 3,
    new_tab: false,
  },
  {
    id: 4,
    label: 'Snack',
    url: '/categories/snack',
    location: NavigationItemLocation.footer,
    sort_order: 4,
    new_tab: false,
  },
];
