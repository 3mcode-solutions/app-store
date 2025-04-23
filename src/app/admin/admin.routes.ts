import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';

// سيتم إضافة حارس المصادقة لاحقاً
// import { AuthGuard } from '../shared/guards/auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    // canActivate: [AuthGuard], // سيتم تفعيله لاحقاً
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { 
        path: 'dashboard', 
        loadComponent: () => import('./dashboard/dashboard.component')
          .then(m => m.DashboardComponent) 
      },
      { 
        path: 'products', 
        loadComponent: () => import('./products/products.component')
          .then(m => m.ProductsComponent) 
      },
      { 
        path: 'categories', 
        loadComponent: () => import('./categories/categories.component')
          .then(m => m.CategoriesComponent) 
      },
      { 
        path: 'orders', 
        loadComponent: () => import('./orders/orders.component')
          .then(m => m.OrdersComponent) 
      },
      { 
        path: 'users', 
        loadComponent: () => import('./users/users.component')
          .then(m => m.UsersComponent) 
      },
      { 
        path: 'settings', 
        loadComponent: () => import('./settings/settings.component')
          .then(m => m.SettingsComponent) 
      }
    ]
  }
];
