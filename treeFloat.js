/**
 * .letter {
    position: absolute;
    font-size: 2em;
    display: block;
    text-align: center;
    width: .7em;
    height: 2em;
}

wordFloat('#section6 .side-header', ['十年生死两茫茫，不思量，自难忘', '人生若只如初见，何事秋风画悲扇']);

 * 
 * 
/ */


function wordFloat(element, word) {
    var wordChains = [];
    var container = document.querySelectorAll(element)[0];

    var windVal = 0,
        blowVal = 0,
        cycle = 80,
        cycleAmt = 0.03;

    var Segment = function(settings) {
        settings = settings || {};
        this.angle = settings.angle || 0;
        this.cycle = settings.cycle;

        this.x = settings.x || 0;
        this.y = settings.y || 0;


        this.element = document.createElement('span');
        this.element.classList.add('letter');
        this.element.textContent = settings.letter;
        this.element.style.color = colorCycle(this.cycle);
        container.appendChild(this.element);

        this.width = parseInt(window.getComputedStyle(this.element, null).getPropertyValue('width'), 10) + 5;
        this.height = parseInt(window.getComputedStyle(this.element, null).getPropertyValue('height'), 10) + 5;
    }

    Segment.prototype.getJoint = function() {
        var x = this.x + Math.cos(this.angle) * this.width,
            y = this.y + Math.sin(this.angle) * this.width;
        return {
            x: x,
            y: y
        };
    };

    Segment.prototype.render = function(el) {
        el.style.left = this.x + 'px';
        el.style.top = this.y + 'px';
        el.style.webkitTransform = "rotate(" + this.angle + "deg)";
        //this.element.style.color = colorCycle(this.cycle++);
    };

    var WordString = function(settings) {
        settings = settings || {};
        this.x = settings.x || 0;
        this.y = settings.y || 0;
        this.target = { x: 0, y: 0 },
            this.text = settings.text.split('');
        this.text.reverse().join('');

        this.segNum = settings.text.length;
        this.angle = (Math.random() * 360 - 180) * Math.PI / 180;
        this.segments = [];

        for (var s = 0; s < this.segNum - 1; s++) {
            this.segments.push(new Segment({
                letter: this.text[s], //字
                angle: (Math.random() * 360 - 180) * Math.PI / 180, //旋转角度
                cycle: cycle += cycleAmt //配色
            }));
        }
        //最后一个字
        this.segments.push(new Segment({
            x: this.x, //坐标x
            y: this.y, //坐标y
            angle: this.angle,
            letter: this.text[this.segNum - 1],
            cycle: cycle += cycleAmt
        }));
    }

    WordString.prototype.track = function(segment, x, y) {
        var dx = x - segment.x,
            dy = y - segment.y;

        segment.angle = Math.atan2(dy, dx);

        var w = segment.getJoint().x - segment.x,
            h = segment.getJoint().y - segment.y;

        return {
            x: x - w,
            y: y - h
        };
    }

    WordString.prototype.position = function(segmentA, segmentB) {
        segmentA.x = segmentB.getJoint().x;
        segmentA.y = segmentB.getJoint().y + 5;
    };

    WordString.prototype.update = function() {
        var curX = this.segments[this.segments.length - 1].x + windVal,
            reachTarget = { x: curX, y: window.innerHeight + 500 };

        this.target = this.track(this.segments[0], reachTarget.x, reachTarget.y);
        var track = this.track,
            target = this.target,
            position = this.position;

        this.segments.forEach(function(e, i, seg) {
            if (i !== 0) {
                target = track(e, target.x, target.y);
                position(seg[i - 1], seg[i]);
            }
        });
    };

    WordString.prototype.render = function() {
        this.segments.forEach(function(e) {
            e.render(e.element);
        });
    };

    WordString.prototype.destroy = function() {
        this.segments.forEach(function(e, i, arr) {
            e.element.remove();
        });
    }



    for (var w = 0; w < word.length; w++) {
        wordChains.push(new WordString({
            text: word[w],
            x: (window.innerWidth / word.length) * w,
            y: 0
        }));
    }

    function update() {
        for (var w = 0; w < word.length; w++) {
            wordChains[w].update();
            wordChains[w].render();
        }
        windVal = Math.sin(blowVal) * 75;
        blowVal += 0.1;
        requestAnimationFrame(update);
    }

    update();

    function colorCycle(cycle, bright, light) {
        bright = bright || 255;
        light = light || 0;
        cycle *= .1;
        var r = ~~(Math.sin(.3 * cycle + 0) * bright + light),
            g = ~~(Math.sin(.3 * cycle + 2) * bright + light),
            b = ~~(Math.sin(.3 * cycle + 4) * bright + light);

        return 'rgb(' + Math.min(r, 255) + ',' + Math.min(g, 255) + ',' + Math.min(b, 255) + ')';
    }
}