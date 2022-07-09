export type DuetDatePickerDirection = 'left' | 'right';

export const keyCode = {
  TAB: 9,
  ESC: 27,
  SPACE: 32,
  PAGE_UP: 33,
  PAGE_DOWN: 34,
  END: 35,
  HOME: 36,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
};

export class SeperatorLocation {
  seperator: string;
  location: number;

  constructor(seperator: string, location: number) {
    this.seperator = seperator;
    this.location = location;
  }
}
