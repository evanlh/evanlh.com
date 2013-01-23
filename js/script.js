// language toggle
$('#toggle-pt').click(function(){
	$('.en').hide();
	$('.pt').show();
});
$('#toggle-en').click(function(){
	$('.pt').hide();
	$('.en').show();
});

// cool generative art!

var svg = document.getElementById('canvas').getContext('2d');
svg.fillStyle = "#ccc";
svg.strokeStyle = "#ccc";

var Square = function(x,y,width) {
    this.x = x;
    this.y = y;
    this.width = width;
};
Square.prototype.draw = function(fill) {
    if (fill) {
        svg.fillRect(this.x - this.width / 2, this.y - this.width / 2, this.width, this.width);
   } else {
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

function partition(opts) {
    var opts = opts || {};
    var left = opts.left || 0,
        right = opts.right || 2040,
        top = opts.top || 0,
        bottom = opts.bottom || 2040,
        color = opts.color || '#ccc';

    console.log(opts);
    var cutoff = Math.round(Math.random()*100 + 5);
    if ((right - left) < cutoff || ( bottom - top) < cutoff) return;
    svg.fillStyle = color;
    svg.fillRect(left, top, right - left, bottom - top);

    var opts1 = {}, opts2 = {};
    var coin1 = Math.round(Math.random());
    var coin2 = Math.round(Math.random());
    if (coin1) { // divide vertically
        opts1.top = opts2.top = top;
        opts1.bottom = opts2.bottom = bottom;
        opts1.left = left;
        opts2.left = opts1.right = (left + ((right - left) / 2));
        opts2.right = right;
    } else { // divide horizontal
        opts1.left = opts2.left = left;
        opts1.right = opts2.right = right;
        opts1.top = top;
        opts2.bottom = bottom;
        opts1.bottom = opts2.top = (top + ((bottom - top) / 2));
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
partition();

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

