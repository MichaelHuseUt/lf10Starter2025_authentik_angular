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
    this.getSkills();
  }

  addSkill(skill: string): void {
    console.log(skill);
    if (skill.trim()) {
      const token = this.authService.getAccessToken();
      this.http.post<Qualification>('http://localhost:8089/qualifications',
        {skill: skill},
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
        }).subscribe((_oOR) => this.getSkills());
    }
  }

  getSkills() {
    const token = this.authService.getAccessToken();
    this.qualifications$ = this.http.get<Qualification[]>('http://localhost:8089/qualifications', {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    });
  }
}
