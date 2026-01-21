import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualificationOverviewComponent } from './qualification-overview.component';

describe('QualificationOverviewComponent', () => {
  let component: QualificationOverviewComponent;
  let fixture: ComponentFixture<QualificationOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QualificationOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QualificationOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
