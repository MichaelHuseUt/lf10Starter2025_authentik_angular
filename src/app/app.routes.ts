import { Routes } from '@angular/router';
import { CallbackComponent } from './callback/callback.component';
import { authGuard } from './auth.guard';
import {QualificationListComponent} from "./qualification-list/qualification-list.component";
import {EmployeeOverviewComponent} from "./employee-overview/employee-overview.component";

export const routes: Routes = [
  { path: '', component: EmployeeOverviewComponent, canActivate: [authGuard] },
  { path: 'callback', component: CallbackComponent },
  { path: 'qualifications', component: QualificationListComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
