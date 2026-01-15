import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { CallbackComponent } from './callback/callback.component';
import { authGuard } from './auth.guard';
import {EmployeeOverviewComponent} from "./employee-overview/employee-overview.component";

export const routes: Routes = [
  { path: '', component: EmployeeListComponent, canActivate: [authGuard] },
  { path: 'overview', component: EmployeeOverviewComponent },
  { path: 'callback', component: CallbackComponent },
  { path: '**', redirectTo: '' },
];
