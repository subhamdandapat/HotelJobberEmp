import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class BroadcastProvider {
  apiUrl: string;
  constructor(public http: HttpClient) {
    console.log('Hello BroadcastProvider Provider');
    this.apiUrl = 'https://www.hoteljobber.com/new-api/';
  }

  getBroadcastActivePlan(apiName, param) {
    return this.http.post(this.apiUrl+apiName, param).map(res => res);
  }

  getBroadcastPlanList(apiName) {
    return this.http.get(this.apiUrl+apiName).map(res => res);
  }

  fireBroadcast(apiName, param) {
    return this.http.post(this.apiUrl+apiName, param).map(res => res);
  }

  getBroadcastSentList(apiName) {
    return this.http.get(this.apiUrl+apiName).map(res => res);
  }

  broadcastPaymentUpdate(apiName, param) {
    return this.http.post(this.apiUrl+apiName, param).map(res => res);
  }

}
