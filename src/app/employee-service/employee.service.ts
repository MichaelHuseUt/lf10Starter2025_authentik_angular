import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Employee} from "../Employee";

@Injectable({  providedIn: 'root'})
export class EmployeeService {
  private employeesURL = 'api/employees';

  constructor(private http: HttpClient) {}

  getEmployees():Observable<Employee[]> {
    return this.http.get<Employee[]>(this.employeesURL);
  }



}
