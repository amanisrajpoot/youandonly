
export interface ClothingItem {
  id: number;
  name: string;
  category: 'Top' | 'Bottom' | 'Shoes' | 'Accessory' | 'Outerwear';
  imageUrl: string;
  price: number;
  description: string;
}

export interface Outfit {
  outfitName: string;
  description: string;
  items: ClothingItem[];
}
