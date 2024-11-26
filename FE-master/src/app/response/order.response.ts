export interface OrderCreationRequest {
    fullName: string;
    phoneNumber: string; // Note: phoneNumber, not ph
    shippingAddress: string;
    orderItems: {
      productId: number;
      quantity: number;
      price: number;
    }[];
  }