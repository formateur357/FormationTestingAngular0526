import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CalculatorService {

  add(a: number, b: number): number {
    return a + b;
  }

  subtract(a: number, b: number): number {
    return a - b;
  }

  multiply(a: number, b: number): number {
    return a * b;
  }

  divide(a: number, b: number): number {
    if (b === 0) {
      throw new Error('Division par zéro impossible');
    }

    return a / b;
  }

  average(numbers: number[]): number {
    if (numbers.length === 0) {
      throw new Error('Tableau vide');
    }

    return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
  }

  isPrime(n: number): boolean {
    if (n < 2) {
      return false;
    }

    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) {
        return false;
      }
    }

    return true;
  }
}