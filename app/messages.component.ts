import { Component, Input, Output, EventEmitter , OnChanges} from '@angular/core';
import 'rxjs/add/operator/map';

import { WatsonWorkService } from './watsonwork.service';

@Component({
  selector: 'messages',
  template: `
    <div *ngFor="let message of messages">
      <div class="panel panel-default">
        <div class="panel-heading" (click)="showAnnotations(message)">
          <img width="32" class="img-circle"
          src="https://api.watsonwork.ibm.com/photos/{{message.createdBy.id}}">
          {{message.createdBy.displayName}}
          <small>{{message.created.substring(11, 19)}} on
            {{message.created.substring(0, 10)}}</small>
          <span class="label" *ngIf="message.sentiment != 'neutral'"
            [class.label-success]="message.sentiment == 'positive'"
            [class.label-danger]="message.sentiment == 'negative'">
            {{message.sentiment}}
          </span>
        </div>
        <div class="panel-body">
          {{message.content}}
        </div>
      </div>
      <annotations [message]="message"></annotations>
    </div>
    <ul class="pager">
      <li class="previous" (click)="loadMessages()"><a>&larr; Older</a></li>
    </ul>
  `
})

export class MessagesComponent implements OnChanges {
  // the space selected by user to retrieve messages
  @Input() space: any;

  @Output() selectedMessage = new EventEmitter<any>();

  messages: any[] = [];

  timestamp: number;

  constructor(private service: WatsonWorkService) {}

  ngOnChanges(changes: {[propKey: string]: any}) {
    this.messages = [];
    this.timestamp = new Date().getTime();
    this.loadMessages();
  }

  loadMessages() {
    let graphql = `query getSpace {
      space(id: "${this.space.id}") {
        conversation {
          messages(mostRecentTimestamp: ${this.timestamp}, first: 20) {
            items {
              id
              content
              created
              annotations
              createdBy {
                id
                displayName
                photoUrl
              }
            }
          }
        }
      }
    }`;

    this.service.query(graphql, (err: any, json: any) => {
      let messages = json.data.space.conversation.messages.items;

      for(var i in messages) {
        var message = messages[i];
        var tempAnnotations: any[] = [];

        message.sentiment = 'neutral';  // default

        if(message.hasOwnProperty('annotations')) {
          for(var j in message.annotations) {
            let annotation = JSON.parse(message.annotations[j]);
            tempAnnotations.push(annotation);

            // let's add custom metadata based on sentiment
            if(annotation.hasOwnProperty('docSentiment')) {
              message.sentiment = annotation.docSentiment.type;
            }
          }

          // overwrite the string array of annotations with a more usable
          // array of objects
          message.annotations = tempAnnotations;
        }

        this.messages.push(message);

        // record the last timestamp as a paging mechanism
        // decrement 1 millisecond to ensure we don't get a duplicate
        // entry in the next page
        this.timestamp = new Date(message.created).getTime()-1;
      }
      // this.messages = json.data.space.conversation.messages.items;
    });
  }

  showAnnotations(message: any) {
    // use jQuery to show the modal defined in the <annotations> Component
    (<any>$('#' + message.id + '-annotations')).modal('show');
  }

}
