import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Employee } from "../Employee";
import {AuthService} from "../../service/auth/auth.service";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent {
  employees$: Observable<Employee[]>;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.employees$ = of([]);
    this.fetchData();
  }

  addEmployee(newEmployee: Employee): void {


  }

  fetchData() {
    const token = this.authService.getAccessToken();
    this.employees$ = this.http.get<Employee[]>('http://localhost:8089/employees', {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    });
  }


}
