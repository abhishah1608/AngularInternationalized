import { Injectable, OnInit } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class GlobalService {
  baseurlservice: string;

  translatorfilepath: string;

  language: string;

  paymenturl: string;

  // token: string;

  constructor() {
    this.baseurlservice = "https://bookstoreserviceapi.azurewebsites.net/api/";
    // api for url service.
    // url for Web Api developed in Asp.net Web Api.
    // this.baseurlservice = 'https://demoangularapp.gear.host/api/';

    this.language = "en";

    // this.translatorfilepath = '../../' + this.language + '/assets/translatorfiles/';
    this.translatorfilepath =
      "https://abhishah1608.github.io/AngularInternationalized/assets/translatorfiles/";

    //this.paymenturl = ("https://abhishah1608.github.io/AngularInternationalized/");
    this.paymenturl = "http://localhost:4200/";
  }
}
