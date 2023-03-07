import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {BaseResponse} from '../../models/base-response.model';
import {CreateTransactionResponseModel} from "../../models/create-transaction-response.model";
import {TransactionsResponse} from "../../models/transactions-response.model";

@Injectable({
  providedIn: 'root'
})

export class TransactionFormService {
  readonly URL_API = environment.api_url + '/api/v1/transaction';

  transactions: any[] = [];
  isLoadingTransactions = false;
  transactionsError = false;
  mode: string | undefined;

  constructor(private http: HttpClient) {
  }

  getTransactions(hashIdentifier: string) {
    return this.http.get(this.URL_API + "/" + hashIdentifier, {
    }).pipe(map(data => new TransactionsResponse().deserialize(data)));
  }

  editTransaction(transaction: any) {
    return this.http.put(this.URL_API + '/' + transaction._id, transaction, {
      headers: {'accept-language': 'es-ES', Authorization: 'Bearer ' + localStorage.getItem('token')},
    }).pipe(map(data => new BaseResponse().deserialize(data)));
  }

  deleteTransaction(transaction: any) {
    return this.http.delete(this.URL_API + '/' + transaction._id, {
      headers: {'accept-language': 'es-ES', Authorization: 'Bearer ' + localStorage.getItem('token')},
    }).pipe(map(data => new BaseResponse().deserialize(data)));
  }

  createTransaction(transaction: any) {
    return this.http.post(this.URL_API, transaction, {
    }).pipe(map(data => new CreateTransactionResponseModel().deserialize(data)));
  }

}
