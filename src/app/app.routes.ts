import { Routes } from '@angular/router';
import { AUTH_ROUTES } from './auth/auth.routes';
import { ADMIN_ROUTES } from './admin/admin.routes';
import { StoreLayoutComponent } from './layout/store-layout.component';

export const routes: Routes = [
  // Store routes
  {
    path: '',
    component: StoreLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent)
      },
      {
        path: 'products/category/electronics',
        loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent),
        data: { category: 'electronics', title: 'إلكترونيات' }
      },
      {
        path: 'products/category/clothing',
        loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent),
        data: { category: 'clothing', title: 'ملابس' }
      },
      {
        path: 'products/category/furniture',
        loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent),
        data: { category: 'furniture', title: 'أثاث منزلي' }
      },
      {
        path: 'products/category/sports',
        loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent),
        data: { category: 'sports', title: 'مستلزمات رياضية' }
      },
      {
        path: 'categories',
        loadComponent: () => import('./pages/categories/categories.component').then(m => m.CategoriesComponent)
      },
      {
        path: 'cart',
        loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent)
      },
      {
        path: 'offers',
        loadComponent: () => import('./pages/offers/offers.component').then(m => m.OffersComponent)
      },
      {
        path: 'about',
        loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent)
      },
      {
        path: 'services',
        loadComponent: () => import('./pages/services/services.component').then(m => m.ServicesComponent)
      },
      {
        path: 'portfolio',
        loadComponent: () => import('./pages/portfolio/portfolio.component').then(m => m.PortfolioComponent)
      },
      {
        path: 'team',
        loadComponent: () => import('./pages/team/team.component').then(m => m.TeamComponent)
      },
      {
        path: 'contact',
        loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent)
      },
      {
        path: 'faq',
        loadComponent: () => import('./pages/faq/faq.component').then(m => m.FaqComponent)
      },
      {
        path: 'pricing',
        loadComponent: () => import('./pages/pricing/pricing.component').then(m => m.PricingComponent)
      },
      {
        path: 'features',
        loadComponent: () => import('./pages/features/features.component').then(m => m.FeaturesComponent)
      },
      {
        path: 'wishlist',
        loadComponent: () => import('./pages/wishlist/wishlist.component').then(m => m.WishlistComponent),
        title: 'المفضلة'
      },
      {
        path: 'compare',
        loadComponent: () => import('./pages/compare/compare.component').then(m => m.CompareComponent),
        title: 'مقارنة المنتجات'
      },
      ...AUTH_ROUTES
    ]
  },

  // Admin routes - completely separate from store routes
  ...ADMIN_ROUTES,

  // Fallback route
  {
    path: '**',
    redirectTo: 'home'
  }
];
