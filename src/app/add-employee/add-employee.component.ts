import {Component, EventEmitter, Output} from '@angular/core';
import {Employee} from "../Employee";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../../service/auth/auth.service";
import {QualificationService} from "../../service/qualification/qualification.service";
import {Observable, of} from "rxjs";
import {Qualification} from "../Qualification";
import {AsyncPipe} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-add-employee',
  standalone: true,
  templateUrl: './add-employee.component.html',
  imports: [
    AsyncPipe,
    FormsModule
  ],
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent {

  @Output() closePopup: EventEmitter<void> = new EventEmitter();
  qualificationList$: Observable<Qualification[]> = of([]);
  showErrorMessage: boolean = false;
  errorMessageList: string[] = [];

  selectedFirstNameModal: string = ""
  selectedLastNameModal: string = ""
  selectedStreetModal: string = ""
  selectedPostCodeModal: string = ""
  selectedPhoneNumberModal: string = "";
  selectedCityModal: string = ""
  selectedQualificationListModal: Qualification[] = [];

  constructor(private http: HttpClient, private authService: AuthService, private qualificationService: QualificationService) {
    this.qualificationService.getAllQualifications().subscribe((q) => this.qualificationList$ = of(q))
  }

  validateUserInput(): boolean {
    if (this.showErrorMessage) {
      this.errorMessageList = [];
      if (!this.selectedFirstNameModal.trim().length) {
        this.errorMessageList.push("Sie müssen eine Vornamen angeben!")
      }
      if (!this.selectedLastNameModal.trim().length) {
        this.errorMessageList.push("Sie müssen einen Nachnamen angeben!")
      }
      if (!this.selectedStreetModal.trim().length) {
        this.errorMessageList.push("Sie müssen eine Straße angeben!")
      }
      if (!this.selectedPostCodeModal.match(/^\d{5}$/g)) {
        this.errorMessageList.push("Ihre Postleitzahl muss aus fünf Ziffern bestehen!")
      }
      if (!this.selectedCityModal.trim().length) {
        this.errorMessageList.push("Sie müssen eine Stadt angeben!")
      }
      if (!this.selectedPhoneNumberModal.trim().length) {
        this.errorMessageList.push("Sie müssen eine Telefonnummer angeben!")
      }
      if (!this.errorMessageList.length) {
        return true
      }
    }
    return false
  }

  addEmployee(): void {
    let map = this.selectedQualificationListModal.map(q => q.id);

    this.showErrorMessage = true;
    if (this.validateUserInput()) {
      const token = this.authService.getAccessToken();

      this.http.post<Employee>('http://localhost:8089/employees',
        {
          firstName: this.selectedFirstNameModal.trim(),
          lastName: this.selectedLastNameModal.trim(),
          street: this.selectedStreetModal.trim(),
          postcode: this.selectedPostCodeModal.trim(),
          city: this.selectedCityModal.trim(),
          phone: this.selectedPhoneNumberModal.trim(),
          skillSet: map
        },
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
        }).subscribe(() => {
        this.closePopup.emit();
      });
    }
  }
}
