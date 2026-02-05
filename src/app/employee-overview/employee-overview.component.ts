import {Component} from '@angular/core';
import {EmployeeListComponent} from "../employee-list/employee-list.component";
import {EmployeeFilterComponent} from "../employee-filter/employee-filter.component";
import { Employee } from '../Employee';
import {AddEmployeeComponent} from "../add-employee/add-employee.component";

@Component({
  selector: 'app-employee-overview',
  standalone: true,
  imports: [EmployeeListComponent, EmployeeFilterComponent, AddEmployeeComponent],
  templateUrl: './employee-overview.component.html',
  styleUrl: './employee-overview.component.css'
})
export class EmployeeOverviewComponent {
  // Die vom Filter kommenden gefilterten Mitarbeiter (null = kein Override)
  filteredFromFilter: Employee[] | null = null;
  loadedEmployees: Employee[] = [];
  reloadEmployees: number = 0;

  onFiltered(employees: Employee[]) {
    this.filteredFromFilter = employees;
  }

  clearFilter() {
    this.filteredFromFilter = null;
  }

  onEmployeesLoaded(employees: Employee[]) {
    this.loadedEmployees = employees || [];
  }

  addEmployeeModalIsOpen = false;
  openPopUp() {
    this.addEmployeeModalIsOpen = true;
  }

  closePopUp() {
    this.addEmployeeModalIsOpen = false;
    this.reloadEmployees = Math.random(); // jank city hier
  }
}
