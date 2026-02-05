import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Employee} from "../Employee";
import {AuthService} from "../../service/auth/auth.service";
import {ViewEmployeeComponent} from "../view-employee/view-employee.component";
import {NotificationService, NotificationState} from "../../service/notification/notification.service";

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, ViewEmployeeComponent],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnChanges {
  @Input() overrideEmployees: Employee[] | null = null;
  @Input() reloadEmployees: number = 0;
  @Output() employeesLoaded = new EventEmitter<Employee[]>();

  private employeesSubject = new BehaviorSubject<Employee[]>([]);
  employees$: Observable<Employee[]> = this.employeesSubject.asObservable();
  modalIsOpen = false;

  // index of opened context menu (null = none)
  openContextIndex: number | null = null;

  // delete modal state
  showDeleteModal = false;
  deleteCandidate: Employee | null = null;
  deleteIndex: number | null = null;

  // view modal state
  viewEmployeeDetails: Employee = {};
  showViewModal: boolean = false;
  enterInEditMode: boolean = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {
    this.fetchData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['overrideEmployees']) {
      const prev = changes['overrideEmployees'].previousValue;
      const curr = changes['overrideEmployees'].currentValue;
      if (curr === null) {
        // Wenn vorher ein Override existierte, lade die Originaldaten neu vom Backend
        if (prev != null) {
          this.fetchData();
        }
        // Falls vorher auch null war, nichts tun
      } else {
        // Override: zeige die bereitgestellte Liste
        this.employeesSubject.next(curr || []);
      }
    }
    console.log("chang Detected")
    if (changes['reloadEmployees']) {
      console.log("is reloade")
      console.log("reload...")
      this.fetchData();
    }
  }

  fetchData() {
    const token = this.authService.getAccessToken();
    this.http.get<Employee[]>('http://localhost:8089/employees', {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).subscribe({
      next: data => {
        const arr = data || [];
        this.employeesSubject.next(arr);
        this.employeesLoaded.emit(arr);
      },
      error: err => {
        console.error('Fehler beim Laden der Mitarbeiter', err);
        this.employeesSubject.next([]);
        this.employeesLoaded.emit([]);
      }
    });
  }

  openContext(e: Employee, i: number, event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.openContextIndex = this.openContextIndex === i ? null : i;
  }

  isContextOpen(i: number) {
    return this.openContextIndex === i;
  }

  view(e: Employee) {
    this.enterInEditMode = false;
    this.viewEmployeeDetails = e;
    this.showViewModal = true;
    this.openContextIndex = null;
    this.modalIsOpen = true;
  }

  exitView(): void {
    this.showViewModal = false;
    this.viewEmployeeDetails = {};
    this.modalIsOpen = false;
    this.fetchData();
  }

  edit(e: Employee) {
    this.enterInEditMode = true;
    this.viewEmployeeDetails = e;
    this.showViewModal = true;
    this.openContextIndex = null;
    this.modalIsOpen = true;
  }

  confirmDelete(employee: Employee, id: number) {
    this.deleteCandidate = employee;
    this.deleteIndex = id;
    this.showDeleteModal = true;
    this.modalIsOpen = true;
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.deleteCandidate = null;
    this.deleteIndex = null;
    this.modalIsOpen = false;
  }

  performDelete() {
    if (this.deleteIndex == null) {
      this.cancelDelete();
      return;
    }

    // Get Id bevor in der Liste gelöscht wird
    const current = this.employeesSubject.getValue();
    if (this.deleteIndex < 0 || this.deleteIndex >= current.length) {
      console.error('Ungültiger Index beim Löschen:', this.deleteIndex);
      this.cancelDelete();
      return;
    }

    const idToDelete = current[this.deleteIndex].id ?? null;

    // Zuerst Backend-Aufruf mit der ermittelten ID, danach die ListView aktualisieren.
    this.deleteEmployeeFromBackend(idToDelete);
    this.deleteEmployeeFromListView(this.deleteIndex);
    this.cancelDelete();
  }

  private deleteEmployeeFromListView(index: number) {
    const current = [...this.employeesSubject.getValue()];
    if (index >= 0 && index < current.length) {
      current.splice(index, 1);
      this.employeesSubject.next(current);
    }
  }

  private deleteEmployeeFromBackend(id: number | null) {
    const token = this.authService.getAccessToken();

    if (id == null) {
      console.error('Mitarbeiter-ID ist null, kann nicht gelöscht werden.');
      return;
    }

    if (!token) {
      console.warn('Kein Zugriffstoken vorhanden - Backend-Aufruf könnte fehlschlagen.');
    }

    this.http.delete(`http://localhost:8089/employees/${id}`, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).subscribe({
      next: () => {
        console.log(`Mitarbeiter mit ID ${id} erfolgreich gelöscht.`);
        this.notificationService.add(
          NotificationState.SUCCESS,
          "Mitarbeiter erfolgreich gelöscht",
          `Der Mitarbeiter wurde gelöscht.`,
        );
      },
      error: err => {
        console.error(`Fehler beim Löschen des Mitarbeiters mit ID ${id}`, err);
        this.notificationService.add(
          NotificationState.FAILED,
          "Fehler beim löschen aufgetreten",
          `Mitarbeiter konnte nicht gelöscht werden.`,
        )
      }
    });
  }
}
