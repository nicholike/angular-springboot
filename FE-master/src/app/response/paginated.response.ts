import { ProductResponse } from "./product.response";

export interface PaginatedResponse {
  data: ProductResponse[]; // Change from 'content' to 'data'
  currentPage: number;
  totalPages: number;
  totalItems: number;
}