import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable, of} from "rxjs";
import {Qualification} from "../Qualification";
import {CommonModule} from "@angular/common";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../../service/auth/auth.service";

@Component({
  selector: 'app-qualification-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qualification-list.component.html',
  styleUrls: ['./qualification-list.component.css']
})
export class QualificationListComponent {

  @Output() updateQualification = new EventEmitter<void>();
  @Output() deleteQualification: EventEmitter<number> = new EventEmitter();
  @Input() qualificationList: Observable<Qualification[]> = of([]);

  editQualification: Qualification | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {

  }

  setEditQualification(newQualification: Qualification) {
    this.editQualification = newQualification;
  }

  cancelEditQualification(): void {
    this.editQualification = null;
  }

  saveEditQualification(qualificationId: number, newQualificationName: string) {

    const token = this.authService.getAccessToken();
    this.http.put(`http://localhost:8089/qualifications/${qualificationId}`,
      {
        skill: newQualificationName
      }, {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
      }).subscribe(
      () => {
        this.updateQualification.emit();
        this.editQualification = null;
      }
    )

  }

  protected readonly console = console;
}
