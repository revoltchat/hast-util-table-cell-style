'use strict';

var visit = require('unist-util-visit');

var hastCssPropertyMap = {
  align: 'text-align',
  valign: 'vertical-align',
  height: 'height',
  width: 'width'
};

module.exports = function tableCellStyle(node) {
  visit(node, 'element', visitor);
  return node;
};

function visitor(node) {
  if (node.tagName !== 'tr' && node.tagName !== 'td' && node.tagName !== 'th') {
    return;
  }
  Object.keys(hastCssPropertyMap).map(function (hastName) {
    if (node.properties[hastName] === undefined) {
      return;
    }
    var cssName = hastCssPropertyMap[hastName];
    appendStyle(node, cssName, node.properties[hastName]);
    delete node.properties[hastName];
  });
}

function appendStyle(node, property, value) {
  var prevStyle = (node.properties.style || '').trim();
  if (prevStyle && !/;\s*/.test(prevStyle)) {
    prevStyle += ";";
  }
  if (prevStyle) {
    prevStyle += " ";
  }
  var nextStyle = prevStyle + property + ": " + value + ";";
  node.properties.style = nextStyle;
}
