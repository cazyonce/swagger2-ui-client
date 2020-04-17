import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentSynopsisComponent } from './document-synopsis.component';

describe('DocumentSynopsisComponent', () => {
  let component: DocumentSynopsisComponent;
  let fixture: ComponentFixture<DocumentSynopsisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentSynopsisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentSynopsisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
