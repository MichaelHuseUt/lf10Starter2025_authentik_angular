import { Routes } from '@angular/router';
import { CallbackComponent } from './callback/callback.component';
import { authGuard } from './auth.guard';
import {QualificationListComponent} from "./qualification-list/qualification-list.component";
import {EmployeeListComponent} from "./employee-list/employee-list.component";

export const routes: Routes = [
  { path: '', component: EmployeeListComponent, canActivate: [authGuard] },
  { path: 'callback', component: CallbackComponent },
  { path: 'qualifications', component: QualificationListComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
