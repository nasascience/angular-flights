import { Component, Input } from '@angular/core';

@Component({
  selector: 'flights-main',
  templateUrl: './flights-main.component.html',
  styleUrls: ['./flights-main.component.css']
})
export class FlightsMainComponent  {
  @Input() name: string;
}
