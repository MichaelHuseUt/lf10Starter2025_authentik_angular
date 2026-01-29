import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Employee} from "../Employee";

@Component({
  selector: 'app-view-employee',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './view-employee.component.html',
  styleUrl: './view-employee.component.css'
})
export class ViewEmployeeComponent {
  @Output() closePopup: EventEmitter<void> = new EventEmitter();
  @Input() employee: Employee = {};

}
