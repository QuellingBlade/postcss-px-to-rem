'use strict';

var postcss = require('postcss');
var objectAssign = require('object-assign');

var defaults = {
  unitToConvert: 'px',
  viewportWidth: 320,
  viewportHeight: 568, // not now used; TODO: need for different units and math for different properties
  unitPrecision: 5,
  selectorBlackList: [],
  minPixelValue: 1,
  mediaQuery: false
};

var unit = 'rem'

module.exports = postcss.plugin('postcss-px-to-rem', function (options) {

  var opts = objectAssign({}, defaults, options);
  var pxReplace = createPxReplace(opts.viewportWidth, opts.minPixelValue, opts.unitPrecision);

  // excluding regex trick: http://www.rexegg.com/regex-best-trick.html
  // Not anything inside double quotes
  // Not anything inside single quotes
  // Not anything inside url()
  // Any digit followed by px
  // !singlequotes|!doublequotes|!url()|pixelunit
  var pxRegex = new RegExp('"[^"]+"|\'[^\']+\'|url\\([^\\)]+\\)|(\\d*\\.?\\d+)' + opts.unitToConvert, 'ig')

  return function (css) {

    css.walkDecls(function (decl, i) {
      // This should be the fastest test and will remove most declarations
      if (decl.value.indexOf(opts.unitToConvert) === -1) return;

      if (blacklistedSelector(opts.selectorBlackList, decl.parent.selector)) return;

      decl.value = decl.value.replace(pxRegex, createPxReplace(opts.viewportWidth, opts.minPixelValue, opts.unitPrecision));
    });

    if (opts.mediaQuery) {
      css.walkAtRules('media', function (rule) {
        if (rule.params.indexOf(opts.unitToConvert) === -1) return;
        rule.params = rule.params.replace(pxRegex, pxReplace);
      });
    }
  };
});

function createPxReplace(viewportSize, minPixelValue, unitPrecision) {
  return function (m, $1) {
    if (!$1) return m;
    var pixels = parseFloat($1);
    if (pixels <= minPixelValue) return m;
    return toFixed((pixels / viewportSize * 10), unitPrecision) + 'rem';
  };
}

function toFixed(number, precision) {
  var multiplier = Math.pow(10, precision + 1),
    wholeNumber = Math.floor(number * multiplier);
  return Math.round(wholeNumber / 10) * 10 / multiplier;
}

function blacklistedSelector(blacklist, selector) {
  if (typeof selector !== 'string') return;
  return blacklist.some(function (regex) {
    if (typeof regex === 'string') return selector.indexOf(regex) !== -1;
    return selector.match(regex);
  });
}
