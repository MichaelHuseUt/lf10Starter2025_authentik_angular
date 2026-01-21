import {Component, ViewChild, ElementRef, output, Output, EventEmitter} from '@angular/core';
import {Employee} from "../Employee";
import {Observable, of} from "rxjs";

@Component({
  selector: 'app-add-employee',
  standalone: true,
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent {
  employees$: Observable<Employee[]>;

  constructor() {
    this.employees$ = of([]);
  }

  @Output() closePopup: EventEmitter<void> = new EventEmitter();

  addEmployee(firstname: string, lastname: string, street: string,
              postcode: string, city: string, phoneNumber: string): void {



  }
}
