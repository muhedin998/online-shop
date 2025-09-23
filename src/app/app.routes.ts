import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { FavoritesComponent } from './pages/favorites.component';
import { CartComponent } from './pages/cart.component';
import { CheckoutComponent } from './pages/checkout.component';
import { PaymentComponent } from './pages/payment.component';
import { DeliveryComponent } from './pages/delivery.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'BarberShop | Početna' },
  { path: 'favorites', redirectTo: 'omiljeni' },
  { path: 'cart', redirectTo: 'korpa' },
  { path: 'omiljeni', component: FavoritesComponent, title: 'Omiljeni | BarberShop' },
  { path: 'korpa', component: CartComponent, title: 'Korpa | BarberShop' },
  { path: 'placanje', component: PaymentComponent, title: 'Plaćanje | BarberShop' },
  { path: 'dostava', component: DeliveryComponent, title: 'Dostava | BarberShop' },
  { path: 'checkout', component: CheckoutComponent, title: 'Pregled | BarberShop' },
  { path: '**', redirectTo: '' }
];
