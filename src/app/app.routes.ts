import { Routes } from '@angular/router';
import { CallbackComponent } from './callback/callback.component';
import { authGuard } from './auth.guard';
import {EmployeeOverviewComponent} from "./employee-overview/employee-overview.component";
import {QualificationOverviewComponent} from "./qualification-overview/qualification-overview.component";

export const routes: Routes = [
  { path: '', redirectTo: 'employees', pathMatch: 'full' },
  { path: 'callback', component: CallbackComponent },
  { path: 'employees', component: EmployeeOverviewComponent, canActivate: [authGuard]  },
  { path: 'qualifications', component: QualificationOverviewComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
