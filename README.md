<div align="center" style="margin-bottom: 40px;">
<h1>Just Another Calendar</h1>
<p style="font-size: 1.2rem;">Simply a dynamic web calendar made primarily for FileMaker Pro.</p>

<a href="https://codeo.no" target="_blank">
<img src="./codeo-logo.png" width="160" height="160" />
</a>

<p><strong>&copy; Codeo Norge AS</strong></p>
<p>This module requires <a href="https://www.claris.com/filemaker" target="_blank">FileMaker Pro</a> version 19.0 or later</p>

\<\-\-\- [Contact Us](#contact) \-\-\-\>
</div>

---

## Documentation
### Disclaimer
Function examples will be written in JavaScript, using `JSON.stringify`. However, these should be called from FileMaker using the `[Perform JavaScript In Web Viewer]` script step.

It is recommended to check the [`_filter`](./documentation/_filter.md) definition
before continuing, as this is used in multiple areas of the calendar.

---

<!-- [JSONLY START] -->
For JavaScript developers:
- [Installation](./documentation/for-javascript-developers/installation.md)
- [Building the module](./documentation/for-javascript-developers/building.md)
- [TypeScript](./documentation/for-javascript-developers/typescript.md)

For FileMaker Pro developers:
<!-- [JSONLY END] -->
- [Uploading to FileMaker](./documentation/uploading-to-filemaker.md)
- [Initialising the Web Viewer](./documentation/web-viewer.md)
- [Callable Functions from FileMaker](./documentation/functions.md)

- [Event definition](./documentation/events.md)
- [Event components](./documentation/event-components.md)
- [Event buttons](./documentation/event-buttons.md)
- [Event templates](./documentation/event-templates.md)

## Contact
You may contact our team for consulting regarding this module.

- Company: Codeo Norge AS
- Email: jac@codeo.no
- Developers:
    - Andreas Haandlykken: ah@codeo.no - CEO of [Codeo Norway](https://codeo.no) and Senior FileMaker developer
    - Joakim Isaksen: ji@codeo.no React developer - Head developer of [www.codeo.no](https://codeo.no)
    - Vetle Emanuel Lindbråten: vel@codeo.no - React developer

## About

### Technical specifications
- Web framework: [React.js](https://react.dev)
- Key libraries:
    - [FullCalendar](https://fullcalendar.io)
    - [Parcel](https://parceljs.org)

### History
This module was initially created to replace an outdated calendar in Codeo's ERP-system [NOBS](https://codeo.no/vi-jobber-med/nobs), but was later modified to be generic, to make it reusable by other applications.

The concept for this module was developed during one of our developers apprenticeships, resulting in a highly modern and efficient web component.