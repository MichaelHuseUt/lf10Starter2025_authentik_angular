import {Component} from '@angular/core';
import {QualificationListComponent} from "../qualification-list/qualification-list.component";
import {BehaviorSubject, Observable, of} from "rxjs";
import {Qualification} from "../Qualification";
import {QualificationService} from "../../service/qualification/qualification.service";
import {
  NotificationService,
  NotificationState
} from "../../service/notification/notification.service";

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

  qualifications$: BehaviorSubject<Qualification[]> = new BehaviorSubject<Qualification[]>([]);
  filteredQualificationList$: Observable<Qualification[]>;

  constructor(
    private qualificationService: QualificationService, private notificationService: NotificationService,
  ) {
    this.getAllQualification();
    this.filteredQualificationList$ = of([]);
  }

  filterQualificationByUserInput(qualification: string): void {
    console.log(qualification);
    this.qualifications$.subscribe(qualificationList => {

      this.filteredQualificationList$ = of(qualificationList.filter(item => {
        return item.skill?.toLowerCase().includes(qualification.toLowerCase());
      }));

    })
  }

  addQualification(userInputElement: HTMLInputElement): void {
    this.qualificationService.addQualification(userInputElement.value)?.subscribe({
      next: (result) => {
        this.getAllQualification();

        this.notificationService.add(
          NotificationState.SUCCESS,
          "Qualifikation hinzugefügt",
          `Die Qualification "${result.skill}" wurde erfolgreich hinzugefühlt.`
        );
      },
      error: (_err) => {
        this.notificationService.add(
          NotificationState.FAILED,
          "Fehler aufgetreten",
          `Diese Qualification gibt es bereits.`);
      }
    });
    userInputElement.value = "";
  }

  deleteQualification(qualificationId: number): void {
    this.qualificationService.deleteQualification(qualificationId).subscribe({
      next: (_result) => {
        this.getAllQualification();
        this.notificationService.add(
          NotificationState.SUCCESS,
          "Qualifikation gelöscht",
          `Die Qualification wurde erfolgreich gelöscht.`);
      },
      error: (_err) => {
        this.notificationService.add(
          NotificationState.FAILED,
          "Fehler beim löschen aufgetreten",
          `Diese Qualifikation wird von mindesten einen Mitarbeiter verwendet`);
      }
    });
  }

  getAllQualification(): void {
    this.qualificationService.getAllQualifications().subscribe({
      next: data => {
        this.qualifications$.next(data || [])
        this.filteredQualificationList$ = this.qualifications$.pipe()
      },
    });
  }

  updateQualification(qualificationId: number, qualificationName: string): void {
    this.qualificationService.updateQualification(qualificationId, qualificationName).subscribe({
      next: (result) => {
        this.getAllQualification();

        this.notificationService.add(
          NotificationState.SUCCESS,
          "Qualifikation geändert",
          `Ihre Qualification wurde erfolgreich zu "${result.skill}" geändert.`);
      },
      error: (_err) => {
        this.notificationService.add(
          NotificationState.FAILED,
          "Fehler aufgetreten",
          `Diese Qualification "${qualificationName}" gibt es bereits.`);
      }
    });
  }
}
