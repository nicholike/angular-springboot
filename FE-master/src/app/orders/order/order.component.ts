import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { OrderCreationRequest } from '../../response/order.resPonse';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  standalone: true, // Recommend using standalone component
  imports: [CommonModule, FormsModule] // Add these imports
})
export class OrderComponent implements OnInit {
  cart: any = null;
  orderRequest: OrderCreationRequest = {
    shippingAddress: '',
    phoneNumber: '',
    fullName: '',
    orderItems: [] // Initialize with an empty array
  };

  isLoading = false;
  errorMessage = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check authentication
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        this.router.navigate(['/login'], {
          queryParams: { message: 'Please log in to create an order' }
        });
        return;
      }
    }

    // Fetch cart details
    this.fetchCartDetails();
  }

  fetchCartDetails(): void {
    this.isLoading = true;
    this.cartService.getCart().subscribe({
      next: (cartResponse) => {
        this.cart = cartResponse.data;
        
        // Prepare order items from cart
        this.orderRequest.orderItems = this.cart.cartItems.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }));

        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Unable to load cart. Please try again.';
        this.isLoading = false;
      }
    });
  }

  createOrder(): void {
    // Validate form
    if (this.validateForm()) {
      this.isLoading = true;
  
      this.orderService.createOrder(this.orderRequest).subscribe({
        next: (orderResponse) => {
          // Lấy danh sách các productId để xóa khỏi giỏ hàng
          const productIdsToRemove = this.orderRequest.orderItems.map(item => item.productId);
          
          // Sử dụng Observable.forkJoin để xóa đồng thời các sản phẩm
          const removeObservables = productIdsToRemove.map(productId => 
            this.cartService.removeFromCart(productId)
          );
  
          forkJoin(removeObservables).subscribe({
            next: (responses) => {
              this.isLoading = false;
              // Điều hướng đến trang cảm ơn
              this.router.navigate(['/thankyou']);
            },
            error: (removeErrors) => {
              this.isLoading = false;
              console.error('Lỗi xóa sản phẩm khỏi giỏ hàng:', removeErrors);
              // Vẫn điều hướng đến trang cảm ơn
              this.router.navigate(['/thankyou']);
            }
          });
        },
        error: (error) => {
          this.errorMessage = 'Unable to create order. Please try again.';
          this.isLoading = false;
          console.error('Order creation error:', error);
        }
      });
    }
  }

  validateForm(): boolean {
    const { shippingAddress, phoneNumber, fullName } = this.orderRequest;
    
    if (!fullName || fullName.trim() === '') {
      this.errorMessage = 'Please enter your full name';
      return false;
    }

    if (!phoneNumber || !/^[0-9]{10}$/.test(phoneNumber)) {
      this.errorMessage = 'Please enter a valid 10-digit phone number';
      return false;
    }

    if (!shippingAddress || shippingAddress.trim() === '') {
      this.errorMessage = 'Please enter a shipping address';
      return false;
    }

    if (!this.orderRequest.orderItems || this.orderRequest.orderItems.length === 0) {
      this.errorMessage = 'Cart is empty';
      return false;
    }

    return true;
  }

  // Calculate total order value
  calculateTotal(): number {
    return this.orderRequest.orderItems.reduce(
      (total: number, item: { quantity: number, price: number }) => total + (item.quantity * item.price), 
      0
    );
  }

  proceedToCheckout(): void {
    // Optional: You could add some validation here if needed
    this.router.navigate(['/order']);
  }

  buyMore(): void {
    // Optional: You could add some validation here if needed
    this.router.navigate(['/products']);
  }
}