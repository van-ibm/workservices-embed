import { Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'annotations',
  template: `
  <div class="modal" *ngIf="annotations.length > 0"
    id="{{message.id}}-annotations">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal"
            aria-hidden="true">&times;</button>
          <h4 class="modal-title">Annotations</h4>
        </div>
        <div class="modal-body">
          <ul class="nav nav-pills nav-stacked">
            <li *ngFor="let annotation of annotations">
              <a aria-expanded="true" href="#{{annotation.annotationId}}" data-toggle="pill">
                {{annotation.type}}
              </a>
            </li>
          </ul>
          <div id="myTabContent" class="tab-content">
            <div class="tab-pane fade"
              *ngFor="let annotation of annotations"
              id="{{annotation.annotationId}}">
              <pre>{{annotation.prettified}}</pre>
            </div>
          </div>
      </div>
    </div>
  </div>
  `
})

export class AnnotationsComponent implements OnInit {
  @Input() message: any;

  annotations: any[] = [];

  ngOnInit(): void {
    if(this.message && this.message.hasOwnProperty('annotations')) {
      for(var i in this.message.annotations) {
        // add a prettified version of this as an additional property
        var annotation = this.message.annotations[i];
        annotation.prettified = JSON.stringify(annotation, null, 2);
      }

      this.annotations = this.message.annotations;
    }
  }
}
