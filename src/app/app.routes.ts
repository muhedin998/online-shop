import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { DeliveryComponent } from './pages/delivery/delivery.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RegisterComponent } from './pages/register/register.component';
import { AdminComponent } from './pages/admin/admin.component';
import { adminGuard } from './services/admin.guard';
import { roleGuard } from './services/role.guard';
import { OrdersComponent } from './pages/orders/orders.component';
import { OrderDetailComponent } from './pages/orders/order-detail.component';
import { AddressesComponent } from './pages/addresses/addresses.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password.component';
import { ResetPasswordComponent } from './pages/auth/reset-password.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'BarberShop | Početna' },
  { path: 'favorites', redirectTo: 'omiljeni' },
  { path: 'cart', redirectTo: 'korpa' },
  { path: 'omiljeni', component: FavoritesComponent, title: 'Omiljeni | BarberShop' },
  { path: 'korpa', component: CartComponent, title: 'Korpa | BarberShop' },
  { path: 'placanje', component: PaymentComponent, title: 'Plaćanje | BarberShop' },
  { path: 'dostava', component: DeliveryComponent, title: 'Dostava | BarberShop' },
  { path: 'checkout', component: CheckoutComponent, title: 'Pregled | BarberShop' },
  { path: 'profil', component: ProfileComponent, title: 'Profil | BarberShop' },
  { path: 'registracija', component: RegisterComponent, title: 'Registracija | BarberShop' },
  { path: 'admin', component: AdminComponent, title: 'Admin | BarberShop', canMatch: [roleGuard(['ROLE_ADMIN','ROLE_EMPLOYEE'])] },
  { path: 'orders', component: OrdersComponent, title: 'Porudžbine | BarberShop' },
  { path: 'orders/:id', component: OrderDetailComponent, title: 'Detalji porudžbine | BarberShop' },
  { path: 'addresses', component: AddressesComponent, title: 'Adrese | BarberShop' },
  { path: 'auth/forgot-password', component: ForgotPasswordComponent, title: 'Zaboravljena lozinka' },
  { path: 'auth/reset-password', component: ResetPasswordComponent, title: 'Reset lozinke' },
  { path: '**', redirectTo: '' }
];
