import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable, of} from "rxjs";
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

  @Output() updateQualification: EventEmitter<{ id: number, qualification: string }> = new EventEmitter<{ id: number, qualification: string }>();
  @Output() deleteQualification: EventEmitter<number> = new EventEmitter();
  @Input() qualificationList: Observable<Qualification[]> = of([]);

  editQualification: Qualification | null = null;

  constructor(
  ) {
  }

  emitUpdateQualification(id: number, qualification: string) {
    this.editQualification = null
    this.updateQualification.emit({id, qualification})
  }

  setEditQualification(newQualification: Qualification) {
    this.editQualification = newQualification;
  }

  cancelEditQualification(): void {
    this.editQualification = null;
  }
}
