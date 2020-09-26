import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { IFutureFlight } from '../../interfaces/future-flight'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FutureFlightsService {
  baseUrl: string = 'https://raw.githubusercontent.com/nasascience/angular-flights/master/src/assets'
  constructor(private http: HttpClient) {

   }

  // Gets All future flags by Aircraft Reg (parameter not implemented)
  getFutureFlags(aircraftReg: string): Observable<IFutureFlight[]>{
      return this.http.get<IFutureFlight[]>(`${this.baseUrl}/futureflights.json`)
  }
}
