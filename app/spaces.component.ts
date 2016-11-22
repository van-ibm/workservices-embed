import { Component, AfterContentInit, Output, EventEmitter} from '@angular/core';
import 'rxjs/add/operator/map';

import { WatsonWorkService } from './watsonwork.service';

@Component({
  selector: 'spaces',
  template: `
    <div class="list-group">
      <a href="#" class="list-group-item"
        *ngFor="let space of spaces"
        (click)="onSelect(space)">
        {{ space.title }}
      </a>
    </div>
    `
})

export class SpacesComponent implements AfterContentInit {
  @Output() selectedSpace = new EventEmitter<any>();

  spaces: any[] = [];

  graphql = `query getSpaces {
      spaces(first: 50) {
        items {
          id
          title
          description
          members {
            items {
              email
              displayName
            }
          }
        }
      }
    }`;

  constructor(private service: WatsonWorkService) {}

  /**
   * ngAfterContentInit is used to fetch the list of spaces; an *ngIf should
   * inhibit rendering of content until the WatsonWork.service is authenticated
   */
  ngAfterContentInit(): void {
    this.service.query(this.graphql, (err: any, json: any) => {
        this.spaces = json.data.spaces.items;
    });
  }

  onSelect(space: any): void {
    this.selectedSpace.emit(space);
  }

}
