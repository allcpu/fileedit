// Extended fabric line class
fabric.LineArrow = fabric.util.createClass(fabric.Line, {

  type: 'lineArrow',

  initialize: function(element, options) {
    options || (options = {});
    this.callSuper('initialize', element, options);
  },

  toObject: function() {
    return fabric.util.object.extend(this.callSuper('toObject'));
  },

  _render: function(ctx) {
    this.ctx = ctx;
    this.callSuper('_render', ctx);
    let p = this.calcLinePoints();
    let xDiff = this.x2 - this.x1;
    let yDiff = this.y2 - this.y1;
    let angle = Math.atan2(yDiff, xDiff);
    this.drawArrow(angle, p.x2, p.y2);
    ctx.save();
    xDiff = -this.x2 + this.x1;
    yDiff = -this.y2 + this.y1;
    angle = Math.atan2(yDiff, xDiff);
    this.drawArrow(angle, p.x1, p.y1);
  },

  drawArrow: function(angle, xPos, yPos) {
    this.ctx.save();
    this.ctx.translate(xPos, yPos);
    this.ctx.rotate(angle);
    this.ctx.beginPath();
    // Move 5px in front of line to start the arrow so it does not have the square line end showing in front (0,0)
    this.ctx.moveTo(10, 0);
    this.ctx.lineTo(-15, 15);
    this.ctx.lineTo(-15, -15);
    this.ctx.closePath();
    this.ctx.fillStyle = this.stroke;
    this.ctx.fill();
    this.ctx.restore();
  }
});



fabric.LineArrow.fromObject = function(object, callback) {
  callback && callback(new fabric.LineArrow([object.x1, object.y1, object.x2, object.y2], object));
};

fabric.LineArrow.async = true;


var Arrow = (function() {
  function Arrow(canvas) {
    this.canvas = canvas;
    this.className = 'Arrow';
    this.isDrawing = false;
    this.bindEvents();
  }

  Arrow.prototype.bindEvents = function() {
    var inst = this;
    inst.canvas.on('mouse:down', function(o) {
      inst.onMouseDown(o);
    });
    inst.canvas.on('mouse:move', function(o) {
      inst.onMouseMove(o);
    });
    inst.canvas.on('mouse:up', function(o) {
      inst.onMouseUp(o);
    });
    inst.canvas.on('object:moving', function(o) {
      inst.disable();
    })
  }

  Arrow.prototype.onMouseUp = function(o) {
    var inst = this;
    this.line.set({
      dirty: true,
      objectCaching: true
    });
    inst.canvas.renderAll();
    inst.disable();
  };

  Arrow.prototype.onMouseMove = function(o) {
    var inst = this;
    if (!inst.isEnable()) {
      return;
    }

    var pointer = inst.canvas.getPointer(o.e);
    var activeObj = inst.canvas.getActiveObject();
    activeObj.set({
      x2: pointer.x,
      y2: pointer.y
    });
    activeObj.setCoords();
    inst.canvas.renderAll();
  };

  Arrow.prototype.onMouseDown = function(o) {
    var inst = this;
    inst.enable();
    var pointer = inst.canvas.getPointer(o.e);

    var points = [pointer.x, pointer.y, pointer.x, pointer.y];
    this.line = new fabric.LineArrow(points, {
      strokeWidth: 5,
      fill: 'red',
      stroke: 'red',
      originX: 'center',
      originY: 'center',
      hasBorders: false,
      hasControls: false,
      objectCaching: false,
      perPixelTargetFind: true
    });

    inst.canvas.add(this.line).setActiveObject(this.line);
  };

  Arrow.prototype.isEnable = function() {
    return this.isDrawing;
  }

  Arrow.prototype.enable = function() {
    this.isDrawing = true;
  }

  Arrow.prototype.disable = function() {
    this.isDrawing = false;
  }

  return Arrow;
}());

var canvas = new fabric.Canvas('canvas', {
  selection: false
});
var arrow = new Arrow(canvas);