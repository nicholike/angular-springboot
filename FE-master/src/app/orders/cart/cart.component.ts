import { Component, OnInit } from '@angular/core';
import { CartItemResponse, CartResponse, ItemToCartRequest } from '../../response/cart.response';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { OrderService } from '../../services/order.service';

export interface ExtendedCartItemResponse extends CartItemResponse {
  image?: string;
  productName?: string;
  totalPrice: number;
  tempQuantity?: number;
  hasUnsavedChanges?: boolean;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart: CartResponse | null = null;
  cartItemsWithDetails: ExtendedCartItemResponse[] = [];
  orderHistory: any[] = []; // Store user's order history
  activeView: 'cart' | 'orders' = 'cart';
  isLoading: boolean = true;
  hasError: boolean = false;
  errorMessage: string = '';

  confirmAction: {
    type: 'update' | 'remove' | null;
    items: ExtendedCartItemResponse[];
  } = { 
    type: null, 
    items: [] 
  };

  constructor(
  private cartService: CartService,
    private productService: ProductService,
    private orderService: OrderService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        this.router.navigate(['/login'], {
          queryParams: { message: 'Vui lòng đăng nhập để tiếp tục' }
        });
        return;
      }
    }
    this.fetchCartWithProductDetails();
    this.fetchOrderHistory(); 
    
  }


  private fetchCartWithProductDetails(): void {
    this.isLoading = true;
    this.hasError = false;

    this.cartService.getCart().subscribe({
      next: (cartResponse) => {
        this.cart = cartResponse;
        if (cartResponse.data?.cartItems?.length) {
          this.enhanceCartItemsWithImages(cartResponse.data.cartItems);
        } else {
          this.cartItemsWithDetails = [];
          this.isLoading = false;
        }
      },
    });
  }

  private enhanceCartItemsWithImages(cartItems: CartItemResponse[]): void {
    const productDetailObservables = cartItems.map(item => 
      this.productService.getDetailProduct(item.productId)
    );

    forkJoin(productDetailObservables).subscribe({
      next: (productResponses) => {
        this.cartItemsWithDetails = cartItems.map((cartItem, index) => ({
          ...cartItem,
          image: productResponses[index].data?.image,
          productName: productResponses[index].data?.name,
          totalPrice: cartItem.quantity * cartItem.price,
          tempQuantity: cartItem.quantity,
          hasUnsavedChanges: false
        }));
        this.isLoading = false;
      },
    });
  }
  currentPage = 0;
  totalPages = 0;
  
  fetchOrderHistory(page = 0): void {
    this.isLoading = true;
    this.orderService.getOrdersByUser(page).subscribe({
      next: (response) => {
        this.orderHistory = response.data.data.map(order => ({
          ...order,
          formattedDate: new Date(order.createdAt).toLocaleDateString('vi-VN'),
          totalFormatted: order.totalAmount.toLocaleString('vi-VN')
        }));
        
        // Update pagination info
        this.currentPage = response.data.currentPage;
        this.totalPages = response.data.totalPages;
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Lỗi tải lịch sử đơn hàng', error);
        this.hasError = true;
        this.errorMessage = 'Không thể tải lịch sử đơn hàng';
        this.isLoading = false;
      }
    });
  }
  
  // Add pagination methods
  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.fetchOrderHistory(this.currentPage + 1);
    }
  }
  
  prevPage(): void {
    if (this.currentPage > 0) {
      this.fetchOrderHistory(this.currentPage - 1);
    }
  }
  // Method to view order details
  viewOrderDetails(orderId: string): void {
    this.router.navigate(['/order-details', orderId]);
  }

  // Switch between cart and order views
  switchView(view: 'cart' | 'orders'): void {
    this.activeView = view;
    if (view === 'orders') {
      this.fetchOrderHistory();
    }
  }

  // Helper method to get order status label
  getOrderStatusLabel(status: string): string {
    const statusLabels: { [key: string]: string } = {
      'PENDING': 'Chờ Xử Lý',
      'CONFIRMED': 'Đã Xác Nhận',
      'SHIPPING': 'Đang Vận Chuyển',
      'COMPLETED': 'Hoàn Thành',
      'CANCELLED': 'Đã Hủy'
    };
    return statusLabels[status] || status;
  }
  increaseQuantity(cartItem: ExtendedCartItemResponse): void {
    const maxQuantity = 10; // Giới hạn số lượng tối đa
    if ((cartItem.tempQuantity || cartItem.quantity) < maxQuantity) {
      cartItem.tempQuantity = (cartItem.tempQuantity || cartItem.quantity) + 1;
      cartItem.hasUnsavedChanges = true;
    }
  }

  decreaseQuantity(cartItem: ExtendedCartItemResponse): void {
    if ((cartItem.tempQuantity || cartItem.quantity) > 1) {
      cartItem.tempQuantity = (cartItem.tempQuantity || cartItem.quantity) - 1;
      cartItem.hasUnsavedChanges = true;
    }
  }

  // Thay đổi logic xác nhận để hỗ trợ nhiều sản phẩm
  checkForUnsavedChanges(): void {
    const itemsWithChanges = this.cartItemsWithDetails.filter(item => item.hasUnsavedChanges);
    
    if (itemsWithChanges.length > 0) {
      this.confirmAction = {
        type: 'update',
        items: itemsWithChanges
      };
    }
  }

  confirmQuantityUpdate(): void {
    const itemsToUpdate = this.cartItemsWithDetails.filter(item => item.hasUnsavedChanges);
    
    if (itemsToUpdate.length === 0) {
      this.cancelConfirmation();
      return;
    }
  
    const updateRequests = itemsToUpdate.map(item => 
      this.cartService.updateCartItem({
        productId: item.productId,
        quantity: item.tempQuantity!
      })
    );
  
    forkJoin(updateRequests).subscribe({
      next: (responses) => {
        const latestCartResponse = responses[responses.length - 1];
        this.cart = latestCartResponse;
        this.enhanceCartItemsWithImages(latestCartResponse.data.cartItems);
        
        this.confirmAction = { 
          type: null, 
          items: [] 
        };
      },
      error: (error) => {
        console.error('Lỗi cập nhật số lượng', error);
        alert('Không thể cập nhật số lượng');
        this.cancelConfirmation();
      }
    });
  }
  cancelConfirmation(): void {
    this.cartItemsWithDetails.forEach(item => {
      if (item.hasUnsavedChanges) {
        item.tempQuantity = item.quantity;
        item.hasUnsavedChanges = false;
      }
    });

    this.confirmAction = { 
      type: null, 
      items: [] 
    };
  }

  removeFromCart(cartItem: ExtendedCartItemResponse): void {
    this.confirmAction = {
      type: 'remove',
      items: [cartItem]
    };
  }
  
  hasUnsavedChanges(): boolean {
    return this.cartItemsWithDetails.some(item => item.hasUnsavedChanges);
  }
    // Optional: You could add some validation here if needed
  // Thêm method confirmRemove để xử lý xóa từng sản phẩm
confirmRemove(): void {
  if (this.confirmAction.items.length === 0) {
    this.cancelConfirmation();
    return;
  }

  const productIdToRemove = this.confirmAction.items[0].productId;
  
  this.cartService.removeFromCart(productIdToRemove).subscribe({
    next: (cartResponse) => {
      this.cart = cartResponse;
      this.enhanceCartItemsWithImages(cartResponse.data.cartItems);
      
      this.confirmAction = { 
        type: null, 
        items: [] 
      };
    },
    error: (error) => {
      console.error('Lỗi xóa sản phẩm', error);
      alert('Không thể xóa sản phẩm');
      this.cancelConfirmation();
    }
  });
}

// Cập nhật method proceedToCheckout để kiểm tra điều kiện
proceedToCheckout(): void {
  if (this.cart && this.cart.data.cartItems.length > 0) {
    // Kiểm tra xem có sản phẩm nào không
    this.router.navigate(['/order'], {
      state: { 
        cartItems: this.cartItemsWithDetails,
        totalPrice: this.calculateTotalPrice()
      }
    });
  }
}

// Thêm phương thức tính tổng giá
calculateTotalPrice(): number {
  return this.cartItemsWithDetails.reduce((total, item) => 
    total + (item.price * (item.tempQuantity || item.quantity)), 0);
}

}