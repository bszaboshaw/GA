
var con = console;

// some basic svg methods
var svg = {
  create: function(tag, parent, options) {
    var k, v;
    var svg = document.createElementNS("http://www.w3.org/2000/svg", tag);
    parent.appendChild(svg);

    svg.attr = function(a,b) {
      if (b == null) {
        return this.getAttribute(a)
      } else {
        this.setAttribute(a,b)
        return this;
      }
    }
    if (options != null) {
      for (k in options) {
        v = options[k];
        svg.attr(k, v);
      }
    }
    return svg;
  },

  rect: function(parent, x, y, w, h, options) {
    if (options == null) {
      options = {};
    }
    options.x = x;
    options.y = y;
    options.width = w;
    options.height = h;
    return this.create("rect", parent, options);
  },

  path: function(parent, path, options) {
    if (options == null) {
      options = {};
    }
    if (typeof path === !"string") {
      con.warn("Path needs a string of draw commands");
    }
    options.d = path;
    return this.create("path", parent, options);
  }

};

function getWindow() {
  var w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('#js_experiment')[0],
      x = w.innerWidth || e.clientWidth || g.clientWidth,
      y = w.innerHeight|| e.clientHeight|| g.clientHeight;
  if (y < 600) y = 600;
      return {width:x,height:y}
}



var circleRads = Math.PI*2;
var wid = getWindow().width;
var hei = getWindow().height;

var chart = svg.create("svg", document.body, {"width":wid, "height":hei});

var CURVED = "CURVED", STRAIGHT = "STRAIGHT";

var palette = [
  ['#A0C9D9','#F2F0D0','#735438','#A64941','#0D0D0D'],
  ['#D93D93','#629C27','#DEE300','#32393D','#FFFFFF'],
  ['#36190A','#B2460B','#FF6818','#009AA3','#00ECD2'],
  ['#1B69FF','#002875','#0143C2','#FFB002','#FF781E'],
  ['#FFBE10','#FFAE3C','#FF7E49','#E85137','#333C3C'],
  ['#0E1D22','#587077','#555555','#ECEBDF'],
  ['#F2385A','#F5A503','#E9F1DF','#4AD9D9','#36B1BF'],
  ['#E8463E','#611410','#FFCFCD','#038733','#63F598'],
  ['#4F8499','#C95F5F','#003145','#012914','#FCD457'],
  ['#406874','#84D9D9','#B8D9D3','#35402A','#592C1C'],
  ['#8F8164','#D9D7AC','#4F6373','#293845','#14212B'],
  ['#1C2623','#37A672','#E2CA63','#F2884B','#DB3323'],
  ['#FFD7AE','#163A5C','#1D2328','#FE6200','#ADB7BD'],
  ['#FFB919','#8C12B2','#C200FF','#14CC83','#09B26F'],
  ['#8C1822','#BF1725','#594F46','#1C8476','#006B5E'],
  ['#CF9CB3','#626161','#DEBC92','#B68256','#EDDFBB'],
  ['#A6442E','#A65644','#BF7665','#D9A79C','#F2F2F2'],
  ['#200101','#421C0C','#C9A860','#4FA35E','#076043'],
  ['#435939','#737268','#D9D4BA','#D9D5C5','#0D0000'],
  ['#467302','#97BF04','#D97904','#A62F03','#590902']
];




var settings = {
  paths: 3,
  palette: ~~(Math.random() * palette.length),
  radiusMin: 30,
  radiusMax: 50,
  rotateMax: 80, // percentage of a complete a circle
  lineMin: 10,
  lineMax: 100
}

var shapedata = {};

function generateStyles() {

  shapedata = {};

  var pal = [].concat(palette[ settings.palette ]);

  var bgIndex = ~~( Math.random() * pal.length );
  shapedata.bgColour = pal[ bgIndex ];
  pal.splice(bgIndex, 1);

  var p = [];
  for ( var i = 0; i < settings.paths; i++ ) {
    p[ i ] = {
      colour: pal[ ~~( Math.random() * pal.length ) ],
      width: 2 + Math.random() * 6
    }
  }

  shapedata.segments = []; // segment of the path, curved or straight with geometry for each band
  shapedata.fullpaths = []; // string of svg line commands for each path
  shapedata.styles = p; // style of each band
}




function getLineWidth( black, index ) {
  var w = shapedata.styles[ index ].width;
  return black ? w + 4 : w;
}
function getLineCap( black, index ) {
  return black ? "butt" : "round";
}
function getStrokeStyle( black, index ) {
  return black ? "rgba(0,0,0,0.5)" : shapedata.styles[ index ].colour;
}

function calcArc( x, y, angleStart, isFirst ) {

  var radius = Math.random() * (settings.radiusMax - settings.radiusMin) + settings.radiusMin;
  //var radius = 30;

  var rotateDir = Math.random() > 0.5 ? 1 : -1;
  var rotateAmount = Math.random() * circleRads * settings.rotateMax / 100;
  //var rotateAmount = Math.PI / 2;

  var angleEnd = angleStart + rotateAmount * rotateDir;

  var angle = angleEnd - angleStart;

  var center = {
    x: x - Math.cos(angleStart - Math.PI / 2) * radius * rotateDir,
    y: y - Math.sin(angleStart - Math.PI / 2) * radius * rotateDir
  }

  var dx = x - center.x;
  var dy = y - center.y;

  var geometry = {
    type: CURVED,
    center: center,
    radius: radius,
    start: {
      angle: angleStart,
      x: x,
      y: y,

      perp: {
        x: Math.cos(angleStart + Math.PI / 2),
        y: Math.sin(angleStart + Math.PI / 2)
      }

    },
    end: {
      angle: angleEnd,
      x: dx * Math.cos(angle) - dy * Math.sin(angle) + center.x,
      y: dx * Math.sin(angle) + dy * Math.cos(angle) + center.y,

      perp: {
        x: Math.cos(angleEnd + Math.PI / 2),
        y: Math.sin(angleEnd + Math.PI / 2)
      }
    },

    paths: [],


    angle: angleEnd,
    counterClockwise: rotateDir === -1,
    render: function() {
      var midPath = ((settings.paths - 1) * 6) / -2;
      for ( var i = 0; i < settings.paths; i++ ) {
        var pathRadius = radius + 6 * i * rotateDir + (rotateDir * midPath);

        var pathOffset = midPath + 6 * i;
        var pStart = {
          x: this.start.perp.x * pathOffset,
          y: this.start.perp.y * pathOffset
        }

        var pEnd = {
          x: this.end.perp.x * pathOffset,
          y: this.end.perp.y * pathOffset
        }

        var largeArcFlag = rotateAmount > Math.PI ? 1 : 0;//rotateDir === 1 ? 1 : 0;
        var sweepFlag = rotateDir === 1 ? 1 : 0;


        var path = [];

        if (isFirst) {
          path = [
            "M", this.start.x - pStart.x, this.start.y - pStart.y
          ];
        }
        path = path.concat([
          "A", 
          pathRadius, 
          pathRadius, 
          0, // x axis rotation
          largeArcFlag, // large arc flag
          sweepFlag, // sweep flag
          this.end.x - pEnd.x, 
          this.end.y - pEnd.y
        ]);

        this.paths[i] = path;


      }
    }
  }

  return geometry;

}

function calcStraight( x, y, angle, isFirst ) {
  var len = Math.random() * (settings.lineMax - settings.lineMin) + settings.lineMin;

  var geometry = {
    type: STRAIGHT,
    start: {
      angle: angle,
      x: x,
      y:y
    },
    end: {
      angle: angle,
      x: x + Math.cos(angle) * len,
      y: y + Math.sin(angle) * len
    },
    perp: {
      x: Math.cos(angle + Math.PI / 2),
      y: Math.sin(angle + Math.PI / 2)
    },

    paths: [],

    render: function() {
      var midPath = ((settings.paths - 1) * 6) / -2;
      for ( var i = 0; i < settings.paths; i++ ) {
        var pathOffset = midPath + 6 * i;
        var p = {
          x: this.perp.x * pathOffset,
          y: this.perp.y * pathOffset
        }

        if (isFirst) {
          var path = [
            "M", this.start.x - p.x, this.start.y - p.y,
            "L", this.end.x - p.x, this.end.y - p.y
          ]
        } else {
          var path = [
            "L", this.end.x - p.x, this.end.y - p.y
          ]
        }

        this.paths[i] = path;
      }
    }
  }

  return geometry;
}

function calcShape( x, y, angle, lastType, isFirst ) {
  if ( lastType == STRAIGHT || Math.random() > 0.5 ) {
    return calcArc( x, y, angle, isFirst );
  } else {
    return calcStraight( x, y, angle, isFirst );
  }
}


function isOnCanvas( geometry ) {
  return (geometry.end.x > 0 && geometry.end.x < wid && geometry.end.y > 0 && geometry.end.y < hei);
}



function calcLine( ) {

  stopDrawingPath();

  while(chart.childNodes.length > 0) {
    chart.removeChild(chart.firstChild);
  }

  generateStyles();

  var bg = svg.rect(chart, 0, 0, wid, hei, {"fill": shapedata.bgColour });

  var xp = wid / 4 + Math.random() * wid / 2;
  var yp = hei / 4 + Math.random() * hei / 2;

  var line = calcStraight( xp, yp, Math.random() * circleRads, true );
  shapedata.segments.push( line );

  while( isOnCanvas( line ) ) {
    line = calcShape( line.end.x, line.end.y, line.end.angle, line.type );
    shapedata.segments.push( line );
  }



  var shapes = [];
  for ( var i = 0; i < settings.paths; i++ ) {
    shapes[i] = "";
  }

  for ( var i = 0; i < shapedata.segments.length; i++ ) {
    shapedata.segments[i].render();
    // con.log(shapedata.segments[i]);

    var segments = shapedata.segments[i].paths;

    // there's a permutaiton of this code that draws each segment as a separate svg element, creating more pleaseant overlaps, but i prefer having one svg element for this effect.

/*
    for ( var j = 0; j < settings.paths; j++ ) {

      var shape = segments[j].join(" ")

      // var bg = svg.path(chart, shape, {
      //   // "stroke":bgColour,
      //   "stroke":getStrokeStyle( true, j ), 
      //   "stroke-width": getLineWidth( true, j ),
      //   "stroke-linecap": "cap",
      //   "fill": "none"
      // });

      var fg = svg.path(chart, shape, {
        "stroke":getStrokeStyle( false, j ), 
        "stroke-width": getLineWidth( false, j ),
        "stroke-linecap": "round",
        "fill": "none"
      });
    }  
*/

    for ( var j = 0; j < settings.paths; j++ ) {
      shapes[j] += segments[j].join(" ") + " ";
    }
    
  }
  

  for ( var j = 0; j < settings.paths; j++ ) {

    var bg = svg.path(chart, shapes[j], {
      "stroke":getStrokeStyle( true, j ), 
      "stroke-width": getLineWidth( true, j ),
      "fill": "none"
    });

    var fg = svg.path(chart, shapes[j], {
      "stroke":getStrokeStyle( false, j ), 
      "stroke-width": getLineWidth( false, j ),
      "fill": "none"
    });
    shapedata.fullpaths[j] = [bg,fg];
  }  
  

  startDrawingPath();
}


// using the stroke dash method to animate suggested by phrogz
// http://phrogz.net/svg/progressively-drawing-svg-path-via-dasharray.html

var lengths = [];
var distancePerPoint = 3;
var drawFPS = 60;
var timer;

function startDrawingPath(){
  for ( var j = 0; j < settings.paths; j++ ) {
    shapedata.fullpaths[j][0].style.stroke = '#fff';
    shapedata.fullpaths[j][1].style.stroke = '#fff';
    lengths[j] = 0;
  }
  // request animation frame was proving troublesome.
  increaseLength();
  timer = setInterval(increaseLength,1000/drawFPS);
}

function increaseLength(){
  
  for ( var j = 0; j < settings.paths; j++ ) {

    if (lengths[j] !== true ) {
      var bg = shapedata.fullpaths[j][0];
      var fg = shapedata.fullpaths[j][1];
      var pathLength = fg.getTotalLength();
      lengths[j] += distancePerPoint;
      
      var dash = [lengths[j],pathLength].join(' ');

      bg.style.stroke = getStrokeStyle( true, j );
      bg.style.strokeDasharray = dash;

      fg.style.stroke = getStrokeStyle( false, j );
      fg.style.strokeDasharray = dash;
      
      if (lengths[j] >= pathLength) {
        lengths[j] = true;
      }

      // con.log(j, lengths[j], pathLength);

    }

  }

  var finished = true;
  for ( var j = 0; j < settings.paths; j++ ) {
    if (lengths[j] !== true ) {
      finished = false;
    }
  }
  if (finished) stopDrawingPath();

}

function stopDrawingPath(){
  clearInterval(timer);
}










var gui = new dat.GUI();
// dat.GUI.toggleHide();
var pathsController = gui.add(settings, 'paths').min(1).max(10).step(1).onChange( update );
var paletteController = gui.add(settings, 'palette').min(0).max( palette.length ).step(1).onChange(update);
var radiusMinController = gui.add(settings, 'radiusMin').min(0).max(50).onChange(update);
var radiusMaxController = gui.add(settings, 'radiusMax').min(0).max(250).onChange(update);
var rotateMaxController = gui.add(settings, 'rotateMax').min(10).max(100).onChange(update);
var lineMinController = gui.add(settings, 'lineMin').min(1).max(400).onChange(update);
var lineMaxController = gui.add(settings, 'lineMax').min(1).max(400).onChange(update);

function update(val) {
  var prop = this.property;
  settings[prop] = ~~val;
  calcLine();
}

calcLine();
