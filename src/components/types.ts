export interface ItemInterface {
  category: string;
  id: number;
  image: string;
  name: string;
  price: number;
  shortDesc: string;
  weight: number;
}

export interface ShoppingListItemCardInterface {
  id: number;
  item: ItemInterface;
  quantity: number;
}

export interface ShoppingListItem {
  id: bigint;
  quantity: number;
}

export interface FridgeItemCardInterface {
  id: number;
  item: ItemInterface;
  quantity: number;
  expirationDate: string;
}
