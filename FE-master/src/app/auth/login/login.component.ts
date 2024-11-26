import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { LoginDTO } from '../../dto/user/login.dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.loginForm.valid) {
      const loginDTO = new LoginDTO({
        username: this.loginForm.get('username')?.value,
        password: this.loginForm.get('password')?.value
      });
  
      this.userService.login(loginDTO).subscribe({
        next: (response) => {
          if (response.data && response.data.token) {
            localStorage.setItem('token', response.data.token);
            
            this.userService.getUserDetail(response.data.token).subscribe({
              next: (userDetails) => {
                this.userService.saveUserResponseToLocalStorage(userDetails);
                
                // Role-based navigation
                if (userDetails.data.role === 'ADMIN') {
                  this.router.navigate(['/admin']);
                } else {
                  this.router.navigate(['/home']);
                }
              },
              error: (error) => {
                console.error('Error fetching user details', error);
              }
            });
          }
        },
        error: (error) => {
          console.error('Login failed', error);
        }
      });
    }
  }
}