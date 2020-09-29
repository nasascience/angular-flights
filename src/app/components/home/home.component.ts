import { Component, OnInit } from '@angular/core';
import { FutureFlightsService } from '../../services/future-flights/future-flights.service';
import { IFutureFlight } from '../../interfaces/future-flight'
import { LoaderService } from '../../services/loader/loader.service'
import { HelperService } from '../../services/helper/helper.service'
import { NgStyle } from '@angular/common';

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
  //zoom: number = 50
  initColWidth: number = 169
  aircraftColWidth: number = 168
  constructor(
    private futureFlightsService: FutureFlightsService,
    private loaderService: LoaderService,
    private helperService: HelperService) { }

  ngOnInit(): void {
    this.selectedAircrafts = this.aircrafts
    this.getFutureFligts("A-PLN1")
    const aircraftColum = document.querySelector('.aircraft-reg-container') as HTMLElement

    this.aircraftColWidth = aircraftColum.offsetWidth
  }

  /**
   * Filters the Aircraft column list from the multi select dropdown
   * */
  filterAircraft(event: any, aircraft: string) {
    if (event.target.checked) {
      this.selectedAircrafts.push(aircraft)
    } else {

      this.selectedAircrafts = this.selectedAircrafts.filter(x => x != aircraft)
    }
    this.selectedAircrafts.sort()
  }

  /**
   * Gets the future fligts data from the server and sets up the fligts data grid
   * @param string aircraftReg
   * */
  getFutureFligts(aircraftReg: string) {
    this.loaderService.showLoader()

    this.futureFlightsService.getFutureFlags(aircraftReg)
      .subscribe(data => {
        this.flightsData = data

        this.buildDateColumns(data)
        this.loaderService.hideLoader()
      }, error => {
        alert(error.message)
        this.loaderService.hideLoader()
      })
  }

  /**
  * Sets up the Date columns in the data grid according to the flights data retrieved.
  * Also formats the data in a more friendly way
  * @param IFutureFlight[] data
  * */
  buildDateColumns(data: IFutureFlight[]) {
    let allDates = data.map(x => Date.parse(x.departureDate.trim()))
    let arrivalDates = data.map(x => Date.parse(x.arrivalDate.trim()))

    allDates.push(...arrivalDates)

    //Logic for adding yesterday block to display first departure Point
    //Get min Date array
    let minDateMs = Math.min(...allDates)
    let minDate = new Date(minDateMs)
    let minDateStr = this.helperService.customDateFormat(minDate, "#YYYY#-#MM#-#DD#")

    // Gets the time array of the first departure Day Block
    let firstDateBlockDepHrs = data.filter(x => x.departureDate.trim() == minDateStr).map(x => parseInt(x.departureTime))

    // Add yesterday Block if the first departure date is before 3:00AM
    if (Math.min(...firstDateBlockDepHrs) < 300) {
      let yesterday = minDateMs - 8.64e+7
      allDates.push(yesterday)
    }

    // get unique and sort asc
    var uniqueDates = [...new Set(allDates)].sort()
    this.flightDates = uniqueDates
  }

  /**
  * Builds the flight duration setting up the start point and duration of the flight
  * @param IFutureFlight flightData
  * @returns NgStyle
  * */
  setFlightDuration(flightData: IFutureFlight): NgStyle["ngStyle"] {
    // Set start Position: Find Departure Row Date Match
    let startPoint = this.getPointHrPix(flightData.departureDate, flightData.departureTime)

    // Set end Position: Find Arrival Row Date Match
    let endPoint = this.getPointHrPix(flightData.arrivalDate, flightData.arrivalTime)
    let flightDuration = endPoint - startPoint

    return { 'margin-left': `${startPoint}px`, 'width': `${flightDuration}px` }
  }

  /**
   * Calculates the departure or arrival points in pixel
   * @param string dateBlock
   * @param string timeBlock
   * @returns number
   * */
  getPointHrPix(dateBlock: string, timeBlock: string): number {
    let pixelHr = this.initColWidth / 24
    let offsetLeft = this.aircraftColWidth//this.initColWidth
    let dateDepRowElem = document.getElementsByClassName(`${dateBlock.trim()}`)[0] as HTMLElement
    let totalDepHoursPx = this.parseFlightTime(timeBlock) * pixelHr
    let point = dateDepRowElem.offsetLeft - offsetLeft + totalDepHoursPx
    return point
  }

  /**
  * Parse and converts to hours the string passed
  * @param string time
  * @returns number: time in hours
  * */
  parseFlightTime(time: string): number {
    let timeHr = parseInt(time.substring(0, 2))
    let timeMin = parseInt(time.slice(-2))
    return timeHr + (timeMin / 60)
  }

  /**
   * Stablishes the position of the arrival text point. e.g RIX, PRG, etc.
   * @param HTMLElement flightDurationEl
   * @returns style Type
   * */
  setFlightArrivalPoint(flightDurationEl: HTMLElement): NgStyle["ngStyle"] {
    let flightDuration = flightDurationEl.getBoundingClientRect().width
    return { 'margin-left': `${flightDuration}px` }
  }

  /**
   * Sets the flight column width and background depending on the current zoom
   * @returns style Type
   * */
  getFlightColStyle(): NgStyle["ngStyle"] {
    let blockSize = this.initColWidth / 24
    return { 'width': `${this.initColWidth}px`, 'background-size': `${blockSize}px ${blockSize}px` }
  }

  /**
   * Sets the zoom to default value
   * */
  resetZoom() {
    this.initColWidth = 169
  }

  /**
   * Simulates the zoom In
   * */
  zoomIn() {
    this.initColWidth += 1
  }

  /**
   * Simulates the zoom Out
   * */
  zoomOut() {
    this.initColWidth -= 1
  }
}
