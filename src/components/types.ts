export interface ShoppingListItemCardInterface {
    id: number;
    quantity: number;
    item: {
        id: number;
        name: string;
        shortDesc: string;
        category: string;
        price: number;
        weight: number;
    }
}
