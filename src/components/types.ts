export interface ItemInterface {
    category: string;
    id: number;
    image: string;
    name: string;
    price: number;
    shortDesc: string;
    weightPerUnit: number;
    unit: string;
    baseAmount: number;
}

export interface ItemInterface2 {
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

export interface RecipeCardInterface {
    id: number;
    name: string;
    estimated_time: string;
    description:string;
    image: string;
    numberOfItemsRecipe: number;
    numberOfItemsFridge: number;
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
