import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeerqrPage } from './leerqr.page';

describe('LeerqrPage', () => {
  let component: LeerqrPage;
  let fixture: ComponentFixture<LeerqrPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LeerqrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
