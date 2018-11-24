# Custom Elements with Builtin Extends

[![Build Status](https://travis-ci.com/ungap/custom-elements-builtin.svg?branch=master)](https://travis-ci.com/ungap/custom-elements-builtin) ![WebReflection status](https://offline.report/status/webreflection.svg)

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

[Live test](https://ungap.github.io/custom-elements-builtin/test/)
