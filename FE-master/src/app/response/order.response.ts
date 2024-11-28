export interface OrderCreationRequest {
    fullName: string;
    phoneNumber: string; // Note: phoneNumber, not ph
    shippingAddress: string;
    orderItems: {
      productId: number;
      quantity: number;
      price: number;
    }[];
    status?: OrderStatus;
  }
  // Enum for OrderStatus to match backend
export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}
export interface OrderStatusUpdateRequest {
  status: OrderStatus;
}
// OrderItem Response Model
export interface OrderItemResponse {
  // Add specific fields based on backend definition
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

// Order Response Model (Updated to match backend)
export interface OrderResponse {
  createdAt: string; // Using string for ISO date/instant
  fullName: string;
  id: string;
  orderItems: OrderItemResponse[];
  phoneNumber: string;
  shippingAddress: string;
  status: OrderStatus;
  totalAmount: number;
  updatedAt: string; // Using string for ISO date/instant
  userId: string;

}

// Paginated Response Model (Updated to match backend)
export interface PaginatedResponse<T> {
  code: number;
  data: {
    data: T[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}
// Type for Paginated Order Response
export type PaginatedOrderResponse = PaginatedResponse<OrderResponse>;