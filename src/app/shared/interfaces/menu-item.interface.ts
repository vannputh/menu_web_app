export interface MenuItem {
  id: string;
  title: string;
  price: number;
  imageSrc: string;
  category: MenuCategory;
  type: MenuItemType;
}

export type MenuCategory = 'main-dishes' | 'side-dishes' | 'drinks';

export type MenuItemType = 'drink' | 'bottled' | 'main' | 'side' | 'soup';

export interface MenuCategoryConfig {
  category: MenuCategory;
  title: string;
  apiEndpoint: string;
} 