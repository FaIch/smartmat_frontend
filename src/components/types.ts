export enum Unit {
  // eslint-disable-next-line no-unused-vars
  GRAMS = 'GRAMS',
  // eslint-disable-next-line no-unused-vars
  MILLILITER = 'MILLILITER',
  // eslint-disable-next-line no-unused-vars
  ITEM = 'ITEM'
}

export interface ItemInterface {
  id?: number;
  category: string;
  image: string;
  name: string;
  price: number;
  shortDesc: string;
  weightPerUnit: number;
  unit: Unit;
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
