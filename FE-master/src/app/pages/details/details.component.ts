import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service'; // Import CartService
import { ProductResponse } from '../../response/product.response';
import { ItemToCartRequest } from '../../response/cart.response'; // Import request model

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  product: ProductResponse | null = null;
  isLoading: boolean = true;
  hasError: boolean = false;
  errorMessage: string = '';
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService // Inject CartService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const productId = params.get('id');
      if (productId) {
        this.fetchProductDetails(productId);
      } else {
        this.handleError('Không tìm thấy ID sản phẩm');
      }
    });
  }

  private fetchProductDetails(productId: string): void {
    this.isLoading = true;
    this.hasError = false;

    this.productService.getDetailProduct(productId).subscribe({
      next: (response: any) => {
        if (response.data) {
          this.product = response.data;
          this.isLoading = false;
        } else {
          this.handleError('Không tìm thấy thông tin sản phẩm');
        }
      },
      error: (error) => {
        this.handleError('Không thể tải chi tiết sản phẩm. Vui lòng thử lại sau.');
        console.error('Lỗi tải chi tiết sản phẩm:', error);
      }
    });
  }

  private handleError(message: string): void {
    this.isLoading = false;
    this.hasError = true;
    this.errorMessage = message;
    this.product = null;
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (this.product) {
      const cartItem: ItemToCartRequest = {
        productId: this.product.id,
        quantity: this.quantity
      };

      this.cartService.addToCart(cartItem).subscribe({
        next: (response) => {
          // Hiển thị thông báo thành công
          alert('Đã thêm sản phẩm vào giỏ hàng');
        },
        error: (error) => {
          // Xử lý lỗi
          console.error('Lỗi khi thêm sản phẩm vào giỏ hàng', error);
          alert('Không thể thêm sản phẩm vào giỏ hàng');
        }
      });
    }
  }
}