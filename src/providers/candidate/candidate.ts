import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class CandidateProvider {
  baseUrl: any;
  newBaseUrl: String;
  constructor(public http: HttpClient) {
    this.baseUrl = "https://www.hoteljobber.com/api/";
    this.newBaseUrl = "https://www.hoteljobber.com/new-api/";
  }

  getOptions(url) {
    return this.http.get(this.baseUrl + url).map(res => res);
  }

  getCandidates(url, body_parms) {
    return this.http.post(this.baseUrl + url, body_parms).map(res => res)
  }

  //New API which will give you the list of candidate same like website
  getCandidateList(option, Emp_ID, page, cityTitle, jobRoll) {
    return this.http.get(this.newBaseUrl+'candidate.php?Option='+option+'&ItemPerPage=50&Employer_ID='+Emp_ID+'&PageNo='+page+'&City='+cityTitle+'&RoleID='+jobRoll+'&OrderBy=')
      .map(res => res);
  }

  //Get candidate like or des
  getLike(option, Emp_ID, page, cityTitle, jobRoll) {
    return this.http.get(this.newBaseUrl+'candidate.php?Option='+option+'&ItemPerPage=50&Employer_ID='+Emp_ID+'&PageNo='+page+'&MinSalary=&MaxSalary=&City='+cityTitle+'&RoleID='+jobRoll+'&OrderBy=')
      .map(res => res);
  }

  /*candidate.php?Option=CandEtra&ItemPerPage=20&Employer_ID=5292&PageNo=0&MinSalary=&MaxSalary=&City=&RoleID=&OrderBy=*/

  sendSMS(url, body_params) {
    return this.http.post(this.newBaseUrl + url, body_params)
      .map(res => res)
  }

  getCandidatesDetails(url, body_parms) {
    return this.http.post(this.baseUrl + url, body_parms)
      .map(res => res)
  }

  getCandidateNewDetails(url, body_params) {
    return this.http.post(this.newBaseUrl + url, body_params)
      .map(res => res)
  }

  getApliedCandidateList(job_ID, Emp_ID, pageNo) {
    return this.http.get('https://www.hoteljobber.com/new-api/candidate.php?Option=AppliedCandidates&ItemPerPage=10&Job_ID='+job_ID+'&Employer_ID='+Emp_ID+'&PageNo='+pageNo)
      .map(res => res);
  }

  updateReadStatus(userID, EmpID,) {
    return this.http.post( this.newBaseUrl+'notification.php', {UserId:userID, EmpId:EmpID, option:'read',type:'register'}).map(res => res);
  }

  addShortlist(CandidateID, EmpID) {
    return this.http.post( this.newBaseUrl+'common-operations.php', {User_ID:CandidateID, Employer_ID:EmpID, option:'shortList'}).map(res => res);
  }

  removeShortlist(CandidateID, EmpID)  {
    return this.http.post( this.newBaseUrl+'common-operations.php', {User_ID:CandidateID, Employer_ID:EmpID, option:'removeShortList'}).map(res => res);
  }

  getShortlist(EmpID, pageNo) {
    return this.http.get(this.newBaseUrl+'candidate.php?Option=MyShortList&ItemPerPage=25&Employer_ID='+EmpID+'&PageNo='+pageNo)
      .map(res => res);
  }

  getCandidateJobDetails(urlParam) {
    return this.http.get(this.newBaseUrl+urlParam)
      .map(res => res);
  }

}
