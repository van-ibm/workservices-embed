import { Component , OnInit } from '@angular/core';

import { WatsonWorkService } from './watsonwork.service';

@Component({
    selector: 'workservices-app',
    providers: [WatsonWorkService],
    template: `
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">IBM Watson Work Services</a>
        </div>
      </div>
    </nav>
    <div class="row">
      <div class="col-sm-3 col-sm-offset-1">
          <spaces *ngIf="authenticated()" (selectedSpace) = "selectSpace($event)"></spaces>
      </div>
      <div class="col-sm-7">
          <messages *ngIf="selectedSpace" [space] = "selectedSpace"></messages>
      </div>
    </div>
    `
})

export class AppComponent implements OnInit {
  selectedSpace: any;


  constructor(private service: WatsonWorkService) { }

  ngOnInit(): void {
    this.service.authenticateAsApp(
      '<client>',
      '<secret>', (err: any, json: any) => {
        if(!err) {
          console.log("Connected to Watson Work Services");
        } else {
          console.log("Failed to connect to Watson Work Services");
        }
    });

  }

  selectSpace(space: any) {
    this.selectedSpace = space;
  }

  authenticated(): Boolean {
    return this.service.isAuthenticated();
  }
}
