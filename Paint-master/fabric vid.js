var canvas = new fabric.Canvas('c');
var video1El = document.getElementById('video1');

var video1 = new fabric.Image(video1El, {
  left: 200,
  top: 300,
  angle: -15,
  originX: 'center',
  originY: 'center',
  objectCaching: false,
});

canvas.add(video1);
video1.getElement().play();