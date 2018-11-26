/*! (c) Andrea Giammarchi - ISC */
(function (document, customElements, Object) {
  'use strict';
  if (customElements.get('ungap-li') || typeof Reflect == typeof EXTENDS)
    return;
  var EXTENDS = 'extends';
  try {
    // class LI extends HTMLLIElement {}
    var desc = {};
    desc[EXTENDS] = 'li';
    var HtmlLI = HTMLLIElement;
    var LI = function () {
      return Reflect.construct(HtmlLI, [], LI);
    };
    LI.prototype = Object.create(HtmlLI.prototype);
    customElements.define('ungap-li', LI, desc);
    if (!/is="ungap-li"/.test((new LI).outerHTML))
      throw {};
  } catch (o_O) {
    var ATTRIBUTE_CHANGED_CALLBACK = 'attributeChangedCallback';
    var CONNECTED_CALLBACK = 'connectedCallback';
    var DISCONNECTED_CALLBACK = 'disconnectedCallback';
    var assign = Object.assign;
    var create = Object.create;
    var defineProperties = Object.defineProperties;
    var setPrototypeOf = Object.setPrototypeOf;
    var define = customElements.define;
    var get = customElements.get;
    var upgrade = customElements.upgrade;
    var whenDefined = customElements.whenDefined;
    var registry = create(null);
    new MutationObserver(function (changes) {
      for (var i = 0, length = changes.length; i < length; i++) {
        var change = changes[i];
        var addedNodes = change.addedNodes;
        var removedNodes = change.removedNodes;
        for (var j = 0, len = addedNodes.length; j < len; j++)
          setupIfNeeded(addedNodes[j]);
        for (var j = 0, len = removedNodes.length; j < len; j++)
          disconnectIfNeeded(removedNodes[j]);
      }
    }).observe(
      document,
      {childList: true, subtree: true}
    );
    defineProperties(
      customElements,
      {
        define: {
          value: function (name, Class, options) {
            name = name.toLowerCase();
            if (options && EXTENDS in options) {
              // currently options is not used but preserved for the future
              registry[name] = assign({}, options, {Class: Class});
              var query = options[EXTENDS] + '[is="' + name + '"]';
              var changes = document.querySelectorAll(query);
              for (var i = 0, length = changes.length; i < length; i++)
                setupIfNeeded(changes[i]);
            }
            else
              define.apply(customElements, arguments);
          }
        },
        get: {
          value: function (name) {
            return name in registry ?
              registry[name].Class :
              get.call(customElements, name);
          }
        },
        upgrade: {
          value: function (node) {
            var info = getInfo(node);
            if (info && !(node instanceof info.Class))
              setup(node, info);
            else
              upgrade.call(customElements, node);
          }
        },
        whenDefined: {
          value: function (name) {
            return name in registry ?
              Promise.resolve() :
              whenDefined.call(customElements, name);
          }
        }
      }
    );
    var createElement = document.createElement;
    defineProperties(
      document,
      {
        createElement: {
          value: function (name, options) {
            var node = createElement.call(document, name);
            if (options && 'is' in options) {
              node.setAttribute('is', options.is);
              customElements.upgrade(node);
            }
            return node;
          }
        }
      }
    );
    function attributeChanged(changes) {
      for (var i = 0, length = changes.length; i < length; i++) {
        var change = changes[i];
        var attributeName = change.attributeName;
        var oldValue = change.oldValue;
        var target = change.target;
        var newValue = target.getAttribute(attributeName);
        if (
          ATTRIBUTE_CHANGED_CALLBACK in target &&
          !(oldValue == newValue && newValue == null)
        )
          target[ATTRIBUTE_CHANGED_CALLBACK](
            attributeName,
            oldValue,
            target.getAttribute(attributeName),
            // TODO: add getAttributeNS if the node is XML
            null
          );
      }
    }
    function disconnectIfNeeded(node) {
      if (node.nodeType !== 1)
        return;
      setupSubNodes(node, disconnectIfNeeded);
      var info = getInfo(node);
      if (
        info &&
        node instanceof info.Class &&
        DISCONNECTED_CALLBACK in node
      )
        node[DISCONNECTED_CALLBACK]();
    }
    function getInfo(node) {
      var is = node.getAttribute('is');
      if (is) {
        is = is.toLowerCase();
        if (is in registry)
          return registry[is];
      }
      return null;
    }
    function setup(node, info) {
      var Class = info.Class;
      var oa = Class.observedAttributes || [];
      setPrototypeOf(node, Class.prototype);
      if (oa.length) {
        new MutationObserver(attributeChanged).observe(
          node,
          {
            attributes: true,
            attributeFilter: oa,
            attributeOldValue: true
          }
        );
        var changes = [];
        for (var i = 0, length = oa.length; i < length; i++)
          changes.push({attributeName: oa[i], oldValue: null, target: node});
        attributeChanged(changes);
      }
    }
    function setupIfNeeded(node) {
      if (node.nodeType !== 1)
        return;
      setupSubNodes(node, setupIfNeeded);
      var info = getInfo(node);
      if (info) {
        if (!(node instanceof info.Class))
          setup(node, info);
        if (CONNECTED_CALLBACK in node)
          node[CONNECTED_CALLBACK]();
      }
    }
    function setupSubNodes(node, setup) {
      var nodes = node.querySelectorAll('[is]');
      for (var i = 0, length = nodes.length; i < length; i++)
        setup(nodes[i]);
    }
  }
}(document, customElements, Object));
