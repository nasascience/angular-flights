import { Component, OnInit } from '@angular/core';
import { FutureFlightsService } from '../../services/future-flights/future-flights.service';
import { IFutureFlightData, IFutureFlight } from '../../interfaces/future-flight'
import { LoaderService } from '../../services/loader/loader.service'
import { HelperService } from '../../services/helper/helper.service'
import { NgStyle } from '@angular/common';
import { forkJoin, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  selectedFlightsData: IFutureFlightData[] = []
  flightDates: number[] = [] // dates in ms
  aircrafts: string[] = []
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

    this.loaderService.showLoader()
    this.futureFlightsService.getAircrafts()
      .subscribe(x => {
        this.aircrafts = this.selectedAircrafts = x
        // I suggest the aircraft data retrieved from the service also returns the flight data
        this.getAllFutureAircraftsFligtsData()
        this.loaderService.hideLoader()
      }, error => {
        alert(error.message)
        this.loaderService.hideLoader()
      })

    const aircraftColum = document.querySelector('.aircraft-reg-container') as HTMLElement
    this.aircraftColWidth = aircraftColum.offsetWidth
  }

  /**
   * Gets the future fligts data from the server based on all aircraft regs loaded and sets up the fligts data grid
   * */
  getAllFutureAircraftsFligtsData() { //getAllFutureFligtsForSelectedAircrafts
    this.loaderService.showLoader()

    if(this.selectedAircrafts.length == 0){
      this.selectedFlightsData = []
      this.loaderService.hideLoader()
      return
    }

    // Getting fligst data for selected aircrafts
    let observables = this.selectedAircrafts.map(aircraftReg => this.futureFlightsService.getFutureFlights(aircraftReg))
    let source = forkJoin(observables)
    source.subscribe(allAircraftData => {

      this.selectedFlightsData = allAircraftData

      this.buildDateColumns(allAircraftData)
      this.loaderService.hideLoader()
    }, error => {
      alert(error.message)
      this.loaderService.hideLoader()
    })

  }

  /**
  * Filters the Aircraft column list from the multi select dropdown
  *  @param string data aircraftReg
  * */
  filterAircraft(event: any, aircraftReg: string) {
    if (event.target.checked){
      this.loaderService.showLoader()

      // I assume we want to reload the data everytime we check on the aircraft
      // Get from server the checked flight data
      this.futureFlightsService.getFutureFlights(aircraftReg)
      .subscribe(flightsData =>{
        // Loading and adding the data from service based on the checked item
        this.selectedAircrafts.push(aircraftReg)
        this.selectedFlightsData.push(flightsData)
        this.loaderService.hideLoader()
        this.sortGridData()
      }, error=>{
        this.loaderService.hideLoader()
        alert(error.message)
      })
    }
    else{
      // Removing the data from service based on the checked item
      this.selectedAircrafts = this.selectedAircrafts.filter(x => x != aircraftReg)
      this.selectedFlightsData =  this.selectedFlightsData.filter(x => x.aircraftReg != aircraftReg)
      this.sortGridData()
    }
  }

  sortGridData(){
    this.selectedAircrafts.sort()
    this.selectedFlightsData.sort((a, b) => (a.aircraftReg > b.aircraftReg) ? 1 : -1)
  }

  /**
  * Sets up the Date columns in the data grid according to the flights data retrieved.
  * Also formats the data in a more friendly way
  * @param IFutureFlight[] data
  * */
  buildDateColumns(data: IFutureFlightData[]) {
    let minDeparturDate = Math.min(...data.filter(x => x.data.length != 0).map(x => Math.min(...x.data.map(y => Date.parse(y.departureDate.trim())))))
    let maxArrivalDate =  Math.max(...data.filter(x => x.data.length != 0).map(x => Math.max(...x.data.map(y => Date.parse(y.arrivalDate.trim())))))

    const allDates = this.addDatesArray(minDeparturDate, maxArrivalDate)

    //Logic for adding yesterday block to display first departure Point
    //Get min Date array
    const minDateMs = Math.min(...allDates)

    // Gets the time array of the first departure Day Block
    const firstDateBlockDepHrs = Math.min(...(data.filter(x => x.data.length != 0).map(a => Math.min(...(a.data.map(c => parseInt(c.departureTime)))))))

    // Add yesterday Block if the first departure date is before 3:00AM
    if (firstDateBlockDepHrs < 300) {
      let yesterday = minDateMs - 8.64e+7
      allDates.push(yesterday)
    }

    // Get unique and sort asc
    let uniqueDates = [...new Set(allDates)].sort()
    this.flightDates = uniqueDates
  }

   /**
  * Builds the range of dates based on all the flight data provided
  * @param number minDate
  * @param number maxDate
  * @returns number[] array of dates
  * */
  addDatesArray(minDate: number, maxDate: number): number[]{
    let datesRange: number[] = []
    datesRange.push(minDate)
    //var Difference_In_Time = minDate.getTime() - maxDate.getTime();
    var dayDiff = (maxDate - minDate) / (1000 * 3600 * 24);
    for(let i =0; i < dayDiff; i++){
      datesRange.push(minDate + (8.64e+7 * (i+1) ))
    }
    return datesRange
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
    const pixelHr = this.initColWidth / 24
    const offsetLeft = this.aircraftColWidth//this.initColWidth
    const dateDepRowElem = document.getElementsByClassName(`${dateBlock.trim()}`)[0] as HTMLElement
    const totalDepHoursPx = this.parseFlightTime(timeBlock) * pixelHr
    const point = dateDepRowElem.offsetLeft - offsetLeft + totalDepHoursPx
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
   * @param string aircraftReg
   * @param number flightIndex - Flight Duration Index in array
   * @param boolean isLast - to check whether is the last item in the array
   * @param string arrival Time point - to determine the position in the current time block. (This is used to calculate last arrival point area)
   * @returns style Type
   * */
  setFlightPoints(aircraftReg : string, flightIndex: number, isLast: boolean, arrivalPoint?: string): NgStyle["ngStyle"] {
    // Current flight Data
    const flightDurationEl = document.querySelector(`.flightdur_${aircraftReg}_${flightIndex}`) as HTMLElement

    if(flightIndex == 0){
      // Calculates position and width of the FIRST flight points RIX/PRG
      const pointWidth = flightDurationEl.offsetLeft
      return { 'margin-left': `${0}px`, 'width': `${pointWidth}px`}
    }else if (isLast){
      // Calculates position and width of the LAST flight points RIX/PRG
      const pixelHr = this.initColWidth / 24
      const pointleft = flightDurationEl.offsetLeft + flightDurationEl.offsetWidth
      const partialArea = this.parseFlightTime(arrivalPoint) * pixelHr
      const pointWidth = this.initColWidth - partialArea
      return { 'margin-left': `${pointleft}px`, 'width': `${pointWidth}px`}
    }

    // Calculates position and width of the flight points RIX/PRG
    const flightDurationElPrev = document.querySelector(`.flightdur_${aircraftReg}_${flightIndex-1}`) as HTMLElement
    const pointLeft = flightDurationElPrev.offsetLeft + flightDurationElPrev.offsetWidth
    const pointWidth = flightDurationEl.offsetLeft - pointLeft



    return { 'margin-left': `${pointLeft}px`, 'width': `${pointWidth}px`}
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
