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
import { CreateWeeklyMenuComponent } from './components/create-weekly-menu/create-weekly-menu.component';
import { AuthGuard } from './components/shared/authGuard';
import { NotFoundPageComponent } from './components/pages/not-found-page/not-found-page.component';
import { AccessDeniedPageComponent } from './components/pages/access-denied-page/access-denied-page.component';
import { ChecklistComponent } from './components/checklist/checklist.component';

const routes: Routes = [
  {path: "home", component: MenuComponent},
  {path: "", component: MenuComponent},
  {path: "login", component: LoginComponent},
  {path: "register", component: RegistrationComponent},
  {path: "menu", component: MenuComponent, canActivate: [AuthGuard]},
  {path: "meals", component: MealsComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN'] }},
  {path: "add-meals", component: MealsFormComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN'] }},
  {path: "edit-meals", component: EditMealFormComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN'] }},
  {path: 'access-denied', component: AccessDeniedPageComponent },
  {path: 'checklist', component: ChecklistComponent},
  {path: 'order', component: OrderComponent, canActivate: [AuthGuard]},
  {path: 'order/:day', component: OrderComponent, canActivate: [AuthGuard]},
  {path: '', redirectTo: '/order/today', pathMatch: 'full'},
  // {path: "meals", component: MealsComponent},
  // {path: "add-meals", component: MealsFormComponent},
  // {path: "edit-meals", component: EditMealFormComponent},
  {path: "weekly-menu", component: CreateWeeklyMenuComponent},
  {path: '**', component: NotFoundPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
