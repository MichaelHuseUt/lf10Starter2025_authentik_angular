import { Component } from '@angular/core';
import {EmployeeListComponent} from "../employee-list/employee-list.component";
import {EmployeeFilterComponent} from "../employee-filter/employee-filter.component";
import { Employee } from '../Employee';

@Component({
  selector: 'app-employee-overview',
  standalone: true,
  imports: [EmployeeListComponent, EmployeeFilterComponent],
  templateUrl: './employee-overview.component.html',
  styleUrl: './employee-overview.component.css'
})
export class EmployeeOverviewComponent {
  // Die vom Filter kommenden gefilterten Mitarbeiter (null = kein Override)
  filteredFromFilter: Employee[] | null = null;
  loadedEmployees: Employee[] = [];

  onFiltered(employees: Employee[]) {
    this.filteredFromFilter = employees;
  }

  clearFilter() {
    this.filteredFromFilter = null;
  }

  onEmployeesLoaded(employees: Employee[]) {
    this.loadedEmployees = employees || [];
  }
}
