import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    public http: HttpClient
  ) { }

  insertData(dat: any) {
    return new Promise((resolve, reject) => {
      let data = dat;
      console.log(data)
      this.http.post('http://192.168.8.64:3000/api/insert', data).subscribe((res: any) => {
        resolve(res)
      }, err => {
        reject(err)
      })
    })
  }

  getData() {
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:3000/api/getdata').subscribe((res: any) => {
        resolve(res)
      }, err => {
        reject(err)
      })
    })
  }

  getOne(id: any) {
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:3000/api/getdata/' + id).subscribe((res: any) => {
        resolve(res)
      }, err => {
        reject(err)
      })
    })
  }
}
