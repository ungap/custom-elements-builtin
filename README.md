# Custom Elements with Builtin Extends

[![Build Status](https://travis-ci.com/ungap/custom-elements-builtin.svg?branch=master)](https://travis-ci.com/ungap/custom-elements-builtin) [![Greenkeeper badge](https://badges.greenkeeper.io/ungap/custom-elements-builtin.svg)](https://greenkeeper.io/) ![WebReflection status](https://offline.report/status/webreflection.svg)

Brings builtin extends to browsers that already have `customElements` (i.e. Safari).

See [document-register-element](https://github.com/WebReflection/document-register-element) to polyfill upfront all other legacy browsers too.

```js
customElements.define(
  'my-button',
  class MyButton extends HTMLButtonElement {
    static get observedAttributes() { return ['color']; }
    attributeChangedCallback(name, oldValue, newValue, nsValue) {
      this.style.color = newValue;
    }
    connectedCallback() {
      this.addEventListener('click', this);
    }
    disconnectedCallback() {
      this.removeEventListener('click', this);
    }
    handleEvent(event) {
      const next = this.nextElementSibling ||
                    this.parentNode.appendChild(
                      document.createElement('div')
                    );
      next.textContent = `${event.type} @ ${new Date}`;
    }
  },
  {'extends': 'button'}
);
```

  * CDN via https://unpkg.com/@ungap/custom-elements-builtin
  * ESM via `import iterator from '@ungap/custom-elements-builtin'`
  * CJS via `const iterator = require('@ungap/custom-elements-builtin')`

[Live ES2015 test](https://ungap.github.io/custom-elements-builtin/test/)

[Live ES5 test](https://ungap.github.io/custom-elements-builtin/test/es5/)


## All Possible Features Detections

This is all it takes to have all the right polyfills in place.

```html
<script>
if (this.customElements) {
  try {
    // feature detect browsers that "forgot" 🙄 to implement built-in extends
    customElements.define('built-in', document.createElement('p').constructor, {'extends':'p'});
  } catch(_) {
    // only WebKit or Safari
    document.write('<script src="//unpkg.com/@ungap/custom-elements-builtin"><\x2fscript>');
  }
} else {
  // only legacy browsers
  document.write('<script src="//unpkg.com/document-register-element"><\x2fscript>');
}
</script>
<script>
// everything else that needs a reliable customElements global
// with built-in extends capabilities
// Note: it's important it's one <script> tag after the previous one!
</script>
```

The, still readable, but minified version is here:

```html
<script>
if(this.customElements)
  try{customElements.define('built-in',document.createElement('p').constructor,{'extends':'p'})}
  catch(s){document.write('<script src="//unpkg.com/@ungap/custom-elements-builtin"><\x2fscript>')}
else
  document.write('<script src="//unpkg.com/document-register-element"><\x2fscript>');
</script>
```

If for some reason your server / header has issues in sending `<script>` content:

```html
<script>
if(this.customElements)
  try{customElements.define('built-in',document.createElement('p').constructor,{'extends':'p'})}
  catch(s){document.write(unescape('%3Cscript%20src%3D%22https%3A//unpkg.com/@ungap/custom-elements-builtin%22%3E%3C/script%3E'))}
else
  document.write(unescape('%3Cscript%20src%3D%22https%3A//unpkg.com/document-register-element%22%3E%3C/script%3E'));
</script>
```


## Constructor Caveat

You cannot use the `constructor` in any meaningful way if you want to ensure API consistency.

Create new elements via `document.createElement('button', {is: 'my-button'})` but do not use `new MyButton` or incompatible browsers will throw right away because they made `HTMLButtonElement` and all others not usable as classes.

If you need a reliable entry point to setup your custom builtins use the `connectedCallback` method instead of the `constructor` so you're also sure all attributes are eventually already known and you'll have full control.

Alternatively, use a `WeakSet` to optionally invoke a setup.

```js
const initialized = new WeakSet;
const setup = node => {
  initialized.add(node);
  node.live = true;
};
class MyButton extends HTMLButtonElement {
  connectedCallback() {
    if (!initialized.has(this))
      setup(this);
    // anything else
  }
}
```

You can do the same at the beginning of `attributeChangedCallback`.

### Compatible with ...

Any engine that supports genuine ES2015 syntax and the following features:

  * global `MutationObserver`, `customElements`, and `Promise`
  * `assign`, `create`, `defineProperties`, and `setPrototypeOf` from the `Object`
