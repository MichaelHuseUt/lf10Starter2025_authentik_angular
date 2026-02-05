import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Employee} from "../Employee";
import {EmployeeService} from "../employee-service/employee.service";
import {QualificationService} from "../../service/qualification/qualification.service";
import {Qualification} from "../Qualification";

@Component({
  selector: 'app-employee-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-filter.component.html',
  styleUrl: './employee-filter.component.css'
})
export class EmployeeFilterComponent implements OnInit {
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

// ausgewählte Qualification (whole object binding)
selectedQualification: Qualification | '' = '';

// Liste der verfügbaren Qualifikationen für das Dropdown
qualifications: Qualification[] = [];


@Output() filtered = new EventEmitter<Employee[]>();

constructor(private employeeService: EmployeeService, private qualificationService: QualificationService) {}

  ngOnInit(): void {
    // Qualifikationen laden für das Dropdown
    this.qualificationService.getAllQualifications().subscribe({
      next: data => this.qualifications = data || []
    });
  }

  onFilterChange() {
    this.applyFilter();
  }

  private applyFilter(){
  const lastName = this.lastName.toLowerCase();
  const firstName = this.firstName.toLowerCase();
  const place = this.place.toLowerCase();

  // Bestimme die ID bzw. den Skill-Namen aus selectedQualification falls gesetzt
  const qualificationIdNum = (this.selectedQualification && (this.selectedQualification as Qualification).id != null)
    ? Number((this.selectedQualification as Qualification).id)
    : null;
  const qualificationSkill = (this.selectedQualification && (this.selectedQualification as Qualification).skill)
    ? String((this.selectedQualification as Qualification).skill).toLowerCase()
    : null;

  // DEBUG: Ausgabe der aktuellen Filterzustände
  console.log('applyFilter called', { selectedQualification: this.selectedQualification, qualificationIdNum, qualificationSkill, employeesCount: this.employees.length });

  this.filteredEmployees = this.employees.filter(e => {
    const matchesLast = !lastName || (e.lastName && e.lastName.toLowerCase().includes(lastName));
    const matchesFirst = !firstName || (e.firstName && e.firstName.toLowerCase().includes(firstName));
    const matchesPlace = !place || (
      (e.city && String(e.city).toLowerCase().includes(place)) ||
      (e.postcode && String(e.postcode).toLowerCase().includes(place))
    );

    let matchesQual = true;
    if (qualificationIdNum != null || qualificationSkill != null) {
      const anyE = e as any;

      // Prüfe ID-Felder
      if (qualificationIdNum != null) {
        if (anyE.qualificationId != null && Number(anyE.qualificationId) === qualificationIdNum) {
          matchesQual = true;
        } else if (anyE.qualificationIds && Array.isArray(anyE.qualificationIds)) {
          matchesQual = anyE.qualificationIds.map((x: any) => Number(x)).includes(qualificationIdNum);
        } else if (anyE.skillSet && Array.isArray(anyE.skillSet)) {
          matchesQual = anyE.skillSet.some((q: Qualification) => Number(q.id) === qualificationIdNum);
        } else {
          matchesQual = false;
        }
      }

      // Falls ID-Vergleich nichts gefunden hat, versuche per Skill-Name (falls vorhanden)
      if (!matchesQual && qualificationSkill != null) {
        if (anyE.skillSet && Array.isArray(anyE.skillSet)) {
          matchesQual = anyE.skillSet.some((q: Qualification) => (q.skill || '').toLowerCase().includes(qualificationSkill));
        }
      }
    }

    return matchesLast && matchesFirst && matchesPlace && matchesQual;
  });

  console.log('applyFilter result count', this.filteredEmployees.length);
  if (this.filteredEmployees.length === 0) {
    console.log('No employees matched the filter. Sample employees:', this.employees.slice(0, 10));
  }

    this.filtered.emit(this.filteredEmployees);
  }
}
