# Overthrow #

A tiny, no-frills, framework-independent, targeted `overflow: auto` polyfill for use in responsive design.

- **Overthrow Site & Documentation:** [http://overthrow.filamentgroup.github.com](http://overthrow.filamentgroup.github.com)
- **Filament Group Release Notes:** [Overthrow: An overflow: auto polyfill for responsive design](http://filamentgroup.com/lab/overthrow)

License: [Open-source, Dual MIT/BSD license](https://filamentgroup.github.com/overthrow/license.txt)

Copyright 2012: Scott Jehl, Filament Group, Inc. 

See the project site for detailed documentation.

## Project Goals

The goals of Overthrow are simple: create a reliable way to safely use CSS overflow in responsive designs, polyfilling support in non-native environments where possible. As such, the scope is very tight, and we're mostly looking for contributions to make it do what it already does better, rather than add more features. That said, we are interested in exposing hooks and events to make it easy to extend so that Overthrow could be used for more custom behavior, like snapping to regions. If you have ideas for improvements, please send a pull request!


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
        height: 280px;
    }

## Tests

Unit tests use QUnit and can be run from the /test/ directory.