import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from  '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import { HomePageComponent } from './components/home-page/home-page.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatInputModule } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MenuComponent } from './components/menu/menu.component';
import { TokenInterceptor } from './components/shared/tokenInterceptor';
import { OrderComponent } from './components/order/order.component';
import { MatSortModule } from '@angular/material/sort';
import { MealsComponent } from './components/meals/meals.component';
import { MealsFormComponent } from './components/meals-form/meals-form.component';
import { EditMealFormComponent } from './components/edit-meal-form/edit-meal-form.component';



@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    NavbarComponent,
    LoginComponent,
    RegistrationComponent,
    MenuComponent,
    OrderComponent,
    MealsComponent,
    MealsFormComponent,
    EditMealFormComponent,
    
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatToolbarModule,
    MatSidenavModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatOption,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    DatePipe, 
  ],
  providers: [
    provideAnimationsAsync(),
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
