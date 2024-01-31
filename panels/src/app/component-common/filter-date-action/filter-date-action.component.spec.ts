import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterDateActionComponent } from './filter-date-action.component';

describe('FilterDateActionComponent', () => {
  let component: FilterDateActionComponent;
  let fixture: ComponentFixture<FilterDateActionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilterDateActionComponent]
    });
    fixture = TestBed.createComponent(FilterDateActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
