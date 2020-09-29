import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class CheckupdateProvider {
  url: string;
  baseUrl: string;
  constructor(public http: HttpClient) {
    this.url = 'https://www.hoteljobber.com/new-api/app.php?option=updateInfo&app=employer';
    this.baseUrl = 'https://www.hoteljobber.com/new-api/'
  }

  checkUpdate(EmplooyerID) {
    return this.http.get(this.url+'&Employer_ID='+EmplooyerID+'&Source_Type=AndroidApp');
  }
}
