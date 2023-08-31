export class Helpers {
  // Result is >= min and < max
  static randomInt(min: number, max: number): number {
    return min + Math.floor(Math.random() * max);
  }

  static isUpperCase(char: string): boolean {
    return /[A-Z]/g.test(char);
  }
}
