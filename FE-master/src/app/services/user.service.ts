import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpUtilService } from './http.util.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { LoginDTO } from '../dto/user/login.dto';
import { RegisterResponse } from '../response/register.response';
import { TokenService } from './token.service';


export interface UserResponse {
  id: string;
  username: string;
  email: string;
  name?: string;
  role: string;
  address?: string; 
  phone?: string; 
}
export interface UserCreationRequest {
  username: string;
  email: string;
  password: string;
  name?: string;
  role?: string;
  address?: string; 
  phone?: string; 
}

export interface UserUpdateRequest {
  id?: string;
  name?: string;  // Change from fullName to name
  email?: string;
  role?: string;
  address?: string; 
  phone?: string; 
}
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordRequest {
  newPassword: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiRegister = `${environment.apiBaseUrl}/users`;
  private apiLogin = `${environment.apiBaseUrl}/auth/token`;
  private apiUserDetail = `${environment.apiBaseUrl}/users/me`;
  localStorage?: Storage;

  // BehaviorSubject để quản lý trạng thái người dùng
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private httpUtilService: HttpUtilService,
    private tokenService: TokenService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) { 
    // Chỉ truy cập localStorage khi là môi trường trình duyệt
    if (isPlatformBrowser(this.platformId)) {
      this.localStorage = this.document.defaultView?.localStorage;
      
      // Khởi tạo ban đầu từ localStorage
      const storedUser = this.getUserResponseFromLocalStorage();
      this.userSubject.next(storedUser);
    }
  }

  register(userData: any): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(this.apiRegister, userData);
  }

  login(loginDTO: LoginDTO): Observable<any> {    
    return this.http.post(this.apiLogin, loginDTO);
  }
  isAuthenticated(): boolean {
    return !this.tokenService.isTokenExpired();
  }
  getUserDetail(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(this.apiUserDetail, { headers });
  }

  saveUserResponseToLocalStorage(userResponse: any) {
    try {
      if (userResponse) {
        localStorage.setItem('user', JSON.stringify(userResponse));
        // Cập nhật BehaviorSubject
        this.userSubject.next(userResponse);
      }
    } catch (error) {
      console.error('Error saving user response to local storage:', error);
    }
  }

  getUserResponseFromLocalStorage(): any {
    if (typeof localStorage !== 'undefined') {
      try {
        const userResponseJSON = localStorage.getItem('user');
        return userResponseJSON ? JSON.parse(userResponseJSON) : null;
      } catch (error) {
        console.error('Error retrieving user response from local storage:', error);
        return null;
      }
    }
    return null;
  }

  removeUserFromLocalStorage(): void {
    try {
      localStorage.removeItem('user');
      // Đặt lại BehaviorSubject về null
      this.userSubject.next(null);
    } catch (error) {
      console.error('Error removing user data from local storage:', error);
    }
  }
  getAllUsers(): Observable<ApiResponse<UserResponse[]>> {
    return this.http.get<ApiResponse<UserResponse[]>>(`${environment.apiBaseUrl}/users`);
  }
  getUserById(id: string): Observable<ApiResponse<UserResponse>> {
    return this.http.get<ApiResponse<UserResponse>>(`${environment.apiBaseUrl}/users/${id}`);
  }
  getProfile(): Observable<ApiResponse<UserResponse>> {
    return this.http.get<ApiResponse<UserResponse>>(`${environment.apiBaseUrl}/users/me`);
  }
  updateUser(userUpdateRequest: UserUpdateRequest): Observable<ApiResponse<UserResponse>> {
    return this.http.put<ApiResponse<UserResponse>>(`${environment.apiBaseUrl}/users`, userUpdateRequest);
  }
  updateUserByAdmin(id: string, userUpdateRequest: UserUpdateRequest): Observable<ApiResponse<UserResponse>> {
    return this.http.put<ApiResponse<UserResponse>>(`${environment.apiBaseUrl}/users/${id}`, userUpdateRequest);
  }
  changePassword(changePasswordRequest: ChangePasswordRequest): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(`${environment.apiBaseUrl}/users/changePassword`, changePasswordRequest);
  }

  // Reset password (by admin)
  resetPassword(id: string, resetPasswordRequest: ResetPasswordRequest): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(`${environment.apiBaseUrl}/users/resetPassword/${id}`, resetPasswordRequest);
  }
  searchUsers(keyword: string): Observable<ApiResponse<UserResponse[]>> {
    return this.http.get<ApiResponse<UserResponse[]>>(`${environment.apiBaseUrl}/users/search`, {
      params: new HttpParams().set('keyword', keyword)
    });
  }

  // Change user role
  changeRole(id: string, role: string): Observable<ApiResponse<UserResponse>> {
    return this.http.put<ApiResponse<UserResponse>>(`${environment.apiBaseUrl}/users/changeRole/${id}`, {}, {
      params: new HttpParams().set('role', role)
    });
  }

  // Delete user
  deleteUser(id: string): Observable<ApiResponse<UserResponse>> {
    return this.http.delete<ApiResponse<UserResponse>>(`${environment.apiBaseUrl}/users/${id}`);
  }

}