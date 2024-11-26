import { Router } from '@angular/router';
import { UserService } from "../../services/user.service";
import { Component, OnInit } from "@angular/core";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  userInfo: any = null;
  showUserMenu = false;
  private userSubscription!: Subscription;
  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Theo dõi thay đổi của người dùng
    this.userSubscription = this.userService.user$.subscribe(
      (userResponse) => {
        this.userInfo = userResponse;
      }
    );
  }

  ngOnDestroy(): void {
    // Hủy đăng ký để tránh memory leak
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  getUserInfo() {
    this.userInfo = this.userService.getUserResponseFromLocalStorage();
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  logout() {
    // Remove user information from localStorage
    localStorage.removeItem('token');
    this.userService.removeUserFromLocalStorage();
    
    // Navigate to login page
    this.router.navigate(['/login']);
  }

  navigateToLogin() {
    this.showUserMenu = false;
    this.router.navigate(['/login']);
  }

  navigateToChangePassword() {
    this.showUserMenu = false;
    this.router.navigate(['/password']);
  }
  closeUserMenu() {
    this.showUserMenu = false;
  }
}