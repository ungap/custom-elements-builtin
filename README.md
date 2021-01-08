# Custom Elements with Builtin Extends

[![Build Status](https://travis-ci.com/ungap/custom-elements-builtin.svg?branch=master)](https://travis-ci.com/ungap/custom-elements-builtin) [![Greenkeeper badge](https://badges.greenkeeper.io/ungap/custom-elements-builtin.svg)](https://greenkeeper.io/) ![WebReflection status](https://offline.report/status/webreflection.svg)

## Deprecated

The current polyfill is [@ungap/custom-elements](https://github.com/ungap/custom-elements#readme) which includes all features detection in it.

However, a quick and dirty approach could now be based on the following detection:

```html
<!-- top of your HTML document -->
<script>
if (!self.customElements || !(self.chrome || self.navigator))
  document.write('<script src="//unpkg.com/@ungap/custom-elements"><\x2fscript>');
</script>
```

If you really want to use only *builtin extends*, then you can write this instead:

```html
<!-- top of your HTML document -->
<script>
if (!(self.chrome || self.navigator))
  document.write('<script src="//unpkg.com/@webreflection/custom-elements-builtin"><\x2fscript>');
</script>
```

**However**, keep in mind the whole polyfill is both more reliable, in terms of features detection, and it also patches other browsers with latest `whenDefined` behavior.
