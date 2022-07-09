import { Injectable } from '@angular/core';

const ISO_DATE_FORMAT = /^(\d{4})-(\d{2})-(\d{2})$/;

export enum DaysOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

@Injectable({
  providedIn: 'root',
})
export class DateUtilitiesService {
  constructor() {}

  createDate(year: string, month: string, day: string): Date | undefined {
    var dayInt = parseInt(day, 10);
    var monthInt = parseInt(month, 10);
    var yearInt = parseInt(year, 10);

    const isValid =
      Number.isInteger(yearInt) && // all parts should be integers
      Number.isInteger(monthInt) &&
      Number.isInteger(dayInt) &&
      monthInt > 0 && // month must be 1-12
      monthInt <= 12 &&
      dayInt > 0 && // day must be 1-31
      dayInt <= 31 &&
      yearInt > 0;

    if (isValid) {
      return new Date(yearInt, monthInt - 1, dayInt);
    }

    return undefined;
  }

  /**
   * @param value date string in ISO format YYYY-MM-DD
   */
  parseISODate(value: string): Date | undefined {
    if (!value) {
      return undefined;
    }

    const matches = value.match(ISO_DATE_FORMAT);

    if (matches) {
      return this.createDate(matches[1], matches[2], matches[3]);
    }

    return undefined;
  }

  /**
   * print date in format YYYY-MM-DD
   * @param date
   */
  printISODate(date: Date): string {
    if (!date) {
      return '';
    }

    var d = date.getDate().toString(10);
    var m = (date.getMonth() + 1).toString(10);
    var y = date.getFullYear().toString(10);

    // days are not zero-indexed, so pad if less than 10
    if (date.getDate() < 10) {
      d = `0${d}`;
    }

    // months *are* zero-indexed, pad if less than 9!
    if (date.getMonth() < 9) {
      m = `0${m}`;
    }

    return `${y}-${m}-${d}`;
  }

  /**
   * Compare if two dates are equal in terms of day, month, and year
   */
  isEqual(a?: Date, b?: Date): boolean {
    if (a == null || b == null) {
      return false;
    }

    return this.isEqualMonth(a, b) && a.getDate() === b.getDate();
  }

  /**
   * Compare if two dates are in the same month of the same year.
   */
  isEqualMonth(a: Date, b: Date): boolean {
    if (a == null || b == null) {
      return false;
    }

    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
  }

  addDays(date: Date, days: number): Date {
    var d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }

  addMonths(date: Date, months: number): Date {
    const d = new Date(date);
    d.setMonth(date.getMonth() + months);
    return d;
  }

  addYears(date: Date, years: number): Date {
    const d = new Date(date);
    d.setFullYear(date.getFullYear() + years);
    return d;
  }

  startOfWeek(
    date: Date,
    firstDayOfWeek: DaysOfWeek = DaysOfWeek.Monday
  ): Date {
    var d = new Date(date);
    var day = d.getDay();
    var diff = (day < firstDayOfWeek ? 7 : 0) + day - firstDayOfWeek;

    d.setDate(d.getDate() - diff - 1);
    return d;
  }

  endOfWeek(date: Date, firstDayOfWeek: DaysOfWeek = DaysOfWeek.Monday): Date {
    var d = new Date(date);
    var day = d.getDay();
    var diff = (day < firstDayOfWeek ? -7 : 0) + 6 - (day - firstDayOfWeek);

    d.setDate(d.getDate() + diff);
    return d;
  }

  startOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  endOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  setMonth(date: Date, month: number): Date {
    const d = new Date(date);
    d.setMonth(month);
    return d;
  }

  setYear(date: Date, year: number): Date {
    const d = new Date(date);
    d.setFullYear(year);
    return d;
  }

  /**
   * Check if date is within a min and max
   */
  inRange(date: Date, min?: Date, max?: Date): boolean {
    let inRange = this.clamp(date, min, max) === date;
    return inRange;
  }

  /**
   * Ensures date is within range, returns min or max if out of bounds
   */
  clamp(date: Date, min?: Date, max?: Date): Date {
    const time = date.getTime();

    if (min && min instanceof Date && time < min.getTime()) {
      return min;
    }

    if (max && max instanceof Date && time > max.getTime()) {
      return max;
    }

    return date;
  }

  /**
   * given start and end date, return an (inclusive) array of all dates in between
   * @param start
   * @param end
   */
  getDaysInRange(start: Date, end: Date): Date[] {
    const days: Date[] = [];
    let current = start;

    while (!this.isEqual(current, end)) {
      days.push(current);
      current = this.addDays(current, 1);
    }

    days.push(current);

    return days;
  }

  /**
   * given a date, return an array of dates from a calendar perspective
   * @param date
   * @param firstDayOfWeek
   */
  getViewOfMonth(
    date: Date,
    firstDayOfWeek: DaysOfWeek = DaysOfWeek.Monday
  ): Date[] {
    const start = this.startOfWeek(this.startOfMonth(date), firstDayOfWeek);
    const end = this.endOfWeek(this.endOfMonth(date), firstDayOfWeek);

    return this.getDaysInRange(start, end);
  }

  /**
   * Form random hash
   */
  chr4() {
    return Math.random().toString(16).slice(-4);
  }

  /**
   * Create random identifier with a prefix
   * @param prefix
   */
  createIdentifier(prefix: string) {
    return `${prefix}-${this.chr4()}${this.chr4()}-${this.chr4()}-${this.chr4()}-${this.chr4()}-${this.chr4()}${this.chr4()}${this.chr4()}`;
  }
}
