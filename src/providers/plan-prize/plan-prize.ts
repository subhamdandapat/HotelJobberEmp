import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class PlanPrizeProvider {

  baseUrl:any;
  newBaseURL: string;
  constructor(public http: HttpClient) {
    this.http = http;
    this.baseUrl = "https://www.hoteljobber.com/api/";
    this.newBaseURL = "https://www.hoteljobber.com/new-api/";
  }

  getPlans(url, body_parms) {
    return this.http.post(this.newBaseURL + url, body_parms).map(res => res)
  }

  getOptions(url) {
    return this.http.get(this.baseUrl+url).map(res => res);
  }

  getPlan(url) {
    return this.http.get(url).map(res => res);
  }

  checkOutRazorPay(body) {
    return this.http.post('https://www.hoteljobber.com/new-api/checkout.php', body).map((res: any) => res);
  }

  updateRzrPayStatus(body) {
    return this.http.post(this.newBaseURL+'payment-complete-razorpay.php', body).map((res: any) => res);
  }

  getPayMentGateway() {
    return this.http.get(this.baseUrl+'').map(res => res);
  }

}
