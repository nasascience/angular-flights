import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { IFutureFlight } from '../interfaces/future-flight'
import  futureflights from '../../files/futureflights.json'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FutureFlightsService {
  futureflightsData: IFutureFlight[] = futureflights;

  constructor(private http: HttpClient) {

   }

  getFutureFlags(aircraftReg: string): Observable<IFutureFlight[]>{
    return this.http.get("./assets/json/about.json");
    // return new Observable<IFutureFlight[]>(subscriber =>{
    //   setTimeout(()=>{
    //     subscriber.next(this.futureflightsData)
    //   },2000)
    // })
  }
}
