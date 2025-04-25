import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';

// سيتم إضافة حارس المصادقة لاحقاً
// import { AuthGuard } from '../shared/guards/auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    // canActivate: [AuthGuard], // سيتم تفعيله لاحقاً
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      // لوحة القيادة
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component')
          .then(m => m.DashboardComponent)
      },

      // المنتجات
      {
        path: 'products',
        loadComponent: () => import('./products/products.component')
          .then(m => m.ProductsComponent)
      },
      {
        path: 'products/add',
        loadComponent: () => import('./products/add-product/add-product.component')
          .then(m => m.AddProductComponent)
      },
      {
        path: 'products/inventory',
        loadComponent: () => import('./products/inventory/inventory.component')
          .then(m => m.InventoryComponent)
      },

      // التصنيفات
      {
        path: 'categories',
        loadComponent: () => import('./categories/categories.component')
          .then(m => m.CategoriesComponent)
      },
      {
        path: 'categories/add',
        loadComponent: () => import('./categories/add-category/add-category.component')
          .then(m => m.AddCategoryComponent)
      },

      // الطلبات
      {
        path: 'orders',
        loadComponent: () => import('./orders/orders.component')
          .then(m => m.OrdersComponent)
      },
      {
        path: 'orders/pending',
        loadComponent: () => import('./orders/pending-orders/pending-orders.component')
          .then(m => m.PendingOrdersComponent)
      },
      {
        path: 'orders/shipping',
        loadComponent: () => import('./orders/shipping-orders/shipping-orders.component')
          .then(m => m.ShippingOrdersComponent)
      },

      // المستخدمين
      {
        path: 'users',
        loadComponent: () => import('./users/users.component')
          .then(m => m.UsersComponent)
      },
      {
        path: 'users/add',
        loadComponent: () => import('./users/add-user/add-user.component')
          .then(m => m.AddUserComponent)
      },

      // التسويق
      {
        path: 'marketing/coupons',
        loadComponent: () => import('./marketing/coupons/coupons.component')
          .then(m => m.CouponsComponent)
      },
      {
        path: 'marketing/promotions',
        loadComponent: () => import('./marketing/promotions/promotions.component')
          .then(m => m.PromotionsComponent)
      },

      // التقارير
      {
        path: 'reports/sales',
        loadComponent: () => import('./reports/sales-report/sales-report.component')
          .then(m => m.SalesReportComponent)
      },
      {
        path: 'reports/customers',
        loadComponent: () => import('./reports/customers-report/customers-report.component')
          .then(m => m.CustomersReportComponent)
      },
      {
        path: 'reports/inventory',
        loadComponent: () => import('./reports/inventory-report/inventory-report.component')
          .then(m => m.InventoryReportComponent)
      },

      // الإعدادات
      {
        path: 'settings/general',
        loadComponent: () => import('./settings/general/general.component')
          .then(m => m.GeneralComponent)
      },
      {
        path: 'settings/shipping',
        loadComponent: () => import('./settings/shipping/shipping.component')
          .then(m => m.ShippingComponent)
      },
      {
        path: 'settings/payment',
        loadComponent: () => import('./settings/payment/payment.component')
          .then(m => m.PaymentComponent)
      }
    ]
  }
];
