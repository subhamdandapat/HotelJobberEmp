import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
/*
All the local storage operation handle by storage provider
*/
@Injectable()
export class StorageProvider {

  constructor(public storage: Storage) {
    console.log('Hello StorageProvider Provider');
  }

  getStorage(key: string) {
    return new Promise((resolve, reject)=> {
      this.storage.get(key)
        .then((data)=> {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  setStorage(key: string, value: any) {
    this.storage.set(key, value).then(()=> {console.log('Value Saved In Storage:');});
  }

  fetchSP() {
    return new Promise((resolve, reject) => {
      this.storage.get('employeer_details').then((employeeDetail: any) => {
        resolve(employeeDetail)
      })
        .catch((err)=> {
          reject(err)
        });
    })
  }
}
