import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AboutComponent } from './pages/about/about.component';
import { BlogComponent } from './pages/blog/blog.component';
import { ShopComponent } from './pages/shop/shop.component';
import { CartComponent } from './orders/cart/cart.component';
import { ThankyouComponent } from './orders/thankyou/thankyou.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { OtpComponent } from './auth/otp/otp.component';
import { DetailsComponent } from './pages/details/details.component';
import { OrderComponent } from './orders/order/order.component';
import { AdminComponent } from './admin/admin.component';
import { PasswordComponent } from './auth/password/password.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'about', component: AboutComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'products', component: ShopComponent },
  { path: 'cart', component: CartComponent },
  { path: 'thankyou', component: ThankyouComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'otp', component: OtpComponent },
  { path: 'products/:id', component: DetailsComponent },
  { path: 'order', component: OrderComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'password', component: PasswordComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
