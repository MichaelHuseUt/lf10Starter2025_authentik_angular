import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CustomNotification} from "../../service/notification/notification.service";

@Component({
  selector: 'app-custom-notification',
  standalone: true,
  imports: [],
  templateUrl: './custom-notification.component.html',
  styleUrl: './custom-notification.component.css'
})
export class CustomNotificationComponent {

  @Output() deleteNotification: EventEmitter<CustomNotification> = new EventEmitter();
  @Input() customNotification!: CustomNotification;

  constructor() {
  }

  deleteCustomNotification() {
    this.deleteNotification.emit();
  }
}
