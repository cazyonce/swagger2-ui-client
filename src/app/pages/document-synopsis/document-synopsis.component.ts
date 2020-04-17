import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-document-synopsis',
  templateUrl: './document-synopsis.component.html',
  styleUrls: ['./document-synopsis.component.css']
})
export class DocumentSynopsisComponent implements OnInit {

  @Input() info: { version: string, title: string, description: string };

  constructor() { }

  ngOnInit() {
  }

}
