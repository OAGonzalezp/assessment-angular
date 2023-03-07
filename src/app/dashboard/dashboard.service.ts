import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {BaseResponse} from '../../models/base-response.model';
import {CreateCardResponseModel} from "../../models/create-card-response.model";

@Injectable({
  providedIn: 'root'
})

export class DashboardService {
  readonly URL_API = environment.api_url + '/api/v1/card';

  cards: any[] = [];
  isLoadingCards = false;
  cardsError = false;
  mode: string | undefined;

  constructor(private http: HttpClient) {
  }

  getCards() {
    return this.http.get(this.URL_API, {
    });
  }

  editCard(card: any) {
    return this.http.put(this.URL_API + '/' + card._id, card, {
      headers: {'accept-language': 'es-ES', Authorization: 'Bearer ' + localStorage.getItem('token')},
    }).pipe(map(data => new BaseResponse().deserialize(data)));
  }

  deleteCard(card: any) {
    return this.http.delete(this.URL_API + '/' + card._id, {
      headers: {'accept-language': 'es-ES', Authorization: 'Bearer ' + localStorage.getItem('token')},
    }).pipe(map(data => new BaseResponse().deserialize(data)));
  }

  createCard(card: any) {
    return this.http.post(this.URL_API, card, {
    }).pipe(map(data => new CreateCardResponseModel().deserialize(data)));
  }

}
