export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string; // Note: 'image' instead of 'imageUrl'
  categoryId: number;
  createdAt: string;
  updatedAt: string;
}