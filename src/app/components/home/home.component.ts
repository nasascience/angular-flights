import { Component, OnInit } from '@angular/core';
import { FutureFlightsService } from 'src/app/services/future-flights.service';
import { IFutureFlight } from '../../interfaces/future-flight'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  aircrafts: string[] = ['A-PLN1', 'A-PLN2', 'A-PLN3', 'A-PLN4']
  date : Date = new Date()

  constructor(private futureFlightsService: FutureFlightsService) { }

  ngOnInit(): void {
    this.getFutureFligts("A-PLN1")
  }

  filterAircraft(ircraft: string){

  }

  getFutureFligts(aircraftReg: string){
    this.futureFlightsService.getFutureFlags(aircraftReg)
    .subscribe( data => {
      console.log("getFutureFlags", data)
    })
  }

}
