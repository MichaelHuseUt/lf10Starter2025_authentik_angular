import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Employee} from "../Employee";
import {Qualification} from "../Qualification";
import {QualificationService} from "../../service/qualification/qualification.service";
import {Observable, of} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../../service/auth/auth.service";
import {CustomQualificationSelectComponent} from "../custom-qualification-select/custom-qualification-select.component";

@Component({
  selector: 'app-view-employee',
  standalone: true,
  imports: [
    FormsModule,
    CustomQualificationSelectComponent
  ],
  templateUrl: './view-employee.component.html',
  styleUrl: './view-employee.component.css'
})
export class ViewEmployeeComponent {
  @Output() closePopup: EventEmitter<void> = new EventEmitter();
  @Input() employee!: Employee;
  @Input() enterInEditMode: boolean = false;
  qualificationList$: Observable<Qualification[]> = of([]);
  errorMessageList: string[] = []

  firstNameModal: string = "";
  lastNameModal: string = "";
  streetModal: string = "";
  postCodeModal: string = "";
  phoneNumberModal: string = "";
  cityModal: string = "";
  qualificationIdListModal: string[] = [];

  isEditing = false;

  constructor(private qualificationService: QualificationService, private httpClient: HttpClient, private authService: AuthService) {
    this.qualificationService.getAllQualifications().subscribe((q) => {
      this.qualificationList$ = of(q)

      if (this.enterInEditMode) {
        this.switchToEditMode();
      }
    })
  }

  getQualificationSelection(selectedQualificationIdList: string[] ) {
    this.qualificationIdListModal = selectedQualificationIdList;
  }

  validateUserInput(): boolean {
      this.errorMessageList = [];
      if (!this.firstNameModal.trim().length) {
        this.errorMessageList.push("Sie müssen eine Vornamen angeben!")
      }
      if (!this.lastNameModal.trim().length) {
        this.errorMessageList.push("Sie müssen einen Nachnamen angeben!")
      }
      if (!this.streetModal.trim().length) {
        this.errorMessageList.push("Sie müssen eine Straße angeben!")
      }
      if (!this.postCodeModal.match(/^\d{5}$/g)) {
        this.errorMessageList.push("Ihre Postleitzahl muss aus fünf Ziffern bestehen!")
      }
      if (!this.cityModal.trim().length) {
        this.errorMessageList.push("Sie müssen eine Stadt angeben!")
      }
      if (!this.phoneNumberModal.trim().length) {
        this.errorMessageList.push("Sie müssen eine Telefonnummer angeben!")
      }
      return !this.errorMessageList.length
  }


  switchToEditMode() {
    this.isEditing = true;
    this.firstNameModal = this.employee.firstName ?? ""
    this.lastNameModal = this.employee.lastName ?? ""
    this.streetModal = this.employee.street ?? ""
    this.postCodeModal = this.employee.postcode ?? ""
    this.phoneNumberModal = this.employee.phone ?? ""
    this.cityModal = this.employee.city ?? ""
    this.qualificationIdListModal = this.employee.skillSet ? this.employee.skillSet?.map(skill => skill.id!.toString() ) : []
  }

  cancelEditMode() {
    this.isEditing = false;
    this.enterInEditMode = false
  }

  saveEdit() {
    const token = this.authService.getAccessToken();
    this.httpClient.patch<Employee>(`http://localhost:8089/employees/${this.employee.id}`,
      {
        lastName: this.lastNameModal,
        firstName: this.firstNameModal,
        street: this.streetModal,
        postcode: this.postCodeModal,
        city: this.cityModal,
        phone: this.phoneNumberModal,
        skillSet: this.qualificationIdListModal,
      }, {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
      }).subscribe(response => {
        if (response) {
          this.closePopup.emit();
        }
    });
  }


}
