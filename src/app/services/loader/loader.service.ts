import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor() { }

  showLoader(){
     const node = document.querySelector("#spinner") as HTMLElement;
     node.style.display = 'block'
  }

  hideLoader(){
     const node = document.querySelector("#spinner") as HTMLElement;
     node.style.display = 'none'
  }
}
