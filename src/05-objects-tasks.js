/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  const rectangle = {};
  rectangle.width = width;
  rectangle.height = height;
  rectangle.getArea = () => width * height;

  return rectangle;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const objRepresentation = JSON.parse(json);
  const objResult = Object.create(proto);

  Object.keys(objRepresentation).forEach((key) => {
    objResult[key] = objRepresentation[key];
  });

  return objResult;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class Builder {
  constructor() {
    this.selectorsMap = new Map();
    this.combinedSelectors = [];
  }

  element(value) {
    if (this.selectorsMap.has('element')) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    if (this.selectorsMap.has('id') || this.selectorsMap.has('class') || this.selectorsMap.has('attr') || this.selectorsMap.has('pseudoClass') || this.selectorsMap.has('pseudoElement')) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    this.selectorsMap.set('element', value);
    return this;
  }

  id(value) {
    if (this.selectorsMap.has('id')) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    if (this.selectorsMap.has('class') || this.selectorsMap.has('attr') || this.selectorsMap.has('pseudoClass') || this.selectorsMap.has('pseudoElement')) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    this.selectorsMap.set('id', `#${value}`);
    return this;
  }

  class(value) {
    if (this.selectorsMap.has('attr') || this.selectorsMap.has('pseudoClass') || this.selectorsMap.has('pseudoElement')) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    if (!this.selectorsMap.has('class')) this.selectorsMap.set('class', []);
    this.selectorsMap.get('class').push(`.${value}`);
    return this;
  }

  attr(value) {
    if (this.selectorsMap.has('pseudoClass') || this.selectorsMap.has('pseudoElement')) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    if (!this.selectorsMap.has('attr')) this.selectorsMap.set('attr', []);
    this.selectorsMap.get('attr').push(`[${value}]`);
    return this;
  }

  pseudoClass(value) {
    if (this.selectorsMap.has('pseudoElement')) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    if (!this.selectorsMap.has('pseudoClass')) this.selectorsMap.set('pseudoClass', []);
    this.selectorsMap.get('pseudoClass').push(`:${value}`);
    return this;
  }

  pseudoElement(value) {
    if (this.selectorsMap.has('pseudoElement')) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    this.selectorsMap.set('pseudoElement', `::${value}`);
    return this;
  }

  combine(selector1, combinator, selector2) {
    this.combinedSelectors.push(`${selector1.stringify()} ${combinator} ${selector2.stringify()}`);
    return this;
  }

  stringify() {
    if (this.combinedSelectors.length > 0) return this.combinedSelectors.join('');
    return [...this.selectorsMap.values()].flat().join('');
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new Builder().element(value);
  },

  id(value) {
    return new Builder().id(value);
  },

  class(value) {
    return new Builder().class(value);
  },

  attr(value) {
    return new Builder().attr(value);
  },

  pseudoClass(value) {
    return new Builder().pseudoClass(value);
  },

  pseudoElement(value) {
    return new Builder().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return new Builder().combine(selector1, combinator, selector2);
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
