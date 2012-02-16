# Overthrow #

A tiny, no-frills, framework-independent, targeted `overflow: auto` polyfill for use in responsive design.

- **Overthrow Site & Documentation:** [http://overthrow.filamentgroup.github.com](http://overthrow.filamentgroup.github.com)
- **Filament Group Release Notes:** [Overthrow: An overflow: auto polyfill for responsive design](http://filamentgroup.com/lab/overthrow)

License: Open-source, Dual MIT/GPLv2 license

Copyright 2012: Scott Jehl, Filament Group, Inc. 

See the project site for detailed documentation.

## Basic use

First, download and reference overthrow.js from your document. Anywhere's fine.

    <script src="overthrow.js"></script>

Then put a class of `overthrow` on any elements in which you'd like to apply `overflow: auto` or `scroll` CSS.

	<div id="foo" class="overthrow">Content goes here!</div>

In browsers that Overthrow deems capable of scrolling overflow content (_either natively, or using its touch polyfill_), it will add a class of `overflow` to the `html` element. Add the following CSS to your stylesheet somewhere, enabling overflow on all elements in your document that have an `overthrow` class.

    /* Overthrow CSS:
	   Enable overflow: auto on elements with overthrow class when html element has overthrow class too */
    .overthrow .overthrow {
        overflow: auto;
        -webkit-overflow-scrolling: touch;
    }

That's it. Design away! Any time you want to set dimensions on an element to use overflow scrolling, just be sure to key off that `overthrow` class on the HTML element, and `overflow: auto` will apply.

    .overthrow #foo.overthrow {
        height: 280px;
    }