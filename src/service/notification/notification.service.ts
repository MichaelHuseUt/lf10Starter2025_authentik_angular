import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  notificationList= signal<CustomNotification[]>([]);

  constructor() {
  }

  add(state: NotificationState, label:string , message: string) {
    const ttl = state === NotificationState.SUCCESS ? 5000 : 10000

    const id = Math.random().toString()

    this.notificationList.update(prev => [...prev, { id, state, label, message, ttl }]);

    const timeoutId = setTimeout(() => this.remove(id), ttl);
    this.notificationList.update(prev => prev.map(t => t.id === id ? { ...t, timeoutId } : t));
    return id;
  }

  remove(id: string) {
    const t = this.notificationList().find(x => x.id === id);
    if (t?.timeoutId) clearTimeout(t.timeoutId);
    this.notificationList.update(prev => prev.filter(x => x.id !== id));
  }

}

export interface CustomNotification {
  id: string;
  label: string;
  timeoutId?: any; // NodeJS.Timeout | number depending on TS config
  message: string;
  state: string;
  ttl: number;
}

export enum NotificationState {
  SUCCESS = "success",
  FAILED = "failed"
}

