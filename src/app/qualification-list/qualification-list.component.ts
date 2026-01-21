import {Component} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {AuthService} from "../../service/auth/auth.service";
import {Qualification} from "../Qualification";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-qualification-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qualification-list.component.html',
  styleUrls: ['./qualification-list.component.css']
})
export class QualificationListComponent {
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
