import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IFutureFlight } from '../../interfaces/future-flight'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FutureFlightsService {
  baseUrl: string = '../../../assets'//'https://raw.githubusercontent.com/nasascience/angular-flights/master/src/assets'
  constructor(private http: HttpClient) {

  }


  /**
  * Get all future flags by Aircraft Reg (this is a simple simulation of server call)
  *
  * @returns Observable<IFutureFlight[]>
  * */
  getFutureFlags(aircraftReg: string): Observable<IFutureFlight[]> {
    return this.http.get<IFutureFlight[]>(`${this.baseUrl}/futureflights_${aircraftReg}.json`)
  }

}
