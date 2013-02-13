var _ = require('lodash');
var dollar = require('./vendor/dollar');
var event = require('event');
var util = require('util');
var Signal = require('signals').Signal;
var Shape = require('./shape').Shape;
var primitives = require('./shapes/primitives');

util.inherits(Recognizer, events.EventEmitter);
function Recognizer(shapeArray) {
  event.EventEmitter.call(this);
  this._unistrokeRecognizer = new dolloar.DollarRecognizer();
  if (!shapeArray) {
    this.addShape(primitives);
  } else {
    this.addShape(shapeArray);
  }
};

Recognizer.prototype.addShape = function(shapes) {
  var _this = this;
  if (_.isArray) {
    _.each(shapes, function(shp) {
      _this.addShape(shp);
    });    
  } else {
    if (shape.name) {
      this._shapes[shape.name] = Shape.extend(shape);    
      this.signals[this._getShapeSignal(shape.name)] = new Signal();
      if (shape.templates) {
        _.each(shape.templates, function(tmpl) {
          this._unistrokeRecognizer.loadTemplate(shape.name, tmpl);
        });
      }
    } else {
      console.error('Init shape without a name!');
    }
  }
};

Recognizer.prototype._getShapeSignal = function(shapeName) {
  return this.signals[shapeName + 'Triggered'];
};

// stroke array:
// [{ X: x coorinate, Y: y cooridinate, t: time stamp(optional)}
//  { X: 203, Y: 301 , t: 1360636767361 },
//  { X: 243, Y: 301 , t: 1360636767435 },
//  { X: 103, Y: 101 , t: 1360636767988 } ...]

/**
 * Input a stroke array for uni-stroke recognition,
 * or an array of stroke array for multi-stroke recognition.
 * output recognized shape object and emit sigal '{shape.name}Triggerd'
 * @param {Array} strokes
 */
Recognizer.prototype.recognize = function(strokes) {
  if (_.isArray(strokes) && strokes.length > 1) {
    console.log('multi-stroke recognition has not been implemented yet!');
  } else if (_.isArray(strokes) && strokes.length === 1) {
    var stroke = strokes[0];
    var result = this._unistrokeRecognizer.Recognize(stroke);
    var shp = new this._shapes[result.name](result.Data);
    this.signals[this._getShapeSignal(result.name)].dispatch(shp);
    return shp;
  }
  return null;
};

exports.Recognizer = Recognizer;
exports.recognizer = function(shapeTable) {
  return new Recognizer(shapeTable);
};