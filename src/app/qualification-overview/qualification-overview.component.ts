import { Component} from '@angular/core';
import {QualificationListComponent} from "../qualification-list/qualification-list.component";
import {BehaviorSubject, Observable, of} from "rxjs";
import {Qualification} from "../Qualification";
import {QualificationService} from "../../service/qualification/qualification.service";

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
    private qualificationService: QualificationService
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
    this.qualificationService.addQualification(userInputElement.value)?.subscribe(() => {
        this.getAllQualification()
      }
    );
    userInputElement.value = "";
  }

  deleteQualification(qualificationId: number): void {
    this.qualificationService.deleteQualification(qualificationId).subscribe(() =>
      this.getAllQualification()
    );
  }

  getAllQualification(): void {
    this.qualificationService.getAllQualifications().subscribe({ next: data => {
        this.qualifications$.next(data || [])
        this.filteredQualificationList$ = this.qualifications$.pipe()
      },});
  }

  updateQualification(qualificationId: number, qualificationName: string): void {
    this.qualificationService.updateQualification(qualificationId, qualificationName).subscribe(() =>
      this.getAllQualification()
    );
  }
}
