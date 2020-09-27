import { Component, OnInit } from '@angular/core';
import { FutureFlightsService } from '../../services/future-flights/future-flights.service';
import { IFutureFlight } from '../../interfaces/future-flight'
import { LoaderService } from '../../services/loader/loader.service'
import { AlertsService } from '../../services/alerts/alerts.service'
import { FlightHourFriendlyPipe } from '../../pipes/flight-hour-friendly.pipe'
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
  date: Date = new Date()
  zoom: number = 50

  constructor(
    private futureFlightsService: FutureFlightsService,
    private loaderService: LoaderService,
    private alertsService: AlertsService) { }

  ngOnInit(): void {
    this.getFutureFligts("A-PLN1")
  }

  filterAircraft(ircraft: string) {

  }

  getFutureFligts(aircraftReg: string) {
    this.loaderService.showLoader()

    this.futureFlightsService.getFutureFlags(aircraftReg)
      .subscribe(data => {
        this.flightsData = data
        console.log("getFutureFlags", this.flightsData)

        this.buildDateColumns(data)
        this.loaderService.hideLoader()
      }, error => {
        this.alertsService.showDanger("error: " + error.message, 4)
        this.loaderService.hideLoader()
      })
  }

  buildDateColumns(data: IFutureFlight[]) {
    let allDates = data.map(x => Date.parse(x.departureDate.trim()))
    let arrivalDates = data.map(x => Date.parse(x.arrivalDate.trim()))

    allDates.push(...arrivalDates)
    var uniqueDates = [...new Set(allDates)].sort() // get unique and sort asc
    this.flightDates = uniqueDates
  }

  setFlightDuration(flightData: IFutureFlight) {
    let pixelHr = 7
    let offsetLeft = 167

    // Set start Position: Find Departure Row Date Match
    var dateDepRowElem = $(`.${flightData.departureDate.trim()}`)[0]
    let totalDepHoursPx = this.parseFlightTime(flightData.departureTime) * pixelHr
    let startPoint = dateDepRowElem.offsetLeft - offsetLeft + totalDepHoursPx

    // Set end Position: Find Arrival Row Date Match
    var dateArrRowElem = $(`.${flightData.arrivalDate.trim()}`)[0]
    let totalArrHoursPx = this.parseFlightTime(flightData.arrivalTime) * pixelHr
    let endPoint = dateArrRowElem.offsetLeft - offsetLeft + totalArrHoursPx
    let flightDuration = endPoint - startPoint

    return { 'margin-left': `${startPoint}px`, 'width': `${flightDuration}px` }
  }

  parseFlightTime(time: string) {
    let timeHr = parseInt(time.substring(0, 2))
    let timeMin = parseInt(time.slice(-2))
    return timeHr + (timeMin / 60)
  }

  getZoom() {
    // 60 => 109px left ; 22px top

      //return { 'transform' :  `scale(${this.zoom / 50})` }
    return { 'zoom': `${this.zoom * 2}%` }
  }

  resetZoom(){
    this.zoom = 50
  }

  zoomIn(){
    this.zoom += 1
  }

  zoomOut(){
    this.zoom -= 1
  }
}
