import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { OrderComponent } from './components/order/order.component';

import { MealsComponent } from './components/meals/meals.component';
import { MealsFormComponent } from './components/meals-form/meals-form.component';
import { EditMealFormComponent } from './components/edit-meal-form/edit-meal-form.component';
import { CreateMenuComponent } from './components/create-menu/create-menu.component';
import { CreateWeeklyMenuComponent } from './components/create-weekly-menu/create-weekly-menu.component';

const routes: Routes = [
  {path: "home", component: MenuComponent},
  {path: "", component: MenuComponent},
  {path: "login", component: LoginComponent},
  {path: "register", component: RegistrationComponent},
  {path: "menu", component: MenuComponent},
  {path: 'order', component: OrderComponent },
  {path: 'order/:day', component: OrderComponent },
  {path: '', redirectTo: '/order/today', pathMatch: 'full'},
  {path: "meals", component: MealsComponent},
  {path: "add-meals", component: MealsFormComponent},
  {path: "edit-meals", component: EditMealFormComponent},
  {path: "create-menu", component: CreateMenuComponent},
  {path: "create-weekly-menu", component: CreateWeeklyMenuComponent},
  {path: "weekly-menu", component: CreateWeeklyMenuComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
