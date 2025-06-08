import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { ProductosComponent } from './productos/productos.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'carrito', component: ProductosComponent },
  { path: 'resumen-compra', component: ProductosComponent, canActivate: [MsalGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [MsalGuard] },
  { path: 'auth', loadComponent: () => import('./auth/auth.component').then(m => m.AuthComponent) },
];