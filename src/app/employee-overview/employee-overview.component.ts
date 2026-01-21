import { Component } from '@angular/core';
import {EmployeeListComponent} from "../employee-list/employee-list.component";

@Component({
  selector: 'app-employee-overview',
  standalone: true,
  imports: [
    EmployeeListComponent
  ],
  templateUrl: './employee-overview.component.html',
  styleUrl: './employee-overview.component.css'
})
export class EmployeeOverviewComponent {

}
