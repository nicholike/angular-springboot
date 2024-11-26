import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../environments/environment';
import { CartResponse, ItemToCartRequest } from '../response/cart.response';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiBaseUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  getCart(): Observable<CartResponse> {
    const headers = this.getAuthHeaders();
    return this.http.get<CartResponse>(`${this.apiBaseUrl}/carts`, { headers });
  }

  addToCart(item: ItemToCartRequest): Observable<CartResponse> {
    const headers = this.getAuthHeaders();
    return this.http.post<CartResponse>(`${this.apiBaseUrl}/carts/items`, item, { headers });
  }

  updateCartItem(item: ItemToCartRequest): Observable<CartResponse> {
    const headers = this.getAuthHeaders();
    return this.http.put<CartResponse>(`${this.apiBaseUrl}/carts/items`, item, { headers });
  }

  removeFromCart(productId: any): Observable<CartResponse> {
    const headers = this.getAuthHeaders();
    return this.http.delete<CartResponse>(`${this.apiBaseUrl}/carts/items/${productId}`, { headers });
  }

  private getAuthHeaders(): HttpHeaders {
    // Safely check if running in browser
    if (typeof window !== 'undefined' && isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      
      if (token && token.trim() !== '') {
        return new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
      }
    }
    
    // If no token or not in browser, return empty headers
    return new HttpHeaders();
  }
}