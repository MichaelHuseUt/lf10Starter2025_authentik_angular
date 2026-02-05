import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomQualificationSelectComponent } from './custom-qualification-select.component';

describe('CustomSelectComponent', () => {
  let component: CustomQualificationSelectComponent;
  let fixture: ComponentFixture<CustomQualificationSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomQualificationSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomQualificationSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
