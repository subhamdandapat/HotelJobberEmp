import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { ToastController } from 'ionic-angular';
import { LoadingController, Loading } from 'ionic-angular';

@Injectable()
export class EmployeerProvider {
  loading: Loading;
  baseUrl: any;
  notificationURL: string;
  notificationReadUrl: string;
  notificationCountUlr: string;
  totalNotification: number;
  clearUrl: string;
  nurl: string;
  constructor(public http: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
    this.http = http;
    this.baseUrl = "https://www.hoteljobber.com/api/";
    this.notificationURL = 'https://www.hoteljobber.com/new-api/notification.php?option=listEmp&ItemPerPage=25&&EmpId=';
    this.notificationReadUrl = 'https://www.hoteljobber.com/new-api/notification.php?option=readCount&startId=';
    this.notificationCountUlr = 'https://www.hoteljobber.com/new-api/notification.php?option=newNot&LatestId=';
    this.clearUrl = 'https://www.hoteljobber.com/new-api/notification.php';
    this. nurl = "https://www.hoteljobber.com/new-api/";

  }

  getEmpLogin(url, body_parms) {
    return this.http.post(this.baseUrl + url, body_parms).map(res => res)
  }
  socialLogin(url, body_parms) {
    console.log(this.nurl + url, body_parms)
    return this.http.post(this.nurl + url, body_parms).map(res => res)

  }
  getEmpNotifications(empID, pageNo) {
    return this.http.get(this.notificationURL + empID + '&PageNo=' + pageNo).map(res => res);
  }

  getNotificationRead(startID, endID, empID) {
    return this.http.get(this.notificationReadUrl + startID + '&endId=' + endID + '&EmpId=' + empID).map(res => res);
  }

  getNotificationCount(empID, latestID) {
    return this.http.get(this.notificationCountUlr + latestID + '&EmpId=' + empID).map(res => res);
  }

  clearNotification(body_parms) {
    return this.http.post(this.clearUrl, body_parms).map(res => res);
  }
}
