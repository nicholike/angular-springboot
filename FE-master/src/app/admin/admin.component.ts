import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ProductService,
  ProductCreationRequest,
  ProductUpdateRequest,
} from '../services/product.service';
import {
  CategoryCreationRequest,
  CategoryService,
} from '../services/catagory.service';
import { ProductResponse } from '../response/product.response';
import { CategoryResponse } from '../services/catagory.service';
import {
  UserResponse,
  UserService,
  UserUpdateRequest,
} from '../services/user.service';
import {
  OrderCreationRequest,
  OrderResponse,
  OrderStatus,
  OrderStatusUpdateRequest,
  PaginatedOrderResponse,
  PaginatedResponse,
} from '../response/order.resPonse';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  // Active tab
  // activeTab: 'products' | 'categories' | 'users' = 'products';
  activeTab: 'products' | 'categories' | 'users' | 'orders' = 'products';

  // Order management
  orderForm: FormGroup;
  orders: OrderResponse[] = [];
  selectedOrder: OrderResponse | null = null;
  orderStatuses = Object.values(OrderStatus);

  // Product management
  productForm: FormGroup;
  products: ProductResponse[] = [];
  selectedProduct: ProductResponse | null = null;
  productImageFile: File | null = null;

  // Category management
  categoryForm: FormGroup;
  categories: CategoryResponse[] = [];
  selectedCategory: CategoryResponse | null = null;

  userForm: FormGroup;
  users: UserResponse[] = [];
  selectedUser: UserResponse | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private userService: UserService,
    private orderService: OrderService
  ) {
    // Initialize product form
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      categoryId: [null, [Validators.required]],
      image: [null],
    });

    // Initialize category form
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
    });

    this.userForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      name: [''],
      role: ['USER', [Validators.required]],
      address: [''],
      phone: [''],
    });

    this.orderForm = this.fb.group({
      id: [''],
      userId: [''],
      shippingAddress: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      fullName: ['', Validators.required],
      status: [OrderStatus.PENDING, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadUsers();
    this.loadOrders();
  }

  // Tab switching
  // switchTab(tab: 'products' | 'categories'): void {
  //   this.activeTab = tab;
  //   this.resetForms();
  // }

  // Product Management Methods
  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (response) => {
        if (response.data) {
          this.products = response.data.data;
        }
      },
      error: (err) => {
        console.error('Error loading products', err);
        // TODO: Add error handling toast/notification
      },
    });
  }

  onProductImageSelect(event: any): void {
    const file = event.target.files[0];
    this.productImageFile = file;
    this.productForm.patchValue({ image: file });
  }

  onProductSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      // TODO: Handle unauthorized access
      return;
    }

    const productData: ProductCreationRequest = {
      ...this.productForm.value,
      image: this.productImageFile!,
    };

    if (this.selectedProduct) {
      // Update existing product
      this.productService
        .updateProduct(this.selectedProduct.id.toString(), productData, token)
        .subscribe({
          next: () => {
            this.loadProducts();
            this.resetProductForm();
          },
          error: (err) => {
            console.error('Error updating product', err);
            // TODO: Add error handling toast/notification
          },
        });
    } else {
      // Create new product
      this.productService.insertProduct(productData, token).subscribe({
        next: () => {
          this.loadProducts();
          this.resetProductForm();
        },
        error: (err) => {
          console.error('Error creating product', err);
          // TODO: Add error handling toast/notification
        },
      });
    }
  }

  editProduct(product: ProductResponse): void {
    this.selectedProduct = product;
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId,
    });
  }

  deleteProduct(productId: string): void {
    const token = localStorage.getItem('token');
    if (!token) {
      // TODO: Handle unauthorized access
      return;
    }

    this.productService.deleteProduct(productId, token).subscribe({
      next: () => {
        this.loadProducts();
      },
      error: (err) => {
        console.error('Error deleting product', err);
        // TODO: Add error handling toast/notification
      },
    });
  }

  // Category Management Methods
  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
      },
      error: (err) => {
        console.error('Error loading categories', err);
        // TODO: Add error handling toast/notification
      },
    });
  }

  onCategorySubmit(): void {
    if (this.categoryForm.invalid) {
      return;
    }

    const categoryData: CategoryCreationRequest = this.categoryForm.value;

    if (this.selectedCategory) {
      // Update existing category
      this.categoryService
        .updateCategory(this.selectedCategory.id, categoryData)
        .subscribe({
          next: () => {
            this.loadCategories();
            this.resetCategoryForm();
          },
          error: (err) => {
            console.error('Error updating category', err);
            // TODO: Add error handling toast/notification
          },
        });
    } else {
      // Create new category
      this.categoryService.createCategory(categoryData).subscribe({
        next: () => {
          this.loadCategories();
          this.resetCategoryForm();
        },
        error: (err) => {
          console.error('Error creating category', err);
          // TODO: Add error handling toast/notification
        },
      });
    }
  }

  editCategory(category: CategoryResponse): void {
    this.selectedCategory = category;
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description,
    });
  }

  deleteCategory(categoryId: number): void {
    this.categoryService.deleteCategory(categoryId).subscribe({
      next: () => {
        this.loadCategories();
      },
      error: (err) => {
        console.error('Error deleting category', err);
        // TODO: Add error handling toast/notification
      },
    });
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.users = response.data;
      },
      error: (err) => {
        console.error('Error loading users', err);
        // TODO: Add error handling toast/notification
      },
    });
  }
  shouldShowAddressWarning(): boolean {
    const addressControl = this.userForm.get('address');
    return addressControl
      ? (addressControl.dirty || addressControl.touched) &&
          !addressControl.value
      : false;
  }

  shouldShowPhoneWarning(): boolean {
    const phoneControl = this.userForm.get('phone');
    return phoneControl
      ? (phoneControl.dirty || phoneControl.touched) && !phoneControl.value
      : false;
  }
  onUserSubmit(): void {
    Object.keys(this.userForm.controls).forEach((key) => {
      const control = this.userForm.get(key);
      control?.markAsTouched();
    });

    if (this.userForm.invalid) {
      return;
    }

    if (this.selectedUser) {
      // Nếu có sự thay đổi role
      if (this.selectedUser.role !== this.userForm.get('role')?.value) {
        // Gọi phương thức changeRole riêng
        this.userService
          .changeRole(this.selectedUser.id, this.userForm.get('role')?.value)
          .subscribe({
            next: () => {
              // Sau khi đổi role, mới tiến hành update user
              this.updateUserDetails();
            },
            error: (err) => {
              console.error('Error changing user role', err);
            },
          });
      } else {
        // Nếu không thay đổi role, chỉ update thông tin user
        this.updateUserDetails();
      }
    }
  }

  // Phương thức riêng để update user details
  updateUserDetails(): void {
    const userData: UserUpdateRequest = {
      name: this.userForm.get('name')?.value,
      email: this.userForm.get('email')?.value,
      address: this.userForm.get('address')?.value,
      phone: this.userForm.get('phone')?.value,
    };

    this.userService
      .updateUserByAdmin(this.selectedUser!.id, userData)
      .subscribe({
        next: () => {
          this.loadUsers();
          this.resetUserForm();
        },
        error: (err) => {
          console.error('Error updating user', err);
        },
      });
  }

  editUser(user: UserResponse): void {
    this.selectedUser = user;
    this.userForm.patchValue({
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
      address: user.address,
      phone: user.phone,
    });
  }

  deleteUser(userId: string): void {
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error deleting user', err);
        // TODO: Add error handling toast/notification
      },
    });
  }

  resetUserForm(): void {
    this.userForm.reset({
      role: 'USER',
    });
    this.selectedUser = null;
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (response) => {
        // Kiểm tra và truy cập mảng con data
        if (response.data && Array.isArray(response.data.data)) {
          console.log(response);
          this.orders = response.data.data;
        } else {
          console.error('Unexpected response structure', response);
          this.orders = []; // Fallback to an empty array
        }
      },
      error: (err) => {
        console.error('Error loading orders', err);
        this.orders = []; // Ensure orders is an empty array on error
      },
    });
  }

  onOrderSubmit(): void {
    if (this.orderForm.invalid) {
      return;
    }

    if (this.selectedOrder) {
      // Kiểm tra nếu chỉ muốn cập nhật status
      const statusValue = this.orderForm.get('status')?.value;
      if (statusValue && statusValue !== this.selectedOrder.status) {
        // Sử dụng updateOrderStatus với interface riêng
        const statusUpdateRequest: OrderStatusUpdateRequest = {
          status: statusValue,
        };

        this.orderService
          .updateOrderStatus(this.selectedOrder.id, statusUpdateRequest)
          .subscribe({
            next: () => {
              this.loadOrders();
              this.resetOrderForm();
            },
            error: (err) => {
              console.error('Error updating order status', err);
              // TODO: Add error handling toast/notification
            },
          });
      } else {
        // Nếu muốn cập nhật toàn bộ thông tin đơn hàng
        const mappedOrderItems = this.selectedOrder.orderItems.map((item) => ({
          productId: parseInt(item.productId),
          quantity: item.quantity,
          price: item.price,
        }));

        const orderUpdateRequest: OrderCreationRequest = {
          fullName: this.selectedOrder.fullName,
          phoneNumber: this.selectedOrder.phoneNumber,
          shippingAddress: this.selectedOrder.shippingAddress,
          orderItems: mappedOrderItems,
          status: this.selectedOrder.status, // Thêm status nếu cần
        };

        this.orderService
          .updateOrder(this.selectedOrder.id, orderUpdateRequest)
          .subscribe({
            next: () => {
              this.loadOrders();
              this.resetOrderForm();
            },
            error: (err) => {
              console.error('Error updating order', err);
              // TODO: Add error handling toast/notification
            },
          });
      }
    }
  }

  editOrder(order: OrderResponse): void {
    this.selectedOrder = order;
    this.orderForm.patchValue({
      id: order.id,
      userId: order.userId,
      shippingAddress: order.shippingAddress,
      phoneNumber: order.phoneNumber,
      fullName: order.fullName,
      status: order.status,
    });
  }
  deleteOrder(orderId: string): void {
    this.orderService.deleteOrder(orderId).subscribe({
      next: () => {
        this.loadOrders();
      },
      error: (err) => {
        console.error('Error deleting order', err);
        // TODO: Add error handling toast/notification
      },
    });
  }
  // Form Reset Methods
  resetProductForm(): void {
    this.productForm.reset();
    this.selectedProduct = null;
    this.productImageFile = null;
  }

  resetCategoryForm(): void {
    this.categoryForm.reset();
    this.selectedCategory = null;
  }

  resetOrderForm(): void {
    this.orderForm.reset({
      status: OrderStatus.PENDING,
    });
    this.selectedOrder = null;
  }

  // Update existing method
  switchTab(tab: 'products' | 'categories' | 'users' | 'orders'): void {
    this.activeTab = tab;
    this.resetForms();
  }

  // Update resetForms method
  resetForms(): void {
    this.resetProductForm();
    this.resetCategoryForm();
    this.resetUserForm();
    this.resetOrderForm();
  }
}
