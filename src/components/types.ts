export interface ItemInterface {
  id?: number;
  category: string;
  image: string;
  name: string;
  price: number;
  shortDesc: string;
  weightPerUnit: number;
  unit: string;
  baseAmount: number;
}

export interface ItemDisplayInterface {
    id: number;
    name: string;
    image: string;
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

export interface RecipeInterface {
    id: number;
    name: string;
    estimated_time: string;
    description:string;
    image: string;
    numberOfItems: number;

}

export interface RecipeCardInterface {
    recipe: RecipeInterface;
    amountInFridge: number;
    amountNearlyExpired: number;
}

export interface RecipeIngredientInterface {
    id: number;
    quantity: number;
    item: ItemInterface;
}

export interface User {
    id: number;
}

export interface ImportedProduct {
    name: string;
    image: string;
    current_price: number;
    description: string;
}

export interface SubUser {
  id: bigint;
  nickname: string;
  role: string;
  passcode: number;
}
