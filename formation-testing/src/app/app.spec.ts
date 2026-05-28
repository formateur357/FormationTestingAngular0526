import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, formation-testing');
  });
});


// Test Parametree avec jasmine, karma
const testCases = [
  { value: null, limit: 10, expected: '' },
  { value: 'Bonjour', limit: 10, expected: 'Bonjour' }
]

testCases.forEach(({value, limit, expected}) => {
  it(`should transform "${value}" with limit ${limit} into "${expected}"`, () => {
    //test
  })
})

// test parametree avec vittest
describe('TruncatePipe', () => {
  test.for([
    ['Bonjour', 10, 'Bonjour'],
    ['Bonjour tout le monde', 7, 'Bonjour...']
  ])('transform(%s, %i) should return %s', ([value, limit, expected]) => {
    const pipe = new TruncatePipe();

    expect(pipe.transform(value, limit)).toBe(expected);
  })
})