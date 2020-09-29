import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ServiceProvider {
  
  constructor(public http: HttpClient) {}

 /* getOptions(url) {
    console.log('Service provider:->');
    return this.http.get(this.baseUrl+url).map(res => res);
  }*/

  getDashOptions(url) {
    return this.http.get(url).map(res => res);
  }
}
