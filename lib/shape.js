var _ = require('lodash');
var ctor = function(){};
var inherits = function(parent, protoProps) {
  var child;

  if (protoProps && protoProps.hasOwnProperty('constructor')) {
	child = protoProps.constructor;
  } else {
	child = function(){ return parent.apply(this, arguments); };
  }

  ctor.prototype = parent.prototype;
  child.prototype = new ctor();
  
  if (protoProps) extend(child.prototype, protoProps);
  
  child.prototype.constructor = child;
  child.__super__ = parent.prototype;
  return child;
};

function extend(target, ref) {
  var name, value;
  for (name in ref) {
	value = ref[name];
	if (value !== undefined) {
	  target[name] = value;
	}
  }
  return target;
};

function Shape(obj) {
  extend(this, obj);
  if(this.extractParameters !== ctor) {
    this.extractParameters(obj);
  }
}

extend(Shape.prototype, {
  extractParameters : ctor
});

Shape.extend = function(protoProps) {
  var child = inherits(this, protoProps);
  child.extend = Shape.extend;
  return child;
};


exports.Shape = Shape;