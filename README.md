# DISE Widget Core

**This project is in beta release**. Breaking changes may occur until it hits version 1.

## What's in the box?
The core package includes:
- A batteries-included, opinionated framework for creating small browser widgets or web apps.
- a sample widget (located in `samples/`) showing off the very basics of rendering and updating a widget
- Modules via [RequireJS](http://requirejs.org/) and the [text plugin](https://github.com/requirejs/text)
- Templating via [Mustache](https://github.com/janl/mustache.js)
- Async functions similar to `parallel` and `waterfall` methods by [caolan/async]([caolan/async](https://github.com/caolan/async))
- Polyfills for [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) and [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- Helper methods for string formatting and object merging

## Quick start
1. Create a project folder, `my-widget/`
2. Pull this repository in as a submodule (`my-widget/dise-widget-core`)
3. Copy the files and folder from `my-widget/dise-widget-core/sample` and place them in the root directory. You should now have a file `my-widget/index.html`.
4. Load `my-widget/index.html` in a browser, and you're done. Make changes as you see fit.

## Lifecycle
DSWC offers a decoupled, event-driven lifecycle. On page load,
`DS.Core.start` will do n things:
* attempt to call `DS.Widget.init`
* emit the `DS.Event.INIT` event
* if `DS.Settings.tick` is > 0, it will set a loop that emits `DS.Event.TICK`
every `tick` seconds

It is suggested to declare a _fetch_ and _update_ method on `DS.Widget`,
and have `DS.Widget.update` call `DS.Core.render` in order to perform a UI update.

When the UI is updated via this method, `DS.Event.RENDER` will be emitted. This
allows you to e.g. re-bind events.

A rough outline of the lifecycle is:  
`[Page Load] -> DS.Core.start -> DS.Widget.init -> DS.Widget.update -> DS.Widget.fetch -> DS.Core.render -> DS.Widget.update ...`;

## Settings and parameters
there are two ways to declare settings for the widget. Default settings
may be declared as meta-tags in `index.html`, like `<meta name="widget-mySetting" content="MyValue">`;

Additionally, settings may be declared as query parameters, like `?mySetting=MyValue`.
In case of conflict, query parameters override tag parameters.

 Settings are then available in the widget as `DS.Settings.mySetting`.

## API
**DS.Event**  
- `INIT` - Emitted on initialization
- `RENDER` - Emitted after each render
- `TICK` - Emitted on each tick
**DS.Settings**
Contains the settings provided via meta tags or query parameters.

**DS.Async**  
Asynchronous methods that emulate a subset of [caolan/async]([caolan/async](https://github.com/caolan/async).
- `parallel([fn1, fn2, ...], finally)`  
Takes a collection of Promises, or functions that return Promises and executes them. When all Promises have resolved, `finally` is called with the results. Results come in the form of an object, with the results keyed according to the collection you submitted.
- `waterfall([fn1, fn2, ...], finally)`  
  Takes a collection of functions that return Promises and executes them in order,
  piping the result of function *n* to function *n+1* as it resolves.  
  `finally` is called with the resolved return value of the last function. Each function in the chain is responsible for propagating the results through to the final function, which is why `DS.Tool.merge` exists.

**DS.Tool**  
- `merge(o1, o2 ...)`  
Merges two or more objects shallowly
- `format(string, [param1, param2, ...])`  
Takes a string with placeholders (%1, %2 ...) and a set of values, and substitutes
the placeholders for the values.

**DS.Core**  
- `$el`  
References the `#widget` element.
- `layout`
The name of the Mustache template to use, e.g. "card". Should match the name,
without file extension, of a file in `/layouts`.
- `render(template, data)`  
Takes a Mustache template and a data set, renders them and updates the DOM.  
Emits the `RENDER` event afterwards.
- `emit(type, detail)`  
Emits a custom event on `DS.Core.$el`.
- `listen(type, fn)`  
Adds an event listener for the event, tied to `$el`;
- `start()`  
Called on load. Performs some bootstrapping, then launches the Widget.

**DS.Widget**  
All methods on `DS.Widget` are optional - You're free to implement it however
you want. There is a suggested, or preferred, way of doing things, and that is what's
outlined here.

- `init()`  
Called on page load when the initial setup is complete
- `update()`  
Performs update logic - Retrieved and formats data, retrieves a layout,
performs delegations. Might be beneficial to bind this method to the `INIT` and
`TICK` events.
`fetch()`  
Used to make external API calls and similar. Performs the actual data retrieval.
