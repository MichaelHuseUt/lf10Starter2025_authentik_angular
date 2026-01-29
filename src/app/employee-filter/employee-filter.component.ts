import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Employee} from "../Employee";
import {EmployeeService} from "../employee-service/employee.service";

@Component({
  selector: 'app-employee-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-filter.component.html',
  styleUrl: './employee-filter.component.css'
})
export class EmployeeFilterComponent {
  private _employees: Employee[] = []; // interne Speicherung

  @Input()
  set employees(value: Employee[]) {
    this._employees = value || [];
    this.applyFilter(); // reagiert sofort auf Input
  }
  get employees(): Employee[] {
    return this._employees;
  }


filteredEmployees: Employee[] = [];

lastName = '';
firstName = '';
place='';


//TODO Qualification aus qualification-service
qualificationId: number | '' = '';



@Output() filtered = new EventEmitter<Employee[]>();

constructor(private employeeService: EmployeeService) {}

  onFilterChange() {
    this.applyFilter();
  }

  private applyFilter(){
  const lastName = this.lastName.toLowerCase();
  const firstName = this.firstName.toLowerCase();
  const place = this.place.toLowerCase();
  const qualificationId = this.qualificationId === '' ? null : this.qualificationId;

  this.filteredEmployees = this.employees.filter(e => {
    const matchesLast = !lastName || (e.lastName && e.lastName.toLowerCase().includes(lastName));
    const matchesFirst = !firstName || (e.firstName && e.firstName.toLowerCase().includes(firstName));
    const matchesPlace = !place || (
      (e.city && String(e.city).toLowerCase().includes(place)) ||
      (e.postcode && String(e.postcode).toLowerCase().includes(place))
    );

    let matchesQual = true;
    if (qualificationId != null) {
      matchesQual = (e as any).qualificationId === qualificationId ||
        ((e as any).qualificationIds && Array.isArray((e as any).qualificationIds) &&
          (e as any).qualificationIds.includes(qualificationId));
    }

    return matchesLast && matchesFirst && matchesPlace && matchesQual;
  });
    this.filtered.emit(this.filteredEmployees);
  }
}
