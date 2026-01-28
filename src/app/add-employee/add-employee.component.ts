import {Component, ViewChild, ElementRef, output, Output, EventEmitter} from '@angular/core';
import {Employee} from "../Employee";
import {Observable, of} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../../service/auth/auth.service";

@Component({
  selector: 'app-add-employee',
  standalone: true,
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent {

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  @Output() closePopup: EventEmitter<void> = new EventEmitter();

  addEmployee(firstName: string, lastName: string, street: string,
              postcode: string, city: string, phone: string): void {

    const token = this.authService.getAccessToken();

    this.http.post<Employee>('http://localhost:8089/employees',
      {firstName, lastName, street, postcode, city, phone, skillSet: []},
      {headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
      }).subscribe()
  }
}
