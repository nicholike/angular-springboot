import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { OrderCreationRequest } from '../response/order.resPonse';
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      
      if (token && token.trim() !== '') {
        return new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });
      }
    }
    
    return new HttpHeaders();
  }

  createOrder(orderRequest: OrderCreationRequest): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiBaseUrl}/orders`, orderRequest, { headers });
  }
  deleteCart(cartId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiBaseUrl}/orders/${cartId}`, { headers });
  }
}