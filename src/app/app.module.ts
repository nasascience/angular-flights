import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { FlightsMainComponent } from './components/flights-main/flights-main.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, FlightsMainComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
