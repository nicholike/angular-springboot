import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {
  passwordForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private userService: UserService,
    private router: Router
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(5),Validators.maxLength(20)]],
      newPassword: ['', [Validators.required, Validators.minLength(5),Validators.maxLength(20)]]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.passwordForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { currentPassword, newPassword } = this.passwordForm.value;

    this.userService.changePassword({
      currentPassword: currentPassword,
      newPassword: newPassword
    }).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Password changed successfully';
        // Optionally redirect or show success message
        setTimeout(() => {
          this.router.navigate(['/home']); // or wherever you want to redirect
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to change password. Please try again.';
      }
    });
  }
}