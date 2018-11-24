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
