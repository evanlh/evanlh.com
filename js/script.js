// language toggle
$('#toggle-pt').click(function(){
	$('.en').hide();
	$('.pt').show();
});
$('#toggle-en').click(function(){
	$('.pt').hide();
	$('.en').show();
});

// playing with misc generative techniques

var svg = document.getElementById('canvas').getContext('2d');
svg.fillStyle = "#ccc";
svg.strokeStyle = "#ccc";
var GRID = golden_ratio(2040);
var xxx = snap_to(window.innerWidth / 2 - 260);
var yyy = snap_to(50);
var www = snap_to(xxx + 260) - 26;

$('.main').css({left: xxx, top: yyy, width: www}).animate({opacity: 1});
$('canvas').css({opacity: 0}).delay(100).animate({opacity: 1}, 600);

window.setTimeout(refresh, 8000);
function refresh() {
    $('canvas').animate({opacity: 0}, {complete: function() {
        partition(); 
        $('canvas').animate({opacity: 1});
    }});
    window.setTimeout(refresh, 8000);
}

partition();

var Square = function(x,y,width) {
    this.x = x;
    this.y = y;
    this.width = width;
};
Square.prototype.draw = function(fill, color) {
    if (fill) {
        if (color) svg.fillStyle(color);
        svg.fillRect(this.x - this.width / 2, this.y - this.width / 2, this.width, this.width);
    } else {
        if (color) svg.strokeStyle(color);
        svg.strokeRect(this.x - this.width / 2, this.y - this.width / 2, this.width, this.width);
    }
};

var Circle = function(x,y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
};
Circle.prototype.draw = function(fill) {
    svg.beginPath();
    svg.arc(this.x, this.y, this.radius, Math.PI * 2, false);
    svg.closePath();
    if (fill) {
        svg.fill();
    } else {
        svg.stroke();
    }
};


var Voxel = function(x,y,z) {
    this.x = x;
    this.y = y;
    this.z = z;
};

Voxel.prototype.draw = function() {
    // TODO
    // project from 3d to 2d given camera pos and angle
    // adjust color based on depth
    // draw in 2d grid
    svg.fillStyle = "rgba(" + z + "," + z + "," + z + ",1)";
    svg.fillRect(this.x, this.y);
};

function voxel_map() {
}

function golden_ratio (max) {
    var arr = [];
    while (max >= 1) {
        arr.unshift(Math.round(max));
        max = max / 1.61803398875;
    }
    return arr;
}

function fibonacci (max) {
    var arr = [1,1], a = 1, b = 1, c;
    while ((c = a + b) <= max) {
        arr.push(c);
        a = b;
        b = c;
    }
    return arr;
}


function snap_to(val, values) {
    var lastlen, lasti, len;
    if (typeof(values) == 'undefined') values = GRID;
    for (i in values) {
        len = Math.abs(val - values[i]);
        if (lastlen != undefined && len >= lastlen) return values[lasti];
        lastlen = len;
        lasti = i;
    }
    return val;
};


function partition(opts) {
    var opts = opts || {};
    var left = opts.left || 0,
        right = opts.right || 2040,
        top = opts.top || 0,
        bottom = opts.bottom || 2040,
        color = opts.color || '#333';

    var cutoff = Math.round(Math.random()*50 + 10);

    if (Math.abs(right - left) < cutoff || Math.abs(bottom - top) < cutoff) return;
    svg.fillStyle = color;
    svg.fillRect(snap_to(left, GRID), snap_to(top, GRID), snap_to(right - left, GRID), snap_to(bottom - top, GRID));

    var opts1 = {}, opts2 = {};
    var coin1 = Math.round(Math.random());
    var coin2 = Math.round(Math.random());
    if (coin1) { // divide vertically
        opts1.top = opts2.top = top;
        opts1.bottom = opts2.bottom = bottom;
        opts1.left = left;
        opts2.left = opts1.right = Math.round(left + ((right - left) / 2));
        opts2.right = right;
    } else { // divide horizontal
        opts1.left = opts2.left = left;
        opts1.right = opts2.right = right;
        opts1.top = top;
        opts2.bottom = bottom;
        opts1.bottom = opts2.top = Math.round(top + ((bottom - top) / 2));
    }
    if (coin2) {
        opts1.color = '#333';
        opts2.color = '#fff';
    } else {
        opts1.color = '#fff';
        opts2.color = '#333';
    }
    partition(opts1);
    partition(opts2);
}


function linear_walk() {
    var objects = [];
    var size = 20;
    for (var x = 0; x <= 2040; x += size * 2) {
        for (var y = 0; y <= 2040; y += size * 2) {
            console.log(x);
            console.log(y);
            var s = new Square(x, y, size);
            var c = new Circle(x, y, size);
            s.draw();
            c.draw();
            objects.push(s);
            objects.push(c);
        }
        size += 10;
    }
}

function random_placement() {
    for (var i = 0; i <= 200; i++) {
        var x = Math.round(Math.random() * 2040);
        var y = Math.round(Math.random() * 2040);
        var asize = Math.round(Math.random() * 300);
        var bsize = Math.round(Math.random() * asize);

        var outer = Math.round(Math.random());
        if (outer) {
            var c = new Circle (x, y, asize);
            var s = new Square (x, y, bsize);
        } else {
            var c = new Circle (x, y, bsize);
            var s = new Square (x, y, asize);
        }

        s.draw();
        c.draw();
    }
}

function random_walk() {
    var x = Math.round(Math.random() * window.innerWidth);
    var y = Math.round(Math.random() * window.innerHeight);
    var step = 50;
    var size = 10;
    for (var i = 0; i <= 1000; i++) {
        var c = new Circle (x, y, size);
        var s = new Square (x, y, size);
        c.draw();
        s.draw();
        var stepx = Math.round(Math.random() * step - (step / 2));
        var stepy = Math.round(Math.random() * step - (step / 2));
        if (stepx > 0) {
            x = x + stepx + size;
        } else {
            x = x + stepx - size;
        }
        if (stepy > 0) {
            y = y + stepy + size;
        } else {
            y = y + stepy - size;
        }

    }
}

