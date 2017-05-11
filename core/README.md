# DISE Widget Core

## What's in the box?
The core package includes:
- a sample widget (located in `samples/`) showing off the very basics of rendering and updating a widget
- an environment with access to Mustache,   RequireJS and polyfills for Promise and Fetch.
- Tools for parameter retrieval, object merging (similar to similar to `Object.assign`) and AJAX management (similar to `parallel` and `series` from the [caolan/async](https://github.com/caolan/async))

## Installation  
1. Create a project folder, `my-widget/`
2. Pull this repository in as a submodule (`my-widget/dise-widget-core`)
3. Copy the files and folder from `my-widget/dise-widget-core/sample` and place them in the root directory. You should now have a file `my-widget/index.html`.
4. Load `my-widget/index.html` in a browser, and you're done. Make changes as you see fit.

## Lifecycle
The widget has  a fairly simple lifecycle: `init -> render -> fetch ->  update ... render -> fetch -> update`.  
On page load, `core/bootstrap` creates the widget object and initializes it with `.init()`. By default, the widget is rendered and a rerender interval is set up. On each render, the widget will fetch some data, include the proper template and update the DOM with the resulting markup.

## API
**Tools** are non-specific, non-application code, mainly utility methods to make life easier.   
- **merge**:  
  `this.merge(obj1, obj2, ... objn)`   
  Creates a new, shallow object with all the enumerable properties of the supplied objects.
- **format**:  
  `this.format("Greet %0", ["world"])` or `this.format("Greet %who", {who: "World"})`  
  Takes a string with placeholders and either an object or an array with values, replacing the former with the latter.  
  Uses `Object.keys`, so numeric placeholders are zero-based
- **async.parallel**  
  `this.async.parallel.call(this, [fn1, fn2, fnn], finally)`  
  Takes a collection of Promises, or functions that return Promises and executes them. When all Promises have resolved, `finally` is called with the results. Results come in the form of an object, with the results keyed according to the collection you submitted.

  If you call either of the async functions regularly, `this` will refer to the collection of functions. The preferred method is to use `bind`, `call` or `apply` which will bind scope correctly.
- **async.series**  
  `this.async.series.call(this, [fn1, fn2, fnn], finally)`  
  Takes a collection of functions that return Promises and executes them in order,
  piping the result of function *n* to function *n+1* as it resolves.  
  `finally` is called with the resolved return value of the last function. Each function in the chain is responsible for propagating the results through to the final function, which is why `merge` exists.

  If you call either of the async functions regularly, `this` will refer to the collection of functions. The preferred method is to use `bind`, `call` or `apply` which will bind scope correctly.


**Core**  contains general application code
- **parameters**  
A getter property that contains the parameters supplied to the widget. Takes default parameters from `<meta name="widget-%PARAM%" content="%VALUE%"/>`-tags, and overrides them with URL parameters, supplied with a regular `?%PARAM%=%VALUE%`-syntax.
- **layout**  
A getter property that returns a Promise, which resolves with a Mustache template. Template path is `layouts/${this.parameters.layout}.mustache`.
- **init**  
  Initializer method that does two things: It calls `this.render` and sets up a re-render interval. It's called once on page load.
- **update**  
  A method that takes a Mustache template (from `this.layout`) and an object with some data and renders it to the DOM.

**Widget** contains your specific application code
- **fetch**  
  Responsible for gathering data from whatever non-local sources you may have, usually REST API endpoints. Like all asynchronous methods it should return a Promise.
- **render**  
  Coordinates the (re-)render of the widget. It's called once every `this.parameters.tick` and usually looks sort of like this:
  ```
    api.render = function () {
      this.async.parallel.call(this,
        {
          layout: this.layout,
          data: this.fetch
        },
        function (results) {
          this.update(results.layout, results.data);
        }
      )
    }
  ```
