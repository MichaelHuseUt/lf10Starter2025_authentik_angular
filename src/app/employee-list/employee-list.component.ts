import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, BehaviorSubject } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Employee } from "../Employee";
import {AuthService} from "../../service/auth/auth.service";

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent {
  private employeesSubject = new BehaviorSubject<Employee[]>([]);
  employees$: Observable<Employee[]> = this.employeesSubject.asObservable();

  // index of opened context menu (null = none)
  openContextIndex: number | null = null;

  // delete modal state
  showDeleteModal = false;
  deleteCandidate: Employee | null = null;
  deleteIndex: number | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.fetchData();
  }

  addEmployee(newEmployee: Employee): void {

  }

  fetchData() {
    const token = this.authService.getAccessToken();
    this.http.get<Employee[]>('http://localhost:8089/employees', {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).subscribe({
      next: data => this.employeesSubject.next(data || []),
      error: err => {
        console.error('Fehler beim Laden der Mitarbeiter', err);
        this.employeesSubject.next([]);
      }
    });
  }

  openContext(e: Employee, i: number) {
    this.openContextIndex = this.openContextIndex === i ? null : i;
  }

  isContextOpen(i: number) {
    return this.openContextIndex === i;
  }

  view(e: Employee) {
    // TODO: View-Funktionalität
    console.log('View', e);
    this.openContextIndex = null;
  }

  edit(e: Employee) {
    //TODO: Edit-Funktionalität
    console.log('Edit', e);
    this.openContextIndex = null;
  }

  confirmDelete(e: Employee, i: number) {
    this.deleteCandidate = e;
    this.deleteIndex = i;
    this.showDeleteModal = true;
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.deleteCandidate = null;
    this.deleteIndex = null;
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

    // Zuerst Backend-Aufruf mit der ermittelten ID, danach die lokale Ansicht aktualisieren.
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
      },
      error: err => {
        console.error(`Fehler beim Löschen des Mitarbeiters mit ID ${id}`, err);
      }
    });
   }
 }
