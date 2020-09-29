import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class CityProvider {
  result: any;
  constructor(public http: HttpClient) {
    console.log('Hello CityProvider Provider');
  }

/*  getPorts(page: number = 1, size: number = 15): CityCLass[] {
    return this.result.slice((page - 1) * size, ((page - 1) * size) + size);
  }*/

  getResults(keyword:string) {
    return this.http.get("https://www.hoteljobber.com/new-api/common-operations.php?option=app_city_like&key="+keyword)
      .map(result => {
        this.result = result;
        return this.result
      });
  }

  /*getPortsAsync(page: number = 1, size: number = 15): Observable<CityCLass[]> {
    return new Observable<CityCLass[]>(observer => {
      observer.next(this.getPorts(page, size));
      observer.complete()
    }).pipe(delay(100));
  }*/

}
