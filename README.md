# Overthrow #

[![Build Status](https://travis-ci.org/filamentgroup/Overthrow.png?branch=master)](https://travis-ci.org/filamentgroup/Overthrow)

A framework-independent, `overflow: auto` polyfill for use in responsive design.

- **Filament Group Release Notes:** [Overthrow: An overflow: auto polyfill for responsive design](http://filamentgroup.com/lab/overthrow)

License: [Open-source MIT license](http://filamentgroup.github.com/Overthrow/license.txt)

Copyright 2013: Scott Jehl, Filament Group, Inc.

See the project site for detailed documentation.

## Project Goals

The goals of Overthrow are simple: create a reliable way to safely use CSS overflow in responsive designs, polyfilling support in non-native environments where possible, and if not, letting things scroll with the rest of the page).

## Features

- Lightweight, decoupled JavaScript
- MIT license: use it wherever you want.
- Designed for responsive design: safe for use in cross-device development
- Framework-independent: use with any JS library, or none at all!
- Native scrollTop and scrollLeft: Rather than simulating scrolling with CSS properties, the native JavaScript <code>scrollTop</code> and <code>scrollLeft</code> properties are used. This means any you can use any standard web conventions for scrolling an overthrow element, such as <code>#fragment</code> anchor links, and so on.


## Download

You can grab the latest of the core and extensions on the [releases pages](https://github.com/filamentgroup/Overthrow/releases), or see how to do a custom build below.

## Demos

- [Scrolling layout](http://filamentgroup.github.io/Overthrow/)
- [2-Column scrolling layout](http://filamentgroup.github.io/Overthrow/examples/2-column/)
- [Scrolling fake dialog contents](http://filamentgroup.github.io/Overthrow/examples/dialog/)

## Basic use

First, download and reference overthrow.js from your document. Anywhere's fine.

    <script src="overthrow.js"></script>

Then put a class of `overthrow` on any elements in which you'd like to apply `overflow: auto` or `scroll` CSS.

	<div id="foo" class="overthrow">Content goes here!</div>

In browsers that Overthrow deems capable of scrolling overflow content (_either natively, or using its touch polyfill_), it will add a class of `overthrow-enabled` to the `html` element. Add the following CSS to your stylesheet somewhere, enabling overflow on all elements in your document that have an `overthrow` class.

    /* Overthrow CSS:
	   Enable overflow: auto on elements with overthrow class when html element has overthrow class too */
    .overthrow-enabled .overthrow {
        overflow: auto;
        -webkit-overflow-scrolling: touch;
    }

That's it. Design away! Any time you want to set dimensions on an element to use overflow scrolling, just be sure to key off that `overthrow` class on the HTML element, and `overflow: auto` will apply.

    .overthrow-enabled #foo {
        height: 28em;
    }


## Properties

Overthrow exposes various properties you can access via the `overthrow` object:

- `overthrow.support`: returns a string of "native", "polyfilled", or "none" depending on the type of overflow in play.

Many `overthrow` settings are exposed and configurable via the `overthrow` object. If needed, you can redefine these before calling `set()`.

- `overthrow.enabledClassName`: The class name added to the `html` element in supported browsers. Default is `overthrow-enabled`
- `overthrow.scrollIndicatorClassName`: The class name used to identify scrollable `overthrow` elements. Default is `overthrow`

## Methods

Overthrow exposes various methods you can use via the `overthrow` object:

- `overthrow.set()`: run the overflow detection and add an `overthrow-enabled` class to the `html` element in browsers that natively support overflow. If the `overthrow-polyfill.js` is included, `set()` will also polyfill overflow behavior in touch-event supporting browsers that do not natively support it, such as iOS4 and Android 2.3. The default overthrow.js built file runs this automatically.
- `overthrow.forget()`: This removes the `overthrow-enabled` class from the `html` element and unbinds touch event handlers in polyfilled browsers.
- `overthrow.toss()`: This method scrolls to a x,y location in an overflow element. Its first argument is required reference to the element to be scrolled. The second argument is an options object.

For example:
``` javascript
overthrow.toss(
    document.getElementById( "foo" ),
    {
        top: 150,
        left: "+30",
        duration: 80,
        easing: function (t, b, c, d) {
            return c*((t=t/d-1)*t*t + 1) + b;
        };
    }
);
````

- `overthrow.intercept()`: Stops any `toss` currently animating.

## Source files

Overthrow's `src` directory includes several files:

- overthrow-detect.js: a script that defines the `overthrow` global object and the `overthrow.set` and `overthrow.forget` methods. When `set` is called, it will add a `overthrow-enabled` class to the `html` element in browsers that natively support overflow.
- overthrow-polyfill.js: a script that extends the `overthrow.set` method so that it polyfills overflow behavior in touch-event supporting browsers that do not natively support it.
- overthrow-toss.js: a script that adds the `overthrow.toss` and `overthrow.intercept` methods.
- overthrow-init.js: a script that simply calls the `overthrow.set` method when it loads. This script can safely execute before domready.

All above files depend upon `overthrow-detect.js` but are otherwise independent of one another and can be used that way.

## Creating a custom build

You can grab any of the above files manually from this repo, but to create a custom build of any of the above files, you'll need [grunt.js](http://gruntjs.com/). Once installed, you can check out this project's `gruntfile.js` file to see various pre-configured build options that are available when you run `grunt`.

### Extension files

Overthrow's `extensions` directory incudes several behavioral extensions you might find useful.

- anchorscroll.overthrow.js: a script that will cause any links with a class of `throw` that point to in-page content (`href` starting with a `#`) to scroll with easing, via the `toss` method. Just include it in the page and it'll work.
- overthrow-sidescroller.js: a script that adds carousel-like behavior such as arrows and keyboard handling to a horizontally-scrolling overthrow area.

These both depend on `overthrow-detect.js`, `overthrow-toss.js`, and `overthrow-init.js`.


#### Sidescroller

##### [Simple sidescroller with momentum scrolling](http://filamentgroup.github.io/Overthrow/examples/sidescroller/)

The sidescroller extension (not included by default) makes a horizontal carousel-like component of an overflow area. This provides you with carousel-like functionality, built on a system of tiered fallbacks. The Sidescroller area’s child elements can be fixed-width

<ul>
    <li>
        <h5><a href="http://filamentgroup.github.io/Overthrow/examples/sidescroller/fixed-width.html">Fixed width styling</a></h5>
    </li>
    <li>
        <h5><a href="http://filamentgroup.github.io/Overthrow/examples/sidescroller/variable.html">Variable width styling</a></h5>
    </li>
</ul>

#### Sidescroller README

See the [README](extensions/README.md).

We’ve produced a number of self-contained extensions that add to or alter the basic Sidescroller functionality:

<ul>
    <li>
        <h5><a href="http://filamentgroup.github.io/Overthrow/examples/sidescroller/snap.html">Snap extension</a></h5>
        The `snap` extension ensures that the Sidescroller’s child elements are always aligned flush with the Overthrow container when scrolling ends.
    </li>
    <li>
        <h5><a href="http://filamentgroup.github.io/Overthrow/examples/sidescroller/hiddenscrollbar.html">Hidden scrollbar</a></h5>
        A small snippet of CSS that hides the Sidescroller’s sidebar, giving it a carousel-like appearance.
    </li>
    <li>
        <h5><a href="http://filamentgroup.github.io/Overthrow/examples/sidescroller/goto.html">Goto extension</a></h5>
        The `goto` extension provides a method for programmatically scrolling to individual child elements.
    </li>
    <li>
        <h5><a href="http://filamentgroup.github.io/Overthrow/examples/sidescroller/append.html">Append extension</a></h5>
        The `append` extension provides a method for gracefully handling the addition of child elements.
    </li>
     <li>
        <h5><a href="http://filamentgroup.github.io/Overthrow/examples/sidescroller/skiplinks.html">Skiplink extension</a></h5>
        The `skiplink` extension adds controls that allow the user to skip to the start/end of Sidescroller.
    </li>
</ul>

By default, the Sidescroller controls will do nothing at the start/end of navigation. There are two methods for changing this behavior:

<ul>
    <li>
        <a href="http://filamentgroup.github.io/Overthrow/examples/sidescroller/disabled-nav.html">Disable nav extension</a>
        Will add a `disabled` class to nav items upon reaching the start/end of a Sidescroller region.
    </li>
    <li>
        <a href="http://filamentgroup.github.io/Overthrow/examples/sidescroller/rewind.html">Rewind extension</a>
        The `rewind` extension will allow the Sidescroller to animate back to the first child element upon navigating beyond the last element.
    </li>
</ul>

A more extensive list of demos is available in the Sidescroller README.

#### Functional tests
<ul>
    <li>
        <a href="http://filamentgroup.github.io/Overthrow/test/functional/sidescroller/two-test.html">Two basic sidescrollers</a>
        Two simple Sidescroller elements on a single page, ensuring that there are no conflicts or overlaps in the logic between the two.
    </li>
    <li>
        <a href="http://filamentgroup.github.io/Overthrow/test/functional/sidescroller/kitchensink.html">Kitchen sink</a>
        All of the above Sidescroller demos on a single page.
    </li>
</ul>

## Browser Support

Overthrow's goal is to create an accessible experience in every browser, and if possible, an enhanced experience in modern browsers. As such, Overthrow has 3 potential support situations: native, polyfilled, or none (which simply means the content is left uncropped and tall/wide). Here's where some popular browsers land on that spectrum:

<table id="support">
    <thead><tr><th>User Agent</th><th>Result</th></tr></thead>
    <tbody>
        <tr><td>IE 10 (touch and desktop)</td><td><span class="native">native</span></td></tr>
        <tr><td>Chrome (desktop)</td><td><span class="native">native</span></td></tr>
        <tr><td>Firefox (desktop)</td><td><span class="native">native</span></td></tr>
        <tr><td>Internet Explorer (desktop)</td><td><span class="native">native</span></td></tr>
        <tr><td>Opera (desktop)</td><td><span class="native">native</span></td></tr>
        <tr><td>Safari (desktop)</td><td><span class="native">native</span></td></tr>
        <tr><td>Any browser on screen > 1200px wide w/ no touch support</td><td><span class="native">native</span></td></tr>

        <tr><td>Mobile Safari on iOS5: iPhone, iPod, iPad</td><td><span class="native">native</span></td></tr>
        <tr><td>Chrome on Android</td><td><span class="native">native</span></td></tr>
        <tr><td>Webkit on Android 3.0+</td><td><span class="native">native</span></td></tr>
        <tr><td>Nokia N8 WebKit</td><td><span class="native">native</span></td></tr>
        <tr><td>BlackBerry 7 WebKit</td><td><span class="native">native</span></td></tr>
        <tr><td>BlackBerry PlayBook Webkit</td><td><span class="native">native</span></td></tr>
        <tr><td>Firefox Mobile (Fennec) 4+</td><td><span class="native">native</span></td></tr>

        <tr><td>Mobile Safari on iOS4 and older: iPhone, iPod, iPad</td><td><span class="polyfilled">polyfilled</span></td></tr>
        <tr><td>Android 2.3 and under, WebKit</td><td><span class="polyfilled">polyfilled</span></td></tr>
        <tr><td>Amazon Kindle Fire</td><td><span class="polyfilled">polyfilled</span></td></tr>
        <tr><td>Nokia N9, WebKit</td><td><span class="polyfilled">polyfilled</span></td></tr>
        <tr><td>BlackBerry 6, WebKit</td><td><span class="polyfilled">polyfilled</span></td></tr>

        <tr><td>Opera Mini</td><td><span class="none">none</span></td></tr>
        <tr><td>Opera Mobile</td><td><span class="none">none</span></td></tr>
        <tr><td>Windows Phone 7 and 7.5</td><td><span class="none">none</span></td></tr>
        <tr><td>BlackBerry 5 and under</td><td><span class="none">none</span></td></tr>
        <tr><td>Nokia Devices without touch event support</td><td><span class="none">none</span></td></tr>
        <tr><td>Any non-touch supporting device</td><td><span class="none">none</span></td></tr>
    </tbody>
</table>


## Issues

For known issues with Overthrow, or to file a new one, please visit the [issue tracker](http://github.com/filamentgroup/Overthrow/issues)


## Tests

Unit tests use QUnit and can be run from the /test/ directory.
