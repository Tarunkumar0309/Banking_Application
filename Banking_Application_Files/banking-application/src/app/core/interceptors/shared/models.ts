export interface AuthResponse {
  access_token: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface Account {
  account_id: number;
  user_id: number;
  balance: number;
  status: 'ACTIVE' | 'CLOSED' | string;
}

export interface OpenAccountRequest {
  initial_deposit?: number;
}

export interface Transaction {
  transaction_id: number;
  account_id: number;
  type: 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER' | string;
  amount: number;
  status: 'SUCCESS' | 'FAILED' | string;
  created_at?: string;
}

export interface DepositWithdrawRequest {
  account_id: number;
  amount: number;
}

export interface TransferRequest {
  from_account_id: number;
  to_account_id: number;
  amount: number;
}


