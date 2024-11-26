import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { ProductResponse } from '../response/product.response';
import { PaginatedResponse } from '../response/paginated.response';

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  status?: number;
}

export interface ProductCreationRequest {
  name: string;
  description: string;
  price: number;
  image: File;
  categoryId: number;
}

export interface ProductUpdateRequest {
  name: string;
  description: string;
  price: number;
  image?: File;
  categoryId: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  // Helper method to create multipart form data
  private createFormData(
    data: ProductCreationRequest | ProductUpdateRequest, 
    includeImage: boolean = true
  ): FormData {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('categoryId', data.categoryId.toString());
    
    if (includeImage && 'image' in data && data.image) {
      formData.append('image', data.image);
    }

    return formData;
  }

  // Helper method to create authenticated headers
  private createAuthHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Lấy danh sách sản phẩm (phân trang)
  getProducts(
    page: number = 0, 
    size: number = 10
  ): Observable<ApiResponse<PaginatedResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<ApiResponse<PaginatedResponse>>(
      `${this.apiBaseUrl}/products`, 
      { params }
    );
  }
  // Tìm kiếm sản phẩm
  searchProducts(keyword: string): Observable<ApiResponse<ProductResponse[]>> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<ApiResponse<ProductResponse[]>>(
      `${this.apiBaseUrl}/products/search`, 
      { params }
    );
  }

  // Chi tiết sản phẩm
  getDetailProduct(productId: string): Observable<ApiResponse<ProductResponse>> {
    return this.http.get<ApiResponse<ProductResponse>>(
      `${this.apiBaseUrl}/products/${productId}`
    );
  }

  // Thêm mới sản phẩm (yêu cầu token)
  insertProduct(
    product: ProductCreationRequest, 
    token: string
  ): Observable<ApiResponse<ProductResponse>> {
    const formData = this.createFormData(product);
    const headers = this.createAuthHeaders(token);

    return this.http.post<ApiResponse<ProductResponse>>(
      `${this.apiBaseUrl}/products`, 
      formData,
      { headers }
    );
  }

  // Cập nhật sản phẩm (yêu cầu token)
  updateProduct(
    productId: string, 
    product: ProductUpdateRequest,
    token: string
  ): Observable<ApiResponse<ProductResponse>> {
    const formData = this.createFormData(product);
    const headers = this.createAuthHeaders(token);

    return this.http.put<ApiResponse<ProductResponse>>(
      `${this.apiBaseUrl}/products/${productId}`, 
      formData,
      { headers }
    );
  }

  // Xóa sản phẩm (yêu cầu token)
  deleteProduct(
    productId: string, 
    token: string
  ): Observable<ApiResponse<ProductResponse>> {
    const headers = this.createAuthHeaders(token);

    return this.http.delete<ApiResponse<ProductResponse>>(
      `${this.apiBaseUrl}/products/${productId}`,
      { headers }
    );
  }

  // Tải lên nhiều ảnh cho sản phẩm (nếu cần)
  uploadProductImages(
    productId: string, 
    files: File[],
    token: string
  ): Observable<ApiResponse<string[]>> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    const headers = this.createAuthHeaders(token);

    return this.http.post<ApiResponse<string[]>>(
      `${this.apiBaseUrl}/products/${productId}/images`, 
      formData,
      { headers }
    );
  }
}