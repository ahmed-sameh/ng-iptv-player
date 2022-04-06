import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetDataService {

  constructor(private httpSender: HttpClient) { }

  getData(url: string){
    return this.httpSender.get<any>(url)
  }


}
