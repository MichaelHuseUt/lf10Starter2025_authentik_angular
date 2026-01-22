import {Component, ElementRef, ViewChild} from '@angular/core';
import {EmployeeListComponent} from "../employee-list/employee-list.component";
import {AddEmployeeComponent} from "../add-employee/add-employee.component";

@Component({
  selector: 'app-employee-overview',
  standalone: true,
  imports: [
    EmployeeListComponent,
    AddEmployeeComponent
  ],
  templateUrl: './employee-overview.component.html',
  styleUrl: './employee-overview.component.css'
})
export class EmployeeOverviewComponent {
  addEmployeeModalIsOpen = false;

  openPopUp() {
    this.addEmployeeModalIsOpen = true;
  }

  closePopUp() {
    this.addEmployeeModalIsOpen = false;
  }
}
