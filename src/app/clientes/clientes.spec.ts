import { TestBed } from '@angular/core/testing';
import { Clientes } from './clientes';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Clientes],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(Clientes);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'oficina-frontend' title`, () => {
    const fixture = TestBed.createComponent(Clientes);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('oficina-frontend');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(Clientes);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, oficina-frontend');
  });
});
