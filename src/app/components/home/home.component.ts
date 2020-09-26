import { Component, OnInit } from '@angular/core';
import { FutureFlightsService } from '../../services/future-flights/future-flights.service';
import { IFutureFlight } from '../../interfaces/future-flight'
import { LoaderService } from '../../services/loader/loader.service'
import { AlertsService } from '../../services/alerts/alerts.service'
declare var $: any

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  flightsData: IFutureFlight[] = []
  flightDates: number[] = [] // dates in ms
  aircrafts: string[] = ['A-PLN1', 'A-PLN2', 'A-PLN3', 'A-PLN4']
  date : Date = new Date()

  constructor(
    private futureFlightsService: FutureFlightsService,
    private loaderService: LoaderService,
    private alertsService: AlertsService) { }

  ngOnInit(): void {
    this.getFutureFligts("A-PLN1")
  }

  filterAircraft(ircraft: string){

  }

  getFutureFligts(aircraftReg: string){
    this.loaderService.showLoader()

    this.futureFlightsService.getFutureFlags(aircraftReg)
    .subscribe( data => {
      this.flightsData = data
      console.log("getFutureFlags", this.flightsData)

      this.buildDateColumns(data)
      this.loaderService.hideLoader()
    },error =>{
      this.alertsService.showDanger("error: " + error.message, 4)
      this.loaderService.hideLoader()
    })
  }

  buildDateColumns(data: IFutureFlight[]){
    let allDates = data.map(x =>  Date.parse(x.departureDate.trim()))
    let arrivalDates = data.map(x =>  Date.parse(x.arrivalDate.trim()))

    allDates.push(...arrivalDates)
    var uniqueDates = [...new Set(allDates)].sort() // get unique and sort asc
    this.flightDates = uniqueDates
  }

  setFlightDuration(flightData: IFutureFlight) {
    let pixelHr = 7
    let offsetLeft = 167

    // Set Position: Find Row Date Match
    var dateRowElem = $(`.${flightData.departureDate.trim()}`)[0]

    let departureHr = parseInt(flightData.departureTime.substring(0,2))
    let departureMin = parseInt(flightData.departureTime.slice(-2))
    let totalDepHoursPx = (departureHr + (departureMin / 60)) * pixelHr

    let leftPos = dateRowElem.offsetLeft - offsetLeft + totalDepHoursPx





    let arrivalHr = flightData.arrivalTime


    return { 'margin-left': `${leftPos}px`,'width': `${totalDepHoursPx}px` }
  }

}
