import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DepositWithdrawRequest, TransferRequest, Transaction } from '../shared/models';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/transactions`;

  deposit(payload: DepositWithdrawRequest): Observable<any> {
    const body = { account_id: Number(payload.account_id), amount: Number(payload.amount) };
    return this.http.post(`${this.baseUrl}/deposit`, body);
  }

  withdraw(payload: DepositWithdrawRequest): Observable<any> {
    const body = { account_id: Number(payload.account_id), amount: Number(payload.amount) };
    return this.http.post(`${this.baseUrl}/withdraw`, body);
  }

  transfer(payload: TransferRequest): Observable<any> {
    const body = { from_account: Number(payload.from_account), to_account: Number(payload.to_account), amount: Number(payload.amount) };
    return this.http.post(`${this.baseUrl}/transfer`, body);
  }

  history(accountId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/${accountId}`);
  }

  // Get all transactions (admin only)
  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}`);
  }
}


