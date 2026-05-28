import { TestBed } from '@angular/core/testing';
import { CalculatorService } from './calculator.service';

describe('CalculatorService', () => {
  let service: CalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

    describe('add()', () => {
    it('should add two positive numbers', () => {
        expect(service.add(2, 3)).toBe(5);
    });

    it('should add negative numbers', () => {
        expect(service.add(-2, -3)).toBe(-5);
    });

    it('should return a number', () => {
        const result = service.add(1, 2);

        expect(typeof result).toBe('number');
    });

    it('should return a positive result', () => {
        expect(service.add(1, 2)).toBeGreaterThan(0);
    });
    });

  describe('subtract()', () => {
    it('should subtract two numbers', () => {
      expect(service.subtract(10, 4)).toBe(6);
    });
  });

  describe('multiply()', () => {
    it('should multiply two numbers', () => {
      expect(service.multiply(3, 4)).toBe(12);
    });
  });

  describe('divide()', () => {
    it('should divide correctly', () => {
      expect(service.divide(10, 2)).toBe(5);
    });

    it('should handle decimal results', () => {
      expect(service.divide(1, 3)).toBeCloseTo(0.333, 3);
    });

    it('should throw when dividing by zero', () => {
      expect(() => service.divide(10, 0))
        .toThrowError('Division par zéro impossible');
    });
  });

  describe('average()', () => {
    it('should calculate average of numbers', () => {
      expect(service.average([1, 2, 3, 4, 5])).toBe(3);
    });

    it('should throw on empty array', () => {
      expect(() => service.average([])).toThrowError('Tableau vide');
    });
  });

    describe('isPrime()', () => {
    it('should return true for prime numbers', () => {
        const primeNumbers = [2, 3, 5, 7, 11, 13];

        primeNumbers.forEach(number => {
        expect(service.isPrime(number)).toBe(true);
        });
    });

    it('should return false for non-prime numbers', () => {
        const nonPrimeNumbers = [0, 1, 4, 6, 8, 9];

        nonPrimeNumbers.forEach(number => {
        expect(service.isPrime(number)).toBe(false);
        });
    });
    });
})