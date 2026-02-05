import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../auth/auth.service";
import {Qualification} from "../../app/Qualification";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class QualificationService {

  constructor(private http: HttpClient, private authService: AuthService) {
  }



  getAllQualifications(): Observable<Qualification[]> {
    const token = this.authService.getAccessToken();
    return this.http.get<Qualification[]>('http://localhost:8089/qualifications', {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    });
  }

  getAllEmployeesByQualificationId(qualificationId: number): Observable<Qualification[]> {
    const token = this.authService.getAccessToken();
    return this.http.get<Qualification[]>(`http://localhost:8089/qualifications/${qualificationId}/employees`, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    });
  }

  addQualification(newQualification: string): Observable<Qualification> | undefined {
    if (!newQualification.trim()) {
      return;
    }
    const token = this.authService.getAccessToken();
    return this.http.post<Qualification>('http://localhost:8089/qualifications',
      {skill: newQualification},
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
      });

  }

  deleteQualification(id: number | undefined): Observable<Qualification> {
    // if (id === undefined) {
    //   return;
    // }
    const token = this.authService.getAccessToken();
    return this.http.delete(`http://localhost:8089/qualifications/${id}`, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    });
  }

  updateQualification(qualificationId: number, newQualificationName: string): Observable<Qualification> {
    const token = this.authService.getAccessToken();
    return this.http.put(`http://localhost:8089/qualifications/${qualificationId}`,
      {
        skill: newQualificationName
      }, {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
      });
  }
}
