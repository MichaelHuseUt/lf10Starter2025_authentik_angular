import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Qualification} from "../Qualification";
import {Observable, of} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-custom-qualification-select',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule
  ],
  templateUrl: './custom-qualification-select.component.html',
  styleUrl: './custom-qualification-select.component.css'
})
export class CustomQualificationSelectComponent {
  @Input() qualificationList$: Observable<Qualification[]> = new Observable<Qualification[]>();
  @Input() preSelectedQualificationList: Qualification[] = [];
  @Input() enableSearchBar: boolean = true;

  @Output() getSelection: EventEmitter<string[]> = new EventEmitter();

  mappedQualification$: Observable<mappedQualification[]> = of([]);
  searchInputModal = ""

  getSelectionEmit(ul: HTMLUListElement) {
    //@ts-ignore
    const checkedQualificationList = [];
    const liList = ul.getElementsByTagName('li');
    //@ts-ignore
    for(const li of liList ) {
      const input = li.firstChild
        if (input) {
          //@ts-ignore
           if (input.checked) {
             //@ts-ignore
             checkedQualificationList.push(input.value)
             //@ts-ignore
             console.log(input.value)
           }
        }
    }
    //@ts-ignore
    this.getSelection.emit(checkedQualificationList);
  }

  get mappedQualificationToDisplayList$(){
    this.qualificationList$.subscribe((qList) => {
      this.mappedQualification$ = of(qList.map((q) => {
        return {
          id: q.id,
          skill: q.skill,
          checked: this.preSelectedQualificationList.length ? this.preSelectedQualificationList.some((p) => {
            return p.id === q.id
          }) : false,
        };
      }).sort((q1,q2) => {
        if (q1.skill?.toLowerCase().includes(this.searchInputModal.toLowerCase())){
          return -1
        }
        if (q2.skill?.toLowerCase().includes(this.searchInputModal.toLowerCase())){
          return 1
        }
        return 0;
      }));
    })
    return this.mappedQualification$;
  }
}

type mappedQualification = {
  id: number | undefined;
  skill: string | undefined;
  checked: boolean;
}
