import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'lf10StarterNew';
  showEmployeeHeader = false;

  constructor(private router: Router) {

    this.showEmployeeHeader = this.router.url.startsWith('/employees');


    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe(event => {
      this.showEmployeeHeader = event.urlAfterRedirects.startsWith('/employees');
    });
  }
}
