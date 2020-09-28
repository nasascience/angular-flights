import { Component, OnInit } from '@angular/core';
import { FutureFlightsService } from '../../services/future-flights/future-flights.service';
import { IFutureFlight } from '../../interfaces/future-flight'
import { LoaderService } from '../../services/loader/loader.service'
import { AlertsService } from '../../services/alerts/alerts.service'
import { FlightHourFriendlyPipe } from '../../pipes/flight-hour-friendly.pipe'


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  flightsData: IFutureFlight[] = []
  flightDates: number[] = [] // dates in ms
  aircrafts: string[] = ['A-PLN1', 'A-PLN2', 'A-PLN3', 'A-PLN4']
  selectedAircrafts: string[] = []
  date: Date = new Date()
  zoom: number = 50

  constructor(
    private futureFlightsService: FutureFlightsService,
    private loaderService: LoaderService,
    private alertsService: AlertsService) { }

  ngOnInit(): void {
    this.selectedAircrafts = this.aircrafts
    this.getFutureFligts("A-PLN1")
  }

  filterAircraft(event: any, aircraft: string) {
    console.log(event.target.checked, aircraft)
    if(event.target.checked){
      this.selectedAircrafts.push(aircraft)
    }else{

      this.selectedAircrafts = this.selectedAircrafts.filter(x => x != aircraft)
    }
    this.selectedAircrafts.sort()
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
        alert(error.message)//this.alertsService.showDanger("error: " + error.message, 4)
        this.loaderService.hideLoader()
      })
  }

  buildDateColumns(data: IFutureFlight[]) {
    let allDates = data.map(x => Date.parse(x.departureDate.trim()))
    let arrivalDates = data.map(x => Date.parse(x.arrivalDate.trim()))

    allDates.push(...arrivalDates)

    //Logic for adding yesterday block to display first departure Point
    //Get min Date array
    let minDateMs = Math.min(...allDates)
    let minDate = new Date(minDateMs)
    let minDateStr = (<any>minDate).customFormat( "#YYYY#-#MM#-#DD#" )
    // Gets the time array of the first departure Day Block
    let firstDateBlockDepHrs = data.filter(x => x.departureDate.trim() == minDateStr).map(x => parseInt(x.departureTime))

    // Add yesterday Block if the first departure date is before 3:00AM
    if(Math.min(...firstDateBlockDepHrs) < 300){
      let yesterday = minDateMs -8.64e+7
      allDates.push(yesterday)
    }

    // get unique and sort asc
    var uniqueDates = [...new Set(allDates)].sort()
    this.flightDates = uniqueDates
  }

  setFlightDuration(flightData: IFutureFlight) {
    // Set start Position: Find Departure Row Date Match
    let startPoint = this.getPointHrPix(flightData.departureDate, flightData.departureTime)

    // Set end Position: Find Arrival Row Date Match
    let endPoint = this.getPointHrPix(flightData.arrivalDate, flightData.arrivalTime)
    let flightDuration = endPoint - startPoint

    return { 'margin-left': `${startPoint}px`, 'width': `${flightDuration}px` }
  }

  getPointHrPix(dateBlock: string , timeBlock: string){
    let pixelHr = 168 / 24
    let offsetLeft = 168
    //let dateDepRowElem = document.querySelector(`.${dateBlock.trim()}`) as HTMLElement;
    let dateDepRowElem = document.getElementsByClassName(`${dateBlock.trim()}`)[0] as HTMLElement
    let totalDepHoursPx = this.parseFlightTime(timeBlock) * pixelHr
    let startPoint = dateDepRowElem.offsetLeft - offsetLeft + totalDepHoursPx
    return startPoint
  }

  parseFlightTime(time: string) {
    let timeHr = parseInt(time.substring(0, 2))
    let timeMin = parseInt(time.slice(-2))
    return timeHr + (timeMin / 60)
  }

  setFlightArrivalPoint(flightDurationEl: HTMLElement){
    let flightDuration = flightDurationEl.getBoundingClientRect().width
    //console.log("flightDurationEl", flightDuration)
     return { 'margin-left': `${flightDuration}px` }
  }

  getZoom() {
    return { 'zoom': `${this.zoom * 2}%` }
  }

  resetZoom(){
    this.zoom = 50
  }

  zoomIn(){
    if(this.zoom < 100)
      this.zoom += 1
  }

  zoomOut(){
    if(this.zoom >0)
      this.zoom -= 1
  }
}
