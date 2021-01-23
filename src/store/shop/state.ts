export interface ShopStateInterface {
  cart: CartItemInterface[];
}

export interface CartItemInterface {
  [key: number]: {
    order: any;
    quantity: number;
    product: any;
  };
}

function state(): ShopStateInterface {
  return {
    cart: [],
  }
}

export default state;
