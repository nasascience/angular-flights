import { Component, OnInit, Input } from '@angular/core';
import { IFutureFlight } from '../../interfaces/future-flight'
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-flight-duration',
  templateUrl: './flight-duration.component.html',
  styleUrls: ['./flight-duration.component.css']
})
export class FlightDurationComponent implements OnInit {
  // Index
  public _index: number
  @Input('index')
  public set index(value: number) {
    this._index = value;
  }
  public get index(): number {
    return this._index;
  }

  // Flight Data
  public _flight: IFutureFlight
  @Input('flight')
  public set flight(value: IFutureFlight) {
    this._flight = value;
  }
  public get flight(): IFutureFlight {
    return this._flight;
  }

  //AircraftReg
  public _aircraftReg: string
  @Input('aircraftReg')
  public set aircraftReg(value: string) {
    this._aircraftReg = value;
  }
  public get aircraftReg(): string {
    return this._aircraftReg;
  }

  //InitColWidth
  public _initColWidth: number
  @Input('initColWidth')
  public set initColWidth(value: number) {
    this._initColWidth = value;
  }
  public get initColWidth(): number {
    return this._initColWidth;
  }

  //aircraftColWidth
  public _aircraftColWidth: number
  @Input('aircraftColWidth')
  public set aircraftColWidth(value: number) {
    this._aircraftColWidth = value;
  }
  public get aircraftColWidth(): number {
    return this._aircraftColWidth;
  }

  // flightData.data.length
  public _flightDataLength: number
  @Input('flightDataLength')
  public set aircflightDataLengthraftReg(value: number) {
    this._flightDataLength = value;
  }
  public get flightDataLength(): number {
    return this._flightDataLength;
  }

  constructor() { }

  ngOnInit(): void {
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
    const offsetLeft = this.aircraftColWidth
    const dateDepRowElem = document.getElementsByClassName(`${dateBlock.trim()}`)[0] as HTMLElement
    const totalDepHoursPx = this.parseFlightTime(timeBlock) * pixelHr
    const point = dateDepRowElem.offsetLeft - offsetLeft + totalDepHoursPx
    return point
  }

    /**
   * Stablishes the position of the arrival text point. e.g RIX, PRG, etc.
   * @param string aircraftReg
   * @param number flightIndex - Flight Duration Index in array
   * @param boolean isLast - to check whether is the last item in the array
   * @param IFutureFlight flightData
   * @returns style Type
   * */
  setFlightPoints(aircraftReg : string, flightIndex: number, isLast: boolean, flightData?: IFutureFlight): NgStyle["ngStyle"] {
    const pixelHr = this.initColWidth / 24

    // Current flight Data
    const flightDurationEl = document.querySelector(`.flightdur_${aircraftReg}_${flightIndex}`) as HTMLElement

    if(flightIndex == 0){
      // Calculates position and width of the FIRST flight points RIX/PRG

      const departuretime = this.parseFlightTime(flightData.departureTime) * pixelHr
      const pointLeft = departuretime < 21?
        flightDurationEl.offsetLeft - departuretime - this.initColWidth: flightDurationEl.offsetLeft - departuretime

      const  pointWidth =  flightDurationEl.offsetLeft - pointLeft

      return { 'margin-left': `${pointLeft}px`, 'width': `${pointWidth}px`}
    }else if (isLast){
      // Calculates position and width of the LAST flight points RIX/PRG
      const pointleft = flightDurationEl.offsetLeft + flightDurationEl.offsetWidth
      const partialArea = this.parseFlightTime(flightData.arrivalTime) * pixelHr
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
 * Parse and converts to hours the string passed
 * @param string time
 * @returns number: time in hours
 * */
  parseFlightTime(time: string): number {
    let timeHr = parseInt(time.substring(0, 2))
    let timeMin = parseInt(time.slice(-2))
    return timeHr + (timeMin / 60)
  }


}
