import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { MenuComponent } from './pages/menu/menu.component';
import { NewsComponent } from './pages/news/news.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { ProductManagementComponent } from './pages/admin/product-management/product-management.component';
import { CategoryManagementComponent } from './pages/admin/category-management/category-management.component';
import { ReservationManagementComponent } from './pages/admin/reservation-management/reservation-management.component';
import { NewsManagementComponent } from './pages/admin/news-management/news-management.component';
import { CompanyConfigComponent } from './pages/admin/company-config/company-config.component';
import { authGuard } from './guards/auth.guard';
import { MainLayoutComponent } from './components/layouts/main-layout/main-layout.component';
import { AdminLayoutComponent } from './components/layouts/admin-layout/admin-layout.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'products', component: ProductManagementComponent },
      { path: 'categories', component: CategoryManagementComponent },
      { path: 'reservations', component: ReservationManagementComponent },
      { path: 'news', component: NewsManagementComponent },
      { path: 'config', component: CompanyConfigComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'menu', component: MenuComponent },
      { path: 'news', component: NewsComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
