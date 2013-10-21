# Extensions

Primarily the `overthrow-sidescroller` and attendant plug ins.

## Sidescroller

The sidescroller is a demo extension included in this repo. Setting up the sidescroller requires a basic markup structure and some CSS.

### Sidescroller HTML

The contents of your overflow container should be a list of `li` elements. These can contain anything you want.

``` html
<div class="overthrow">
    <ul>
        <li><img src="img/angkor.jpg"></li>
        <li><img src="img/monkey.jpg"></li>
        <li><img src="img/monks.jpg"></li>
    </ul>
</div>
```


The arrows that the script will inject need to be outside of the overflow element, so you'll need to wrap your overflow container in another element. How about a `div` with a class of `sidescroll-nextprev`?

``` html
<div class="sidescroll-nextprev">
    <div class="overthrow sidescroll">
            <ul>
                <li><img src="img/angkor.jpg"></li>
                <li><img src="img/monkey.jpg"></li>
                <li><img src="img/monks.jpg"></li>
            </ul>
    </div>
</div>
```

### Sidescroller JavaScript

Now you can use the JavaScript part. There's a handy build of overthrow plus the sidescroller in the `dist` folder. Download it, toss it in your page.

To use it,  call `overthrow.sidescroller( <DOM COLLECTION HERE> );` when the DOM is ready. Like this:

``` javascript
overthrow.sidescroller(
  document.querySelectorAll( ".overthrow-enabled .sidescroll-nextprev" )
);
```

That call will inject the next/prev links and keyboard handling into the selected overthrow containers. There are options as well:

```javascript
// NOTE: defaults show below
overthrow.sidescroller( document.querySelectorAll(".sidescroll"), {
	rewind: false,
	snapScroll: false,
	snapTolerance: 30,
	fixedItemWidth: false,
	easing: function( currentIter, initialVal, distance, totalIter ) { /* ... */ }
});
```

Setting `rewind` to `true` will cause the scroller to snap back to the first element when advancing forward on the last element and vice verse.

Setting `snapscroll` to `true` will align the left most element to the left border of the scroller when the region has scrolled to a position in between. Note: if you are using `snapscroll`, we recommend not using `-webkit-overflow-scrolling` or `-ms-overflow-style` in your CSS.

Setting `snapTolerance` to a larger value will increase how far the region must scroll before it is snapped into place again.

Setting `fixedItemWidth` to `true` allows the user to set the item width within the scrollable region. When the window re-sizes elements will be hidden instead of re-sized.

Providing an `easing` callback allows the user to dictate how the scroll value is updated across fifty iterations. It is called once per iteration for both the left and top offset. The value returned will be the new scroll position of the sidescroller. The parameter values in the example above are as follows:

* `currentItr` - is the value incremented over iterations between 0 and `totalIter`.
* `initialVal` - the initial value when the easing began
* `distance` - the distance being scrolled.
* `totalItr` - the total number of times the function will be called.

By default the easing function is cubic. To setup a direct snap to the final scrolling value simply return `initialVal + distance`.

```javascript
overthrow.sidescroller( scrollerElements, {
  easing: function( currentIter, initialVal, distance, totalIter ) {
    return initialVal + distance;
  }
});
```

### Sidescroller CSS

Lastly, you'll need some responsive CSS to make the sidescroller presentable and work properly.

First, let's style the slides. A quick reset and float to start things off:

``` css
.overthrow-enabled .sidescroll ul,
.overthrow-enabled .sidescroll li {
    float: left;
    margin: 0;
    padding: 0;
    list-style: none;
}
```

Next, the goal is to set the width of each slide to 100 / NUMBER OF SLIDES. So, if I have 6 slides, I'll set the width of each `li` to `100/6` or `16.666666667%`.

``` css
.overthrow-enabled .sidescroll li {
    width: 16.666666667%
}
```

Then, set the width of the `ul` to reveal different amounts of slides at a time within its allotted space. With 6 slides, 600% would show one slide at a time. 300% would show two slides at a time. And so on. The following CSS shows more slides as the viewport widens.

``` css
.overthrow-enabled .sidescroll ul {
    width: 600%;
}
@media (min-width: 40em){
    .overthrow-enabled .sidescroll ul {
        width: 300%;
    }
}
@media (min-width: 60em){
    .overthrow-enabled .sidescroll ul {
        width: 200%;
    }
}
```

You'll need to style the arrows so that they're tap-friendly, such as this CSS below:

``` css
/* next prev arrows */
.sidescroll-nextprev {
    position: relative;
}
.sidescroll-nextprev .sidescroll-nextprev-links {
  bottom: auto;
  top: 50%;
  position: absolute;
  left: 0;
  width: 100%;
}
.sidescroll-nextprev .sidescroll-nextprev-links a {
    position: absolute;
  text-indent: -9999px;
  width: 2em;
  height: 2em;
  background: #fff;
  opacity: .8;
  overflow: hidden;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  border-radius: 100%;
  z-index: 1;
}
.sidescroll-nextprev .sidescroll-nextprev-links a:hover,
.sidescroll-nextprev .sidescroll-nextprev-links a:focus {
  opacity: 1;
}
.sidescroll-nextprev .sidescroll-nextprev-links a.sidescroll-next {
  background-image: url(img/arrow-right.png);
  right: 1em;
}
.sidescroll-nextprev .sidescroll-nextprev-links a.sidescroll-prev {
  background-image: url(img/arrow-left.png);
  left: 1em;
}
```

The sidescroller demos above in the readme follow this pattern, so check them out for reference.

The horizontal scrollbar at the bottom of the scrollable area can be hidden using the following CSS:

```
.sidescroll-nextprev {
  overflow: hidden;
}
.sidescroll-nextprev .sidescroll {
  margin-top: -50px;
  padding-bottom: 50px;
  bottom: -50px;
  position: relative;
}
```

## Disabled Nav Extension

Including the disabled navigation extension with the sidescroller adds a `disabled` class to the navigation anchors when the region reaches it's ends.

```html
	<script src="../../dist/overthrow.js"></script>
	<script src="../../extensions/overthrow-sidescroller.js"></script>

	<!-- INCLUDE THE EXTENSION -->
	<script src="../../extensions/overthrow-sidescroller.disable-nav.js"></script>
```
Setting `rewind` to true will disable this behavior. You can view a demo at `$PROJECT_ROOT/examples/sidescroller/disabled-nav.html`.

## Append Method Extension

Including the `append` extension provides a method for gracefully handling the addition of list items to the child list

```html
	<script src="../../dist/overthrow.js"></script>
	<script src="../../extensions/overthrow-sidescroller.js"></script>

	<!-- INCLUDE THE EXTENSION -->
	<script src="../../extensions/overthrow-sidescroller.append.js"></script>
```

The calling convention for the `append` method is as follows:

```javascript
overthrow.sidescroller( scrollerElements, "append", newLi );
```

You can view a demo at `$PROJECT_ROOT/examples/sidescroller/append.html`.

## GoTo Extension

TODO

## Removing Items

No extension is required for removing elements from the sidescroller. Simply remove the elements from the DOM and call refresh:

```javascript
toRemove.parentNode.removeChild( toRemove );
overthrow.sidescroller( scrollerElements, "refresh" );
```

This is demonstrated in the append demo.
