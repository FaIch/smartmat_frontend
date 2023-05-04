export enum Unit {
  // eslint-disable-next-line no-unused-vars
  GRAMS = 'GRAMS',
  // eslint-disable-next-line no-unused-vars
  MILLILITER = 'MILLILITER',
  // eslint-disable-next-line no-unused-vars
  ITEM = 'ITEM'
}

export interface ItemInterface {
  id: number;
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

export interface WishlistItemCardInterface {
  id: number;
  item: ItemInterface;
  quantity: number;
}

export interface ShoppingListItem {
  id: number;
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
  estimatedTime: string;
  description:string;
  numberOfItems: number;
  image: string;
}

export interface WeekMenuRecipeInterface {
  id: number;
  recipe: RecipeInterface;
  completed: boolean;
}

export interface MenuInterface {
  id: number;
  weekMenuRecipes: WeekMenuRecipeInterface[];
}

export interface RecipeCardInterface {
  recipe: RecipeInterface;
  amountInFridge: number;
  amountNearlyExpired: number;
}

export interface WeekMenuCardInterface {
  firstRecipeImage:string;
  type:string;
}

export interface WeekMenuData {
    totalAmountOfItems:number;
    totalAmountOfMissingItems:number;
    totalAmountOfItemsToExpire:number;
}

export interface RecipeIngredientInterface {
  id: number;
  quantity: number;
  item: ItemInterface;
  selected: boolean;
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
export enum Role {
  // eslint-disable-next-line no-unused-vars
  CHILD = 'CHILD',
  // eslint-disable-next-line no-unused-vars
  PARENT = 'PARENT'
}

export interface SubUser {
  id: number;
  email: string;
  nickname: string;
  role: Role;
  passcode: number;
}
