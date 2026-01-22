import { Component } from '@angular/core';
import {QualificationListComponent} from "../qualification-list/qualification-list.component";
import {Observable, of} from "rxjs";
import {Qualification} from "../Qualification";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../../service/auth/auth.service";

@Component({
  selector: 'app-qualification-overview',
  standalone: true,
  imports: [
    QualificationListComponent
  ],
  templateUrl: './qualification-overview.component.html',
  styleUrl: './qualification-overview.component.css'
})
export class QualificationOverviewComponent {

  qualifications$: Observable<Qualification[]>;
  filteredQualificationList$: Observable<Qualification[]>;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.qualifications$ = of([]);
    this.filteredQualificationList$ = of([]);
    this.getQualificationList();
  }

  filterQualificationByUserInput(qualification: string): void {
    console.log(qualification);
    this.qualifications$.subscribe(qualificationList => {

      this.filteredQualificationList$ = of(qualificationList.filter(item => {
        return item.skill?.toLowerCase().includes(qualification.toLowerCase());
      }));

    })
  }

  addQualification(newQualification: string): void {

    if (newQualification.trim()) {

      this.qualifications$.subscribe((qualificationList) => {

        if (qualificationList.every(qualification => {
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
    }).pipe(newQualificationList => this.filteredQualificationList$ = newQualificationList);
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
