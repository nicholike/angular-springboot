import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService, ProductCreationRequest, ProductUpdateRequest } from '../services/product.service';
import { CategoryCreationRequest, CategoryService } from '../services/catagory.service';
import { ProductResponse } from '../response/product.response';
import { CategoryResponse } from '../services/catagory.service';
import { UserResponse, UserService, UserUpdateRequest } from '../services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  // Active tab
  activeTab: 'products' | 'categories' | 'users' = 'products';

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
    private userService: UserService
  ) {
    // Initialize product form
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      categoryId: [null, [Validators.required]],
      image: [null]
    });

    // Initialize category form
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['']
    });

    this.userForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      name: [''],
      role: ['USER', [Validators.required]],
      address: [''],
      phone: ['']
    });

  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadUsers();
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
      }
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
      image: this.productImageFile!
    };

    if (this.selectedProduct) {
      // Update existing product
      this.productService.updateProduct(
        this.selectedProduct.id.toString(), 
        productData, 
        token
      ).subscribe({
        next: () => {
          this.loadProducts();
          this.resetProductForm();
        },
        error: (err) => {
          console.error('Error updating product', err);
          // TODO: Add error handling toast/notification
        }
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
        }
      });
    }
  }

  editProduct(product: ProductResponse): void {
    this.selectedProduct = product;
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId
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
      }
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
      }
    });
  }

  onCategorySubmit(): void {
    if (this.categoryForm.invalid) {
      return;
    }

    const categoryData: CategoryCreationRequest = this.categoryForm.value;

    if (this.selectedCategory) {
      // Update existing category
      this.categoryService.updateCategory(
        this.selectedCategory.id, 
        categoryData
      ).subscribe({
        next: () => {
          this.loadCategories();
          this.resetCategoryForm();
        },
        error: (err) => {
          console.error('Error updating category', err);
          // TODO: Add error handling toast/notification
        }
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
        }
      });
    }
  }

  editCategory(category: CategoryResponse): void {
    this.selectedCategory = category;
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description
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
      }
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
      }
    });
  }

  onUserSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }
  
    if (this.selectedUser) {
      // Nếu có sự thay đổi role
      if (this.selectedUser.role !== this.userForm.get('role')?.value) {
        // Gọi phương thức changeRole riêng
        this.userService.changeRole(this.selectedUser.id, this.userForm.get('role')?.value).subscribe({
          next: () => {
            // Sau khi đổi role, mới tiến hành update user
            this.updateUserDetails();
          },
          error: (err) => {
            console.error('Error changing user role', err);
          }
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
      phone: this.userForm.get('phone')?.value
    };
  
    this.userService.updateUserByAdmin(this.selectedUser!.id, userData).subscribe({
      next: () => {
        this.loadUsers();
        this.resetUserForm();
      },
      error: (err) => {
        console.error('Error updating user', err);
      }
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
      phone :user.phone
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
      }
    });
  }

  resetUserForm(): void {
    this.userForm.reset({
      role: 'USER'
    });
    this.selectedUser = null;
  }

  // Update existing method
  switchTab(tab: 'products' | 'categories' | 'users'): void {
    this.activeTab = tab;
    this.resetForms();
  }

  resetForms(): void {
    this.resetProductForm();
    this.resetCategoryForm();
    this.resetUserForm();
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


}