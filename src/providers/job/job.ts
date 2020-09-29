import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class JobProvider {

  baseUrl: string;
  newBaseUrl: string;
  constructor(public http: HttpClient) {
    this.baseUrl = "https://www.hoteljobber.com/api/";
    this.newBaseUrl = 'https://www.hoteljobber.com/new-api/'
  }

  //This will post organization job
  postJob(url, body_parms) {
    return this.http.post(this.baseUrl + url, body_parms).map(res => res);
  }

  getJobList(urlParam) {
    return this.http.get(this.baseUrl+urlParam).map(res => res);
  }

  getCandidateJobList(urlParam) {
    return this.http.get(this.newBaseUrl+urlParam).map(res => res);
  }

  getJobRolls(url, body_param) {
    return this.http.post(this.baseUrl+url, body_param).map((res: any) => res);
  }

  getEmpMyJobs(urlParam) {
    return this.http.get(this.baseUrl+urlParam).map(res => res);
  }
}
