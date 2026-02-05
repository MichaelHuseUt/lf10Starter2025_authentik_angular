import {Component, computed} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import {CustomNotification, NotificationService} from "../service/notification/notification.service";
import {CustomNotificationComponent} from "./custom-notification/custom-notification.component";
import {AuthService} from "../service/auth/auth.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, CustomNotificationComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'lf10StarterNew';
  showEmployeeHeader = false;
  showQualificationHeader = false;
  notificationList = computed(() => this.notificationService.notificationList());

  constructor(private router: Router, private notificationService: NotificationService, private authService: AuthService,) {

    this.showEmployeeHeader = this.router.url.startsWith('/employees');
    this.showQualificationHeader = this.router.url.startsWith('/qualifications');

    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe(event => {
      this.showEmployeeHeader = event.urlAfterRedirects.startsWith('/employees');
      this.showQualificationHeader = event.urlAfterRedirects.startsWith('/qualifications');
    });
  }

  logout() {
    this.authService.logout();
  }

  trackById(_: number, item: CustomNotification) { return item.id; }

  deleteNotification(id: string) {
    this.notificationService.remove(id);
  }

}
