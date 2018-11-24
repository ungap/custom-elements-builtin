"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/*! (c) Andrea Giammarchi - ISC */
(function (document, customElements) {
  'use strict';

  if (customElements.get('li-li')) return;
  var EXTENDS = 'extends';

  try {
    var LI =
    /*#__PURE__*/
    function (_HTMLLIElement) {
      _inherits(LI, _HTMLLIElement);

      function LI() {
        _classCallCheck(this, LI);

        return _possibleConstructorReturn(this, _getPrototypeOf(LI).apply(this, arguments));
      }

      return LI;
    }(_wrapNativeSuper(HTMLLIElement));

    customElements.define('li-li', LI, _defineProperty({}, EXTENDS, 'li'));
    if (!/is="li-li"/.test(new LI().outerHTML)) throw {};
  } catch (o_O) {
    var ATTRIBUTE_CHANGED_CALLBACK = 'attributeChangedCallback';
    var CONNECTED_CALLBACK = 'connectedCallback';
    var DISCONNECTED_CALLBACK = 'disconnectedCallback';
    var assign = Object.assign,
        create = Object.create,
        defineProperties = Object.defineProperties,
        setPrototypeOf = Object.setPrototypeOf;
    var define = customElements.define,
        get = customElements.get,
        upgrade = customElements.upgrade,
        whenDefined = customElements.whenDefined;
    var registry = create(null);

    var attributeChanged = function attributeChanged(changes) {
      for (var i = 0, length = changes.length; i < length; i++) {
        var _changes$i = changes[i],
            attributeName = _changes$i.attributeName,
            oldValue = _changes$i.oldValue,
            target = _changes$i.target;
        var newValue = target.getAttribute(attributeName);
        if (ATTRIBUTE_CHANGED_CALLBACK in target && !(oldValue == newValue && newValue == null)) target[ATTRIBUTE_CHANGED_CALLBACK](attributeName, oldValue, target.getAttribute(attributeName), // TODO: add getAttributeNS if the node is XML
        null);
      }
    };

    var getInfo = function getInfo(node) {
      var is = node.getAttribute('is');

      if (is) {
        is = is.toLowerCase();
        if (is in registry) return registry[is];
      }

      return null;
    };

    var setup = function setup(node, info) {
      var Class = info.Class;
      var oa = Class.observedAttributes || [];
      setPrototypeOf(node, Class.prototype);

      if (oa.length) {
        new MutationObserver(attributeChanged).observe(node, {
          attributes: true,
          attributeFilter: oa,
          attributeOldValue: true
        });
        var changes = [];

        for (var i = 0, length = oa.length; i < length; i++) {
          changes.push({
            attributeName: oa[i],
            oldValue: null,
            target: node
          });
        }

        attributeChanged(changes);
      }
    };

    var setupSubNodes = function setupSubNodes(node, setup) {
      var nodes = node.querySelectorAll('[is]');

      for (var i = 0, length = nodes.length; i < length; i++) {
        setup(nodes[i]);
      }
    };

    var setupIfNeeded = function setupIfNeeded(node) {
      if (node.nodeType !== 1) return;
      setupSubNodes(node, setupIfNeeded);
      var info = getInfo(node);

      if (info) {
        if (!(node instanceof info.Class)) setup(node, info);
        if (CONNECTED_CALLBACK in node) node[CONNECTED_CALLBACK]();
      }
    };

    var disconnectIfNeeded = function disconnectIfNeeded(node) {
      if (node.nodeType !== 1) return;
      setupSubNodes(node, disconnectIfNeeded);
      var info = getInfo(node);
      if (info && node instanceof info.Class && DISCONNECTED_CALLBACK in node) node[DISCONNECTED_CALLBACK]();
    };

    new MutationObserver(function (changes) {
      for (var i = 0, length = changes.length; i < length; i++) {
        var _changes$i2 = changes[i],
            addedNodes = _changes$i2.addedNodes,
            removedNodes = _changes$i2.removedNodes;

        for (var j = 0, _length = addedNodes.length; j < _length; j++) {
          setupIfNeeded(addedNodes[j]);
        }

        for (var _j = 0, _length2 = removedNodes.length; _j < _length2; _j++) {
          disconnectIfNeeded(removedNodes[_j]);
        }
      }
    }).observe(document, {
      childList: true,
      subtree: true
    });
    defineProperties(customElements, {
      define: {
        value: function value(name, Class, options) {
          name = name.toLowerCase();

          if (options && EXTENDS in options) {
            // currently options is not used but preserved for the future
            registry[name] = assign({}, options, {
              Class: Class
            });
            var query = options[EXTENDS] + '[is="' + name + '"]';
            var changes = document.querySelectorAll(query);

            for (var i = 0, length = changes.length; i < length; i++) {
              setupIfNeeded(changes[i]);
            }
          } else define.apply(customElements, arguments);
        }
      },
      get: {
        value: function value(name) {
          return name in registry ? registry[name].Class : get.call(customElements, name);
        }
      },
      upgrade: {
        value: function value(node) {
          var info = getInfo(node);
          if (info && !(node instanceof info.Class)) setup(node, info);else upgrade.call(customElements, node);
        }
      },
      whenDefined: {
        value: function value(name) {
          return name in registry ? Promise.resolve() : whenDefined.call(customElements, name);
        }
      }
    });
    var createElement = document.createElement;
    defineProperties(document, {
      createElement: {
        value: function value(name, options) {
          var node = createElement.call(document, name);

          if (options && 'is' in options) {
            node.setAttribute('is', options.is);
            customElements.upgrade(node);
          }

          return node;
        }
      }
    });
  }
})(document, customElements);

customElements.define('my-button',
/*#__PURE__*/
function (_HTMLButtonElement) {
  _inherits(MyButton, _HTMLButtonElement);

  function MyButton() {
    _classCallCheck(this, MyButton);

    return _possibleConstructorReturn(this, _getPrototypeOf(MyButton).apply(this, arguments));
  }

  _createClass(MyButton, [{
    key: "attributeChangedCallback",
    value: function attributeChangedCallback(name, oldValue, newValue, nsValue) {
      this.style.color = newValue;
    }
  }, {
    key: "connectedCallback",
    value: function connectedCallback() {
      this.addEventListener('click', this);
    }
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      this.removeEventListener('click', this);
    }
  }, {
    key: "handleEvent",
    value: function handleEvent(event) {
      var next = this.nextElementSibling || this.parentNode.appendChild(document.createElement('div'));
      next.textContent = "".concat(event.type, " @ ").concat(new Date());
    }
  }], [{
    key: "observedAttributes",
    get: function get() {
      return ['color'];
    }
  }]);

  return MyButton;
}(_wrapNativeSuper(HTMLButtonElement)), {
  'extends': 'button'
});

