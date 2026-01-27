import { Component } from '@angular/core';
import {EmployeeListComponent} from "../employee-list/employee-list.component";
import {EmployeeFilterComponent} from "../employee-filter/employee-filter.component";

@Component({
  selector: 'app-employee-overview',
  standalone: true,
  imports: [EmployeeListComponent, EmployeeFilterComponent],
  templateUrl: './employee-overview.component.html',
  styleUrl: './employee-overview.component.css'
})
export class EmployeeOverviewComponent {}
