import { Component } from '@angular/core';
import {QualificationListComponent} from "../qualification-list/qualification-list.component";

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

}
