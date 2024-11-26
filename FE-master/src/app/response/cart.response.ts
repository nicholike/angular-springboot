export interface CartResponse {
    id: string; // ID của đơn hàng
    data: {
      cartItems: CartItemResponse[];
      totalAmount: number;
    };
  }
  
  export interface CartItemResponse {
    id: string; // ID của cart item
    quantity: number;
    price: number;
    productId: string; // ID sản phẩm
  }
  
  // cart-request.model.ts
  export interface ItemToCartRequest {
    productId: string;
    quantity: number;
  }