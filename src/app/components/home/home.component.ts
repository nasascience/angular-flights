import { Component, OnInit } from '@angular/core';
import { IFutureFlight } from '../../interfaces/future-flight'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  aircrafts: string[] = ['A-PLN1', 'A-PLN2', 'A-PLN3', 'A-PLN4']

  constructor() { }

  ngOnInit(): void {

  }

  filterAircraft(ircraft: string){

  }

}
