import { Injectable } from '@angular/core';
import {Qualification} from "../../Qualification";
import {Employee} from "../../Employee";
import {AuthService} from "../../../service/auth/auth.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  addQualification(employeeId: number, skill: string) {
    const token = this.authService.getAccessToken();

    return this.http.post<Employee>(`http://localhost:8089/employees/${employeeId}/qualifications`,
      {skill},
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
      }
    );
  }
}
