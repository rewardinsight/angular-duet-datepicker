# Angular Duet Datepicker

This library is a port of the Duet Date Picker library to Angular.

https://github.com/duetds/date-picker


## Why does this exist?

We found that while Angular integration is possible with the original Duet Datepicker, it was a bit messy, especially when we wanted to make any customisations or quality of life improvements. Our solution was to migrate the Datepicker to Angular, and make our QOL improvements that way.

## What is Duet Date Picker?

Duet Date Picker is an open source version of Duet Design System’s [accessible date picker](https://www.duetds.com/components/date-picker/).

Duet Date Picker comes with built-in functionality that allows you to set a minimum and a maximum allowed date. These settings can be combined or used alone, depending on the need. Please note that the date values must be passed in IS0-8601 format: `YYYY-MM-DD`.

## Getting started

Adding this Datepicker to your angular app is simple:

* Run `npm i @reward-insight/angular-duet-datepicker`
* Add the following import to your module:

      import { NgModule } from '@angular/core';
      import { BrowserModule } from '@angular/platform-browser';
      import { AngularDuetDatepickerModule } from '@reward-insight/angular-duet-datepicker'; // Angular Datepicker Import

      import { AppComponent } from './app.component';

      @NgModule({
      declarations: [
          AppComponent
      ],
      imports: [
          BrowserModule,
          AngularDuetDatepickerModule //Module Import
      ],
      providers: [],
      bootstrap: [AppComponent]
      })
      export class AppModule { }

* Use the component:

      <rwd-angular-duet-datepicker></rwd-angular-duet-datepicker>

## Features

- No external dependencies.
- Weighs only ~10kb minified and Gzip’ed (this includes all styles and icons).
- Built with accessibility in mind.
- Supports all modern browsers and screen readers.
- Additionally, limited support offered for IE11 and Edge 17+.
- Allows theming using CSS Custom Properties.
- Support for localization.
- Customizable date parsing and formatting.
- Support for changing the first day of the week.
- Comes with modified interface for mobile devices to provide better user experience.
- Supports touch gestures for changing months and closing the picker.
- Free to use under the MIT license.

## Browser support

- Google Chrome 61+
- Apple Safari 10+
- Firefox 63+
- Microsoft Edge 17+
- Opera 63+
- Samsung Browser 8.2+
- Internet Explorer 11

## Screen Reader support

We offer support for the following screen readers. For more information about the level of support and possible issues with the implementation, please refer to the included [accessibility audit](https://github.com/duetds/date-picker/blob/master/accessibility-audit.pdf).

- VoiceOver on macOS and iOS
- TalkBack on Android
- NVDA on Windows
- Jaws on Windows

## Keyboard support

Duet Date Picker’s keyboard support is built to closely follow [W3C Date Picker Dialog example](https://www.w3.org/TR/wai-aria-practices/examples/dialog-modal/datepicker-dialog.html) with some small exceptions to e.g. better support iOS VoiceOver and Android TalkBack.

### Choose date button

- `Space, Enter`: Opens the date picker dialog and moves focus to the first select menu in the dialog.

### Date picker dialog

- `Esc`: Closes the date picker dialog and moves focus back to the “choose date” button.
- `Tab`: Moves focus to the next element in the dialog. Please note since the calendar uses `role="grid"`, only one button in the calendar grid is in the tab sequence. Additionally, if focus is on the last focusable element, focus is next moved back to the first focusable element inside the date picker dialog.
- `Shift + Tab`: Same as above, but in reverse order.

### Date picker dialog: Month/year buttons

- `Space, Enter`: Changes the month and/or year displayed.

### Date picker dialog: Date grid

- `Space, Enter`: Selects a date, closes the dialog, and moves focus back to the “Choose Date” button. Additionally updates the value of the Duet Date Picker input with the selected date, and adds selected date to “Choose Date” button label.
- `Arrow up`: Moves focus to the same day of the previous week.
- `Arrow down`: Moves focus to the same day of the next week.
- `Arrow right`: Moves focus to the next day.
- `Arrow left`: Moves focus to the previous day.
- `Home`: Moves focus to the first day (e.g Monday) of the current week.
- `End`: Moves focus to the last day (e.g. Sunday) of the current week.
- `Page Up`: Changes the grid of dates to the previous month and sets focus on the same day of the same week.
- `Shift + Page Up`: Changes the grid of dates to the previous year and sets focus on the same day of the same week.
- `Page Down`: Changes the grid of dates to the next month and sets focus on the same day of the same week.
- `Shift + Page Down`: Changes the grid of dates to the next year and sets focus on the same day of the same week.

### Date picker dialog: Close button

- `Space, Enter`:  Closes the dialog, moves focus to “choose date” button, but does not update the date in input.

# Publishing

* Publish with the following command -> `npm publish --access public`

# Work at Reward!

We are hiring, see our open positions here -> https://www.rewardinsight.com/careers/
