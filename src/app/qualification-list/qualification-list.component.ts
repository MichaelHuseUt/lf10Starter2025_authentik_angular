import {Component} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {AuthService} from "../../service/auth/auth.service";
import {Qualification} from "../Qualification";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-qualification-list',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './qualification-list.component.html',
  styleUrl: './qualification-list.component.css'
})
export class QualificationListComponent {
  qualifications$: Observable<Qualification[]>;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.qualifications$ = of([]);
    this.getQualificationList();
  }
  addQualification(newQualification: string): void {

    if (newQualification.trim()) {

      this.qualifications$.subscribe((qualificationList) => {

        if(qualificationList.every(qualification => {
          return qualification.skill?.toLowerCase() !== newQualification.toLowerCase();
        })) {

          const token = this.authService.getAccessToken();
            this.http.post<Qualification>('http://localhost:8089/qualifications',
              {skill: newQualification},
              {
                headers: new HttpHeaders()
                  .set('Content-Type', 'application/json')
                  .set('Authorization', `Bearer ${token}`)
              }).subscribe((_oOR) => {
              this.getQualificationList();
            });
        }
      })
    }
  }

  getQualificationList() {
    const token = this.authService.getAccessToken();
    this.qualifications$ = this.http.get<Qualification[]>('http://localhost:8089/qualifications', {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    });
  }

  deleteQualification(id: number | undefined): void {
    if (id === undefined) {
      return;
    }

    const token = this.authService.getAccessToken();
    this.http.delete(`http://localhost:8089/qualifications/${id}`, {
      headers: new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
    }).subscribe((_oOR) => {
      this.getQualificationList();
    });
  }
}
