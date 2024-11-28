import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { OrderCreationRequest, OrderResponse, OrderStatus, OrderStatusUpdateRequest, PaginatedOrderResponse } from '../response/order.resPonse';
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
  getAllOrders(page = 0, size = 10): Observable<PaginatedOrderResponse> {
    const headers = this.getAuthHeaders();
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
  
    return this.http.get<PaginatedOrderResponse>(`${this.apiBaseUrl}/orders`, { 
      headers, 
      params 
    });
  }
  getOrdersByUser(page = 0, size = 10): Observable<PaginatedOrderResponse> {
    const headers = this.getAuthHeaders();
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedOrderResponse>(`${this.apiBaseUrl}/orders/user`, { headers, params });
  }

  getOrderById(id: string): Observable<OrderResponse> {
    const headers = this.getAuthHeaders();
    return this.http.get<OrderResponse>(`${this.apiBaseUrl}/orders/${id}`, { headers });
  }

  updateOrderStatus(id: string, status: OrderStatusUpdateRequest): Observable<OrderResponse> {
    const headers = this.getAuthHeaders();
    return this.http.put<OrderResponse>(`${this.apiBaseUrl}/orders/status/${id}`, status, { headers });
  }

  updateOrder(id: string, orderUpdateRequest: OrderCreationRequest): Observable<OrderResponse> {
    const headers = this.getAuthHeaders();
    return this.http.put<OrderResponse>(`${this.apiBaseUrl}/orders/${id}`, orderUpdateRequest, { headers });
  }

  deleteOrder(id: string): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiBaseUrl}/orders/${id}`, { headers });
  }
}