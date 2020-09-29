import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class OrganizationProvider {

  baseUrl:any;
  constructor(public http: HttpClient) {
    this.http=http;
    this.baseUrl = "https://www.hoteljobber.com/api/";
  }

  createOrganization(url, body_parms) {
    return this.http.post(this.baseUrl + url, body_parms).map(res => res);
  }

  getMyOrganization(Emp_ID) {
    return  this.http.get('https://www.hoteljobber.com/new-api/organisation.php?option=get_my_org&Emp_ID='+Emp_ID).map(res => res);
  }

  getOrganisationDetails(url, body_parms) {
    return this.http.post(this.baseUrl + url, body_parms).map(res => res);
  }

  getHotClient() {
    return  this.http.get('https://www.hoteljobber.com/new-api/common-operations.php?option=TopEmployers').map(res => res);
  }
}
