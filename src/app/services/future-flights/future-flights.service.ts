import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IFutureFlightData, IFutureFlight } from '../../interfaces/future-flight'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FutureFlightsService {
  baseUrl: string = 'https://raw.githubusercontent.com/nasascience/angular-flights/master/src/assets/data'
  constructor(private http: HttpClient) {}

  /**
  * Get all future flags by Aircraft Reg (this is a simple simulation of server call)
  * @param string aircraftReg
  * @returns Observable<IFutureFlight[]>
  * */
  getFutureFlights(aircraftReg: string): Observable<IFutureFlightData> {
    return new Observable<IFutureFlightData>(subscriber => {
      this.http.get<IFutureFlight[]>(`${this.baseUrl}/futureflights_${aircraftReg}.json`)
        .subscribe(data => {
          const flightData: IFutureFlightData = { aircraftReg: aircraftReg, data: data }
          subscriber.next(flightData)
          subscriber.complete()
        })
    })
  }

  /**
  * Get all Aircrafts Reg
  * @returns Observable<string[]>
  * */
  getAircrafts(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/aircrafts.json`)
  }

}
