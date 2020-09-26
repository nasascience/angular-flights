import { Injectable } from '@angular/core';
declare var $: any

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  constructor() { }

  showSuccess(message: string, secTime:number){
    let sec = secTime*1000
    $("#success-alert").text(message)
    $("#success-alert").fadeIn(400)
    setTimeout(()=>{
      $("#success-alert").fadeOut(400)
    },sec)
  }

  showDanger(message: string, secTime:number){
    let sec = secTime*1000
    $("#danger-alert").text(message)
    $("#danger-alert").fadeIn(400)
    setTimeout(()=>{
      $("#danger-alert").fadeOut(400)
    },sec)
  }
}
