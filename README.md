# Bugable

Bugable is a small screenshot & user feedback component. It replicates the basic functionality of a tool like <a href="https://userback.io">UserBack</a> or <a href="https://usersnap.com">UserSnap</a>. It also adds a few nice things not found in those tools.

##### Screenshots

<p float="left">
  <img src="https://joduplessis.com/store-images/Bugable/01.png" width="15%">
  <img src="https://joduplessis.com/store-images/Bugable/02.png" width="15%">
  <img src="https://joduplessis.com/store-images/Bugable/03.png" width="15%">
  <img src="https://joduplessis.com/store-images/Bugable/04.png" width="15%">
  <img src="https://joduplessis.com/store-images/Bugable/05.png" width="15%">
  <img src="https://joduplessis.com/store-images/Bugable/06.png" width="15%">
  <img src="https://joduplessis.com/store-images/Bugable/07.png" width="15%">
  <img src="https://joduplessis.com/store-images/Bugable/08.png" width="15%">
</p>

#### Some of the features it supports are:

- Optional "give feedback" button
- Custom triggering of the widget
- Console log capturing
- rrweb integration for recording sessions 🔥 
- Context mode (mini popup)
- Dark mode
- HTML & SVG image creation
- Flexible actions (clickable sections)
- Basic form building
- Custom rating component
- Video/audio/webcam recordings
- SVG markup tool
- Audio snippets when creating a mockup

#### Caveats

This was an experiment to see how hard it would be to replicate some of the functionality from the platforms above. So deployments are tricky, unfortunately. At the moment the flow is:

1. JS snippet on `index.html` page mounts the launcher widget & styles
2. Launcher widget sets up the tool and/or buttons
3. Mockups are created by mounting the screenshot app into an iframe on top of the launcher app
4. Logging & rrweb runs in the background on mount
5. Everything else is handled by the launcher app in a straightforward way
6. API calls are stubbed

For information on widget settings, see the `launcher/src/index.js` & `launcher/src/index.html` files.

For any questions, please feel free to open an issue (I will add more/better docs as soon as I can).
