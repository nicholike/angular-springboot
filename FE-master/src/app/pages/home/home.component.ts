import { Component, OnInit } from '@angular/core';
import { ProductService, ApiResponse } from '../../services/product.service';
import { ProductResponse } from '../../response/product.response';
import { PaginatedResponse } from '../../response/paginated.response';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  // Danh sách sản phẩm
  products: ProductResponse[] = [];

  // Thông tin phân trang
  currentPage: number = 0;
  pageSize: number = 3; // Số lượng sản phẩm trên mỗi trang
  totalPages: number = 0;
  totalProducts: number = 0;

  // Trạng thái tải và lỗi
  isLoading: boolean = false;
  hasError: boolean = false;
  errorMessage: string = '';

  // Trạng thái sản phẩm
  hasProducts: boolean = false;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  // Tìm kiếm sản phẩm
  searchProducts(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const keyword = inputElement.value;
  
    // Đặt lại trạng thái
    this.isLoading = true;
    this.hasError = false;
  
    // Nếu từ khóa rỗng, tải lại tất cả sản phẩm
    if (!keyword || keyword.trim() === '') {
      this.loadProducts();
      return;
    }
  
    this.productService.searchProducts(keyword.trim()).subscribe({
      next: (response: ApiResponse<ProductResponse[]>) => {
        // Cập nhật danh sách sản phẩm từ kết quả tìm kiếm
        this.products = response.data || [];
        this.hasProducts = this.products.length > 0;
  
        // Reset pagination cho kết quả tìm kiếm
        this.currentPage = 0;
        this.totalPages = 1;
        this.totalProducts = this.products.length;
  
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Lỗi tìm kiếm sản phẩm:', error);
        this.hasError = true;
        this.isLoading = false;
        this.errorMessage = 'Không thể tìm kiếm sản phẩm. Vui lòng thử lại sau.';
        this.hasProducts = false;
        this.products = [];
      }
    });
  }

  // Tải danh sách sản phẩm
  loadProducts(page: number = 0): void {
    // Bắt đầu quá trình tải
    this.isLoading = true;
    this.hasError = false;
  
    this.productService.getProducts(page, this.pageSize).subscribe({
      next: (response: ApiResponse<PaginatedResponse>) => {
        // Add explicit null/undefined checks
        if (!response || !response.data) {
          console.error('Invalid response structure', response);
          this.handleNoProducts();
          return;
        }
  
        const paginatedData = response.data;
        
        // More robust checks for paginatedData
        if (!paginatedData) {
          console.error('Paginated data is undefined', response);
          this.handleNoProducts();
          return;
        }
  
        // Use 'data' instead of 'content'
        const products = paginatedData.data || [];
        
        // Cập nhật danh sách sản phẩm
        this.products = products;
        
        // Cập nhật thông tin phân trang
        this.currentPage = paginatedData.currentPage ?? 0;
        this.totalPages = paginatedData.totalPages ?? 0;
        this.totalProducts = paginatedData.totalItems ?? 0;
  
        // Kiểm tra xem có sản phẩm không
        this.hasProducts = this.products.length > 0;
  
        // Kết thúc quá trình tải
        this.isLoading = false;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  private handleNoProducts(): void {
    this.products = [];
    this.hasProducts = false;
    this.currentPage = 0;
    this.totalPages = 0;
    this.totalProducts = 0;
    this.isLoading = false;
    this.hasError = false;
  }
  
  // Add a helper method to handle errors
  private handleError(error: any): void {
    console.error('Lỗi tải sản phẩm:', error);
    this.hasError = true;
    this.isLoading = false;
    this.errorMessage = 'Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.';
    this.handleNoProducts();
  }

  // Chuyển trang
  changePage(pageNumber: number): void {
    if (pageNumber >= 0 && pageNumber < this.totalPages) {
      this.loadProducts(pageNumber);
    }
  }
}