export interface IFutureFlightData{
  aircraftReg: string
  data: IFutureFlight[]
}

export interface IFutureFlight{
  arrivalDate: string
	arrivalPoint: string
	arrivalTime: string
	departureDate: string
	departurePoint: string
	departureTime: string
	flightReference: string
	lastUpdate: Date
}
