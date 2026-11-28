
/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {

  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;

  // =========================================
  // TEST SETUP
  // =========================================

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  });

  // =========================================
  // APPLICATION INITIALIZATION
  // =========================================

  it('should create the Eventopia application', () => {
    expect(app).toBeTruthy();
  });

  // =========================================
  // APPLICATION TITLE
  // =========================================

  it('should have the correct Eventopia title', () => {
    expect(app.title).toEqual('Eventopia');
  });

  // =========================================
  // APPLICATION BRANDING
  // =========================================

  it('should render the Eventopia branding', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Eventopia');
  });

});
