import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'flightHourFriendly'
})
export class FlightHourFriendlyPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    let timeHr = value.substring(0,2)
    let timeMin = value.slice(-2)
    timeHr = timeHr.length == 1? "0"+timeHr: timeHr
    timeMin = timeMin.length == 1? "0"+timeMin: timeMin

    return `${timeHr}:${timeMin}`;
  }

}
