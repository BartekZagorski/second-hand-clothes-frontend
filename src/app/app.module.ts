import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from './services/product.service';
import { RouterModule, Routes } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { KeycloakAngularModule } from 'keycloak-angular';
import { OAuthModule } from 'angular-oauth2-oidc';
import { LoginStatusComponent } from './components/login-status/login-status.component';
import { AuthGuard } from './auth.guard';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { OrderHistoryDetailsComponent } from './components/order-history-details/order-history-details.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ImagesComponent } from './components/images/images.component';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { FormsModule } from '@angular/forms';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


const routes: Routes = [

  { path: 'add-product', component: AddProductComponent, canActivate: [AuthGuard], data: { roles: ['second-hand-app-admin']} },
  { path: 'products/:id/images', component: ImagesComponent, canActivate: [AuthGuard], data: { roles: ['second-hand-app-admin']} },
  { path: 'order-history/:email/:id', component: OrderHistoryDetailsComponent, canActivate: [AuthGuard] },
  { path: 'order-history', component: OrderHistoryComponent, canActivate: [AuthGuard], data: { roles: ['second-hand-app-user']} },
  { path: 'checkout', component: CheckoutComponent},
  { path: 'cart-details', component: CartDetailsComponent},
  { path: 'search/:keyword', component: ProductListComponent},
  { path: 'super-category/:superId', component: ProductListComponent },
  { path: 'category/:id', component: ProductListComponent },
  { path: 'category', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'products', component: ProductListComponent },
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: '**', redirectTo: '/products', pathMatch: 'full' }

]

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    LoginStatusComponent,
    OrderHistoryComponent,
    OrderHistoryDetailsComponent,
    ImagesComponent,
    UploadFileComponent,
    AddProductComponent
  ],
  imports: [
    FontAwesomeModule,
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    KeycloakAngularModule,
    OAuthModule.forRoot({
      resourceServer: {
          allowedUrls: ['https://localhost:8443/api/'],
          sendAccessToken: true
      }
  }),
  NgxDropzoneModule,
  FormsModule,
  TypeaheadModule.forRoot(),
  BrowserAnimationsModule
  ],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
