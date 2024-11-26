import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { ProductResponse } from '../response/product.response';
import { PaginatedResponse } from '../response/paginated.response';

export interface CategoryResponse {
    id: number;
    name: string;
    description: string;
  }
  
  export interface CategoryCreationRequest {
    name: string;
    description: string;
  }
  
  export interface CategoryUpdateRequest {
    name?: string;
    description?: string;
  }
  
  // ApiResponse interface to match backend structure
  export interface ApiResponse<T> {
    data: T;
    message?: string;
    status?: number;
  }
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
    private apiBaseUrl = environment.apiBaseUrl;
  
    constructor(private http: HttpClient) { }
  
    // Helper method to create authenticated headers
    private createAuthHeaders(token?: string): HttpHeaders {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });
  
      if (token) {
        return headers.set('Authorization', `Bearer ${token}`);
      }
  
      return headers;
    }
  
    // Get authentication token from localStorage
    private getAuthToken(): string | null {
      return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    }
  
    // Get all categories
    getAllCategories(): Observable<ApiResponse<CategoryResponse[]>> {
      return this.http.get<ApiResponse<CategoryResponse[]>>(
        `${this.apiBaseUrl}/categories`
      );
    }
  
    // Get category by ID
    getCategoryById(categoryId: number): Observable<ApiResponse<CategoryResponse>> {
      return this.http.get<ApiResponse<CategoryResponse>>(
        `${this.apiBaseUrl}/categories/${categoryId}`
      );
    }
  
    // Create a new category (requires authentication)
    createCategory(
      category: CategoryCreationRequest
    ): Observable<ApiResponse<CategoryResponse>> {
      const token = this.getAuthToken();
      const headers = this.createAuthHeaders(token || undefined);
  
      return this.http.post<ApiResponse<CategoryResponse>>(
        `${this.apiBaseUrl}/categories`, 
        category,
        { headers }
      );
    }
  
    // Update an existing category (requires authentication)
    updateCategory(
      categoryId: number, 
      category: CategoryUpdateRequest
    ): Observable<ApiResponse<CategoryResponse>> {
      const token = this.getAuthToken();
      const headers = this.createAuthHeaders(token || undefined);
  
      return this.http.put<ApiResponse<CategoryResponse>>(
        `${this.apiBaseUrl}/categories/${categoryId}`, 
        category,
        { headers }
      );
    }
  
    // Delete a category (requires authentication)
    deleteCategory(categoryId: number): Observable<ApiResponse<CategoryResponse>> {
      const token = this.getAuthToken();
      const headers = this.createAuthHeaders(token || undefined);
  
      return this.http.delete<ApiResponse<CategoryResponse>>(
        `${this.apiBaseUrl}/categories/${categoryId}`,
        { headers }
      );
    }
  }