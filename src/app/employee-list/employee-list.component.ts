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
    // Platzhalter: View-Funktionalität noch nicht implementiert
    console.log('View', e);
    this.openContextIndex = null;
  }

  edit(e: Employee) {
    // Platzhalter: Edit-Funktionalität noch nicht implementiert
    console.log('Edit', e);
    this.openContextIndex = null;
  }

  confirmDelete(e: Employee, i: number) {
    // Open modal instead of using window.confirm
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

    this.deleteEmployee(this.deleteIndex);
    // TODO: backend delete call can be added here
    this.cancelDelete();
  }

  private deleteEmployee(index: number) {
    const current = [...this.employeesSubject.getValue()];
    if (index >= 0 && index < current.length) {
      current.splice(index, 1);
      this.employeesSubject.next(current);
    }
  }
}
