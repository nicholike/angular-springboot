  import { NgModule } from '@angular/core';
  import {
    BrowserModule,
    provideClientHydration,
  } from '@angular/platform-browser';
  import { CommonModule } from '@angular/common';
  import { ReactiveFormsModule } from '@angular/forms';
  import { AppRoutingModule } from './app-routing.module';
  import { AppComponent } from './app.component';
  import { HeaderComponent } from './components/header/header.component';
  import { FooterComponent } from './components/footer/footer.component';
  import { HomeComponent } from './pages/home/home.component';
  import { AboutComponent } from './pages/about/about.component';
  import { ContactComponent } from './pages/contact/contact.component';
  import { BlogComponent } from './pages/blog/blog.component';
  import { ShopComponent } from './pages/shop/shop.component';
  import { CartComponent } from './orders/cart/cart.component';
  import { ThankyouComponent } from './orders/thankyou/thankyou.component';
  import { LoginComponent } from './auth/login/login.component';
  import { RegisterComponent } from './auth/register/register.component';
  import { OtpComponent } from './auth/otp/otp.component';
  import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
  import { DetailsComponent } from './pages/details/details.component';
  import { AuthInterceptor } from './auth.interceptor';
import { OrderComponent } from './orders/order/order.component';
import { AdminComponent } from './admin/admin.component';
import { PasswordComponent } from './auth/password/password.component';

  @NgModule({
    declarations: [
      AppComponent,
      HeaderComponent,
      FooterComponent,
      HomeComponent,
      AboutComponent,
      ContactComponent,
      BlogComponent,
      ShopComponent,
      CartComponent,
      ThankyouComponent,
      LoginComponent,
      RegisterComponent,
      OtpComponent,
      DetailsComponent,
      AdminComponent,
      PasswordComponent
     
    ],
    imports: [HttpClientModule,BrowserModule, ReactiveFormsModule, AppRoutingModule, CommonModule,OrderComponent],
    providers: [
      provideClientHydration(),
      {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
      }
    ],
    bootstrap: [AppComponent],
  })
  export class AppModule {}
