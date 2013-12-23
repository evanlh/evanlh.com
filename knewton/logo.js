var id = 0;
var start, end, width = 1200, height = 236;
var debug = true;

function Node(x,y) {
    this.x = x;
    this.y = y;
    this.next = [];
    this.transition = undefined;
}
Node.prototype.add_next = function(node) {
    this.next.push(node);
};
Node.prototype.add_transition = function(node) {
    this.transition = node;
};
Node.prototype.toJSON = function() {
    return {x: this.x, y: this.y};
};

function Line(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
}

function Bit(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
    this.id = id++;
}
Bit.prototype.finish = function() {
    var randi;
    if (this.p2.next.length) {
        randi = Math.floor(Math.random()*(this.p2.next.length));
        this.p1 = this.p2;
        this.p2 = this.p2.next[randi];
    } else if (this.p2.transition) {
        if (this.p2.transition.x < this.p2.x) {
            this.p1 = this.p2.transition;
            randi = Math.floor(Math.random()*(this.p1.next.length));
            this.p2 = this.p1.next[randi];
        } else {
            this.p1 = this.p2;
            this.p2 = this.p2.transition;
        }
    }
};
Bit.dx = function(d, i) {
    return d.p2.x;
};
Bit.dy = function(d, i) {
    return d.p2.y;
};

var Animation = {
    width: 1200,
    height: 236,
    bit_speed: 1000,
    bit_count: 30,
    bit_color: '#ff0',
    border_size: "0",
    ease: 'cubic',
    paused: false,
    finished: 0,
    nodes: [{"x":0,"y":78},{"x":0,"y":109},{"x":0,"y":135},{"x":0,"y":178},{"x":0,"y":208},{"x":86,"y":113},{"x":86,"y":150},{"x":237,"y":114},{"x":302,"y":148},{"x":383,"y":124},{"x":486,"y":112},{"x":487,"y":148},{"x":489,"y":182},{"x":662,"y":115},{"x":615,"y":148},{"x":627,"y":183},{"x":761,"y":142},{"x":859,"y":112},{"x":860,"y":147},{"x":862,"y":182},{"x":1063,"y":113},{"x":1070,"y":148},{"x":1055,"y":184},{"x":1200,"y":120},{"x":1200,"y":150},{"x":1200,"y":158},{"x":1200,"y":172}, {"x":1200, "y": 140}, {"x":1200, "y": 103}],
    lines: [{"p1":0,"p2":5},{"p1":1,"p2":5},{"p1":2,"p2":6},{"p1":3,"p2":6},{"p1":4,"p2":6},{"p1":7,"p2":9},{"p1":9,"p2":10},{"p1":9,"p2":11},{"p1":14,"p2":16},{"p1":15,"p2":16},{"p1":16,"p2":17},{"p1":16,"p2":18},{"p1":21,"p2":23},{"p1":22,"p2":25},{"p1":22,"p2":26},{"p1":21,"p2":25},{"p1":22,"p2":27},{"p1":8,"p2":9},{"p1":9,"p2":12},{"p1":13,"p2":16},{"p1":16,"p2":19},{"p1":20,"p2":28}],
    transitions: [{"p1":5,"p2":7},{"p1":6,"p2":8},{"p1":10,"p2":13},{"p1":26,"p2":0},{"p1":25,"p2":2},{"p1":5,"p2":7},{"p1":10,"p2":13},{"p1":11,"p2":14},{"p1":12,"p2":15},{"p1":17,"p2":20},{"p1":18,"p2":21},{"p1":19,"p2":22},{"p1":28,"p2":1},{"p1":23,"p2":3}, {"p1":27,"p2":4}],
    // initially generated with:
    // vertices = d3.range(25).map(function(d) {
    //     return [Math.random() * (width + 400) - 200, Math.random() * (height + 400) - 200];
    // });
    vertices: [[577.2934533655643,152.67330820579082],[1327.7477085590363,-189.63387982547283],[1145.5975487828255,201.43066807836294],[-193.07308495044708,-191.44118021056056],[497.4662873893976,426.1081876559183],[-134.53534208238125,220.94707048218697],[-187.0026845484972,101.0025106947869],[0.8863434195518494,47.061046176590025],[640.0548923760653,145.31828950718045],[1122.3402932286263,-102.85446914564818],[584.7077313810587,-78.38233270309865],[1079.3944414705038,168.50472120661288],[82.77914002537727,221.6427753744647],[105.60563765466213,-42.821400886401534],[768.8683371990919,63.73009073454887],[1331.2616284936666,-162.93453942146152],[102.34725810587406,328.78993461932987],[947.8326372802258,219.3747496753931],[-156.4554013311863,-36.485802290961146],[76.44606195390224,71.83696148451418],[623.8541983067989,152.49391337763518],[83.80415141582489,254.79079692345113],[510.91566644608974,50.46764522790909],[235.11079028248787,207.23616396728903],[1327.9608510434628,16.570501191541553]],
    bits: [],
    init: function() {
        var self = this,
            lines;

        // turn nodes and lines into Nodes and Lines
        for (var i = 0; i < this.nodes.length; i++) {
            this.nodes[i] = new Node(this.nodes[i].x, this.nodes[i].y);
        }
        for (var j = 0; j < this.lines.length; j++) {
            this.lines[j] = new Line(this.lines[j].p1, this.lines[j].p2);
        }

        // setup the graph
        for (var l in this.lines) {
            if (this.lines.hasOwnProperty(l)) {
                this.nodes[this.lines[l].p1].add_next(this.nodes[this.lines[l].p2]);
            }
        }

        for (var t in this.transitions) {
            if (this.transitions.hasOwnProperty(t)) {
                this.nodes[this.transitions[t].p1].add_transition(this.nodes[this.transitions[t].p2]);
            }
        }

        this.svg = d3.select("#svg")
                .attr("width", this.width)
                .attr("height", this.height);
        this.svg
            .append("g");

        // user input (for building the graph)
        this.svg.on("click", function(d, i) {
            if (!debug) return;
            var m = d3.mouse(this);
            console.log(m);
            // self.nodes.push(new Node(m[0], m[1]));
        });
        this.setup_keys();

        // update queue
        this.update();
        // setInterval(function() {
        //     self.update();
        // }, 1500);
    },
    setup_keys: function() {
        var self = this;
        d3.select("body svg")
            .on("keydown", function() {
                if (!debug) return;
                var kc = d3.event.keyCode;
                if (typeof self.selection == "undefined") return;
                if (kc == 38) { //up
                    self.nodes[self.selection].y -= 1;
                } else if (kc == 40) { //down
                    self.nodes[self.selection].y += 1;
                } else if (kc == 39) { //right
                    self.nodes[self.selection].x += 1;
                } else if (kc == 37) { //left
                    self.nodes[self.selection].x -= 1;
                }
            });
    },
    update: function() {
        this.draw_voronoi();
        this.update_nodes();
        this.spawn_bits();
        this.draw_lines();
        this.update_bits();
    },
    update_nodes: function() {
        var self = this,
            nodes = this.svg.selectAll(".nodes")
                .data(this.nodes);
        nodes.attr("class", "update nodes");

        nodes.enter().append("circle")
            .attr("class", "enter nodes")
            .attr("cx", function(d, i) { return d.x; })
            .attr("cy", function(d, i) { return d.y; })
            .attr("r", function (d, i) {
                if (d.x == 0 || d.x == 1200) return self.border_size;
                else return "3px";
            })
            .on("click", function(d, i) {
                if (!debug) return;
                console.log(i);
                if (self.selection == undefined) {
                    self.selection = i;
                    d3.select(this).attr("class", "nodes selected");
                } else {
                    if (d3.event.shiftKey) {
                        self.lines.push({ p1: self.selection, p2: i });
                        console.log("added line from " + self.selection + " to " + i);
                    } else if (d3.event.altKey) {
                        self.transitions.push({ p1: self.selection, p2: i });
                        console.log("added transition from " + self.selection + " to " + i);
                    }
                    self.selection = undefined;
                }
            });

        nodes
            .attr("cx", function(d, i) { return d.x; })
            .attr("cy", function(d, i) { return d.y; });

        nodes.exit().remove();
    },
    draw_lines: function() {
        var self = this,
            lines = this.svg.selectAll(".lines")
                .data(this.lines);
        lines.attr("class", "update lines");

        lines.enter().append("line")
            .attr("class", "enter lines")
            .attr("x1", function(d, i) { return self.nodes[d.p1].x; })
            .attr("x2", function(d, i) { return self.nodes[d.p2].x; })
            .attr("y1", function(d, i) { return self.nodes[d.p1].y; })
            .attr("y2", function(d, i) { return self.nodes[d.p2].y; });
    },
    draw_voronoi: function() {
        var self = this;
        this.voronoi = this.svg.append("g").attr("class", "voronoi");

        // setup scrolling for parallax
        window.onscroll = function() {
            self.scrolled = true;
        };
        setInterval(function() {
            if (self.scrolled) {
                var scrolly = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop,
                    scrollx = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft,
                    offsety = - scrolly / 5,
                    offsetx = - scrollx / 5;
                self.scrolled = false;

                self.voronoi
                    .transition()
                    .duration(1000)
                    .ease('elastic')
                    .attr("transform", "translate(" + offsetx +  " " + offsety + ")");
            }
        }, 50);

        var path = this.voronoi.selectAll("path");

        this.svg.selectAll("circle.voronoi")
            .data(this.vertices.slice(1))
            .enter().append("circle.voronoi")
            .attr("transform", function(d) { return "translate(" + d + ")"; })
            .attr("r", 2);

        path = path.data(d3.geom.delaunay(this.vertices).map(function(d) { return "M" + d.join("L") + "Z"; }), String);
        path.exit().remove();
        path.enter().append("path").attr("class", "triangles").attr("d", String);

    },
    spawn_bits: function() {
        var randi;
        for (node in this.nodes) {
            if (this.nodes.hasOwnProperty(node)) {
                if (!this.nodes[node].next.length) continue;
                randi = Math.floor(Math.random()*(this.nodes[node].next.length));
                this.bits.push(new Bit(this.nodes[node], this.nodes[node].next[randi]));
            }
        }

        // if (Animation.bits.length < Animation.bit_count) {
        //     var n = Math.floor(Math.random()*Animation.nodes.length);
        //     if (!Animation.nodes[n].next.length) return;
        //     randi = Math.floor(Math.random()*(Animation.nodes[n].next.length));
        //     Animation.bits.push(new Bit(Animation.nodes[n], Animation.nodes[n].next[randi]));
        //     Animation.update_bits();
        //     window.setInterval(Animation.spawn_bits, Math.floor(Math.random()*1000));
        // }

        // randi = Math.floor(Math.random()*(this.nodes[0].next.length));
        // this.bits.push(new Bit(this.nodes[0], this.nodes[0].next[randi]));
    },
    update_bits: function() {
        var self = this,
            bits = this.svg.selectAll(".bits")
                .data(this.bits, function(d) { return d.id; });
        bits.attr("class", "update bits");

        bits.enter().append("circle")
            .attr("class", "enter bits")
            .attr("fill", self.bit_color)
            .attr("cx", function(d, i) { return d.p1.x; })
            .attr("cy", function(d, i) { return d.p1.y; })
            .attr("r", function(d,i) {
                return "3px";
            });

        bits.transition()
            .duration(self.bit_speed)
            .ease(self.ease)
            .attr("cx", Bit.dx)
            .attr("cy", Bit.dy)
            .each("end", self.end_transition);

        bits.exit().remove();
    },
    end_transition: function(d, i) {
        if (Animation.paused) return;
        Animation.finished++;
        if (Animation.finished == Animation.bits.length) {
            Animation.svg.selectAll('.bits')
                .transition()
                .duration(100)
                .attr("r", "4px")
                .each("end", function(d, i) {
                    d.finish();
                    d3.select(this)
                        .attr("cx", d.p1.x)
                        .attr("cy", d.p1.y)
                        .attr("r", "3px")
                        .transition()
                        .duration(Animation.bit_speed)
                        .ease(Animation.ease)
                        .attr("cx", d.p2.x)
                        .attr("cy", d.p2.y)
                        .each("end", Animation.end_transition);
                });
            Animation.finished = 0;
        }
    }
};

Animation.init();
