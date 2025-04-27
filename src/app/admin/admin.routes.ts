import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AuthGuard } from '../shared/guards/auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] },
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
      {
        path: 'orders/all',
        loadComponent: () => import('./orders/orders.component')
          .then(m => m.OrdersComponent)
      },

      // العملاء
      {
        path: 'customers',
        loadComponent: () => import('./customers/customers.component')
          .then(m => m.CustomersComponent)
      },
      {
        path: 'customers/groups',
        loadComponent: () => import('./customers/groups/customer-groups.component')
          .then(m => m.CustomerGroupsComponent)
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
      {
        path: 'marketing/newsletter',
        loadComponent: () => import('./marketing/newsletter/newsletter.component')
          .then(m => m.NewsletterComponent)
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
      {
        path: 'reports/products',
        loadComponent: () => import('./reports/products-report/products-report.component')
          .then(m => m.ProductsReportComponent)
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
      },
      {
        path: 'settings/account',
        loadComponent: () => import('./settings/account/account.component')
          .then(m => m.AccountSettingsComponent)
      },
      {
        path: 'settings/users',
        loadComponent: () => import('./settings/users/users-settings.component')
          .then(m => m.UsersSettingsComponent)
      },

      // الملف الشخصي
      {
        path: 'profile',
        loadComponent: () => import('./profile/profile.component')
          .then(m => m.ProfileComponent)
      },

      // المساعدة
      {
        path: 'help',
        loadComponent: () => import('./help/help.component')
          .then(m => m.HelpComponent)
      },

      // الإشعارات
      {
        path: 'notifications',
        loadComponent: () => import('./notifications/notifications.component')
          .then(m => m.NotificationsComponent)
      },

      // الرسائل
      {
        path: 'messages',
        loadComponent: () => import('./messages/messages.component')
          .then(m => m.MessagesComponent)
      },

      // اختبار الإشعارات المنبثقة
      {
        path: 'toast-demo',
        loadComponent: () => import('./toast-demo/toast-demo.component')
          .then(m => m.ToastDemoComponent)
      },

      // إدارة الصفحات
      {
        path: 'pages',
        loadComponent: () => import('./pages/pages.component')
          .then(m => m.PagesComponent)
      }
    ]
  }
];
