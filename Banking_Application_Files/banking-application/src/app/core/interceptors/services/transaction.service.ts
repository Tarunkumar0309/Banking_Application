import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { DepositWithdrawRequest, TransferRequest, Transaction } from '../shared/models';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/transactions`;

  deposit(payload: DepositWithdrawRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/deposit`, payload);
  }

  withdraw(payload: DepositWithdrawRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/withdraw`, payload);
  }

  transfer(payload: TransferRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/transfer`, payload);
  }

  history(accountId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/history`, { params: { account_id: accountId } as any });
  }
}


