import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Account, OpenAccountRequest } from '../shared/models';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/accounts`;

  openAccount(payload: OpenAccountRequest): Observable<Account> {
    return this.http.post<Account>(`${this.baseUrl}`, payload);
  }

  myAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.baseUrl}/me`);
  }

  closeAccount(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}


