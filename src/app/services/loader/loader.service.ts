import { Injectable } from '@angular/core';
declare var $: any

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor() { }

  showLoader(){
    $("#spinner").show()
  }

  hideLoader(){
    $("#spinner").hide()
  }
}
