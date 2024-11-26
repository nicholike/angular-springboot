import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  registerError: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup | null): { [key: string]: boolean } | null {
    if (!form) return null;

    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (!password || !confirmPassword) return null;

    return password.value !== confirmPassword.value 
      ? { passwordMismatch: true } 
      : null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { confirmPassword, ...registerData } = this.registerForm.value;

      this.userService.register(registerData).subscribe({
        next: (response) => {
          const loginDTO = {
            username: registerData.username,
            password: registerData.password
          };

          this.userService.login(loginDTO).subscribe({
            next: (loginResponse) => {
              if (loginResponse.data && loginResponse.data.token) {
                localStorage.setItem('token', loginResponse.data.token);
                
                this.userService.getUserDetail(loginResponse.data.token).subscribe({
                  next: (userDetails) => {
                    this.userService.saveUserResponseToLocalStorage(userDetails);
                    this.router.navigate(['/home']);
                  },
                  error: (error) => {
                    console.error('Error fetching user details', error);
                  }
                });
              }
            },
            error: (error) => {
              if (error.error && error.error.code === 1001) {
                this.registerError = error.error.message || 'Tên người dùng đã tồn tại';
              } else {
                this.registerError = 'Đăng ký thất bại';
              }
            }
          });
        },
        error: (error) => {
          console.error('Registration failed', error);
        }
      });
    }
  }
}