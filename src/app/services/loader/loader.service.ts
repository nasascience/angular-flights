import { Injectable } from '@angular/core';
declare var $: any

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor() { }

  showLoader(){
    // const node = document.querySelector("#spinner") as HTMLElement;
    // node.style.display = 'block'
    //document.querySelector("#spinner").style.display = 'none'//$("#spinner").show()
    $("#spinner").show()
  }

  hideLoader(){
    // const node = document.querySelector("#spinner") as HTMLElement;
    // node.style.display = 'none'
    $("#spinner").hide()
  }
}
