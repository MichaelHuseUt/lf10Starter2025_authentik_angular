import { Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { CallbackComponent } from './callback/callback.component';
import { authGuard } from './auth.guard';
import {QualificationListComponent} from "./qualification-list/qualification-list.component";
import {EmployeeOverviewComponent} from "./employee-overview/employee-overview.component";

export const routes: Routes = [
  { path: '', redirectTo: 'employees', pathMatch: 'full' },
  { path: 'callback', component: CallbackComponent },
  { path: 'employees', component: EmployeeOverviewComponent, canActivate: [authGuard] },
  { path: 'qualifications', component: QualificationListComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
