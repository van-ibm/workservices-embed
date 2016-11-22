import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule }   from '@angular/forms';

import { AppComponent }  from './app.component';
import { SpacesComponent }  from './spaces.component';
import { MessagesComponent }  from './messages.component';
import { AnnotationsComponent }  from './annotations.component';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule
  ],
  declarations: [
    AppComponent,
    SpacesComponent,
    MessagesComponent,
    AnnotationsComponent
  ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
