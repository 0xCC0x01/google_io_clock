window.IOWA = window.IOWA || {};
IOWA.CountdownTimer = IOWA.CountdownTimer || {};
IOWA.CountdownTimer.Band = function(t, e, i, n, r) {
    this.canvasElement = t, this.parent = i, this.aShift = 2 * (e / 800), this.posShift = 0, this.strokeOffset = 0, this.digits = n, this.oldShape = r, this.currentShape = r, this.radius = 0, this.center = {
        x: 0,
        y: 0
    }, this.quality = e, this.isPlaying = !0, this.needsRedraw = !0, this.colors = [{
        hex: "#ffffff",
        ratio: 1,
        size: 1,
        oldSize: 1,
        active: !1,
        tween: null
    }, {
        hex: "#EDEEC0",
        ratio: 0,
        size: 0,
        oldSize: 0,
        active: !1,
        tween: null
    }, {
        hex: "#EF5350",
        ratio: 0,
        size: 0,
        oldSize: 0,
        active: !1,
        tween: null
    }, {
        hex: "#7397C3",
        ratio: 0,
        size: 0,
        oldSize: 0,
        active: !1,
        tween: null
    }, {
        hex: "#7EB77F",
        ratio: 0,
        size: 0,
        oldSize: 0,
        active: !1,
        tween: null
    }, {
        hex: "#78909C",
        ratio: 0,
        size: 0,
        oldSize: 0,
        active: !1,
        tween: null
    }]
};
IOWA.CountdownTimer.Band.prototype.changeShape = function(t) {
    clearTimeout(this.fadeTimer), this.fade("in"), this.oldShape = this.currentShape, this.currentShape = t, this.posShift = 0, this.tween && this.tween.kill(), this.tween = TweenMax.to(this, .7, {
        posShift: 1,
        ease: Elastic.easeInOut.config(1, 1),
        delay: 0,
        //onComplete: this.onChangeComplete,
        onCompleteParams: [this]
    }), this.isPlaying = !0
};
IOWA.CountdownTimer.Band.prototype.fade = function(t) {
    "in" === t ? (TweenMax.to(this.colors[0], 1, {
        size: 0
    }), TweenMax.to(this.colors[1], 1, {
        size: .25
    }), TweenMax.to(this.colors[2], 1, {
        size: .25
    }), TweenMax.to(this.colors[3], 1, {
        size: .25
    }), TweenMax.to(this.colors[4], 1, {
        size: .25
    }), TweenMax.to(this.colors[5], 1, {
        size: 0
    })) : "out" === t && (this.colors[0].hex = this.colors[5].hex, TweenMax.to(this.colors[0], 1, {
        size: 1
    }), TweenMax.to(this.colors[1], 1, {
        size: 0
    }), TweenMax.to(this.colors[2], 1, {
        size: 0
    }), TweenMax.to(this.colors[3], 1, {
        size: 0
    }), TweenMax.to(this.colors[4], 1, {
        size: 0
    }), TweenMax.to(this.colors[5], 1, {
        size: 0,
        onComplete: this.stopPlaying.bind(this)
    }))
};
IOWA.CountdownTimer.Band.prototype.onChangeComplete = function(t) {
    t.fadeTimer = setTimeout(function() {
        t.fade("out")
    }, 500 + 1e3 * Math.random())
};
IOWA.CountdownTimer.Band.prototype.setQuality = function(t) {
    this.quality = t, this.needsRedraw = !0
};
IOWA.CountdownTimer.Band.prototype.getColor = function(t) {
    var e, i = 0, n = 0;
    for (e = 0; e < this.colors.length; e++)
        n += this.colors[e].size;
    for (e = 0; e < this.colors.length; e++)
        if (this.colors[e].ratio = this.colors[e].size / n, i += this.colors[e].ratio, t <= i)
	    return this.colors[e].hex;
        return this.colors[0].hex
};
IOWA.CountdownTimer.Band.prototype.update = function() {
    if (this.isPlaying || this.parent.drawAll || this.needsRedraw) {
        var t = this.canvasElement.getContext("2d");
        t.save(), t.scale(this.parent.pixelRatio, this.parent.pixelRatio), t.lineWidth = this.parent.strokeWeight, t.lineJoin = t.lineCap = "round";
        var e = this.parent.bandGutter / 2,
            i = (this.parent.bandGutter + this.parent.bandPadding) / 2;
        t.clearRect(this.center.x - this.radius - e / 2, this.center.y - this.radius - i / 2, 2 * this.radius + e, 2 * this.radius + i);
        for (var n, r = this.digits[this.oldShape].points, s = this.digits[this.currentShape].points, o = 0; o < s.length; o++) {
            var a = o < s.length - 1 ? o + 1 : 0,
                l = this.radius * (r[a].x + (s[a].x - r[a].x) * this.posShift) + this.center.x,
                A = this.radius * (r[a].y + (s[a].y - r[a].y) * this.posShift) + this.center.y,
                h = (o + this.strokeOffset) / s.length;
            h > 1 && (h = (o + this.strokeOffset - s.length) / s.length);
            var u = this.getColor(h);
            if (u === n) t.lineTo(l, A);
            else {
                n && (t.strokeStyle = n, t.stroke());
                var c = this.radius * (r[o].x + (s[o].x - r[o].x) * this.posShift) + this.center.x,
                    d = this.radius * (r[o].y + (s[o].y - r[o].y) * this.posShift) + this.center.y;
                t.beginPath(), t.moveTo(c, d), t.lineTo(l, A), n = u
            }
        }
        t.strokeStyle = n, t.stroke(), this.strokeOffset -= this.aShift, this.strokeOffset > s.length ? this.strokeOffset = 0 : this.strokeOffset < 0 && (this.strokeOffset = s.length - 1), t.restore(), this.needsRedraw = !1
    }
};
IOWA.CountdownTimer.Band.prototype.shudder = function(t) {
    if (!this.isPlaying && t) this.isPlaying = !0, this.fade("in"), this.isShuddering = !0;
    else if (this.isShuddering && this.isPlaying && !t) {
        clearTimeout(this.fadeTimer);
        var e = this;
        this.fadeTimer = setTimeout(function() {
            e.fade("out")
        }, 500 + 1e3 * Math.random()), this.isShuddering = !1
    }
};
IOWA.CountdownTimer.Band.prototype.redraw = function() {
    this.needsRedraw = !0
};
IOWA.CountdownTimer.Band.prototype.renderFlat = function() {
    this.colors[0].size = 0, this.colors[1].size = 0, this.colors[2].size = 0, this.colors[3].size = 0, this.colors[4].size = 0, this.colors[5].size = 1, this.needsRedraw = !0
};
IOWA.CountdownTimer.Band.prototype.stopPlaying = function() {
    this.renderFlat(), this.isPlaying = !1
};

window.IOWA = window.IOWA || {};
IOWA.CountdownTimer = IOWA.CountdownTimer || {};
IOWA.CountdownTimer.MOBILE_BREAKPOINT = 501;
IOWA.CountdownTimer.MOBILE_MAX_BREAKPOINT = 768;
IOWA.CountdownTimer.TABLET_BREAKPOINT = 960;
IOWA.CountdownTimer.DESKTOP_BREAKPOINT = 1400;
IOWA.CountdownTimer.XLARGE_BREAKPOINT = 4e3;
IOWA.CountdownTimer.MAX_WIDTH = 1800;
IOWA.CountdownTimer.CENTER_OFFSET = 32;
IOWA.CountdownTimer.Core = function(e) {
    this.containerDomElement = e;
    this.containerDomElement.fire = function(){};
    this.isReady = !1;
    this.isPlaying = !1;
    this.needsCanvasReset = !0;
    this.mouseCoords = null;
    this.isMobile = this.containerDomElement.offsetWidth <= IOWA.CountdownTimer.MOBILE_MAX_BREAKPOINT;
    this.firstRun = !0;
    this.quality = this.isMobile ? 140 : 240;
    this.maxWidth = IOWA.CountdownTimer.MAX_WIDTH;
    this.canvasElement = document.createElement("canvas");
    this.countdownMargin = 100,
    this.bandGutter = 40,
    this.bandPadding = 8,
    this.strokeWeight = 3,
    this.pixelRatio = window.devicePixelRatio,
    this.unitsAdded = !1,
    this.drawAll = !1,
    this.posShift = 0,
    this.digits = [],
    this.onVisibilityChange = this.onVisibilityChange.bind(this),
    this.onResize = this.onResize.bind(this),
    this.onMouseMove = this.onMouseMove.bind(this),
    this.onFrame = this.onFrame.bind(this)
};
IOWA.CountdownTimer.Core.prototype.onVisibilityChange = function() {
    document.hidden ? this.pause() : this.play()
};
IOWA.CountdownTimer.Core.prototype.attachEvents = function() {
    this.containerDomElement.appendChild(this.canvasElement),
    document.addEventListener("visibilitychange", this.onVisibilityChange, !1),
    window.addEventListener("resize", this.onResize),
    this.containerDomElement.addEventListener("mousemove", this.onMouseMove)
};
IOWA.CountdownTimer.Core.prototype.detachEvents = function() {
    document.removeEventListener("visibilitychange", this.onVisibilityChange, !1),
    window.removeEventListener("resize", this.onResize),
    this.containerDomElement.removeEventListener("mousemove", this.onMouseMove)
};
IOWA.CountdownTimer.Core.prototype.setUp = function() {
    this.isReady || (this.getDigits(), this.lastNumbers = this.unitDistance(new Date), this.bands = this.createBands(), this.resetCanvas(), this.needsCanvasReset = !0, this.isReady = !0)
};
IOWA.CountdownTimer.Core.prototype.play = function() {
    this.isPlaying || (this.isReady || this.setUp(), this.isPlaying = !0, this.onFrame())
};
IOWA.CountdownTimer.Core.prototype.pause = function() {
    this.isPlaying && (this.isPlaying = !1)
};
IOWA.CountdownTimer.Core.prototype.checkTime = function() {
    var t = this.unitDistance(new Date);

    if (this.isMobile && this.firstRun) {
        this.bands[0].renderFlat(), this.bands[1].renderFlat(), this.bands[2].renderFlat(), this.bands[3].renderFlat(), this.bands[4].renderFlat(), this.bands[5].renderFlat();
        var i = t.minutes % 10;
        this.bands[3].oldShape = i, this.bands[3].currentShape = i, this.firstRun = !1
    }(this.firstRun || this.lastNumbers.hours !== t.hours) && (this.bands[0].changeShape(Math.floor(t.hours / 10)), this.bands[1].changeShape(t.hours % 10)), (this.firstRun || this.lastNumbers.minutes !== t.minutes) && (this.bands[2].changeShape(Math.floor(t.minutes / 10)), this.bands[3].changeShape(t.minutes % 10)), (this.firstRun || this.lastNumbers.seconds !== t.seconds) && (this.bands[4].changeShape(Math.floor(t.seconds / 10)), this.bands[5].changeShape(t.seconds % 10)), this.lastNumbers = t, this.firstRun = !1
};
IOWA.CountdownTimer.Core.prototype.onFrame = function() {
    if (this.isPlaying) {
        if (this.needsCanvasReset && this.resetCanvas())
	    return void requestAnimationFrame(this.onFrame);
        this.mouseCoords && this.handleMouseShudder(), this.checkTime();
        var t, e = this.canvasElement.getContext("2d");
        for (e.save(), e.scale(this.pixelRatio, this.pixelRatio), this.drawAll && e.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height), e.restore(), this.unitsAdded && !this.drawAll || (this.addUnits(), this.unitsAdded = !0), t = 0; t < this.bands.length; t++)
	    this.bands[t].update();
        "horizontal" === this.format && this.addSeparators(), requestAnimationFrame(this.onFrame)
    }
};
IOWA.CountdownTimer.Core.prototype.unitDistance = function(e) {	
	return {
        hours: e.getHours(),
        minutes: e.getMinutes(),
        seconds: e.getSeconds()
    }
};
IOWA.CountdownTimer.Core.prototype.onMouseMove = function(t) {
    this.mouseCoords = {
        x: t.offsetX,
        y: t.offsetY
    }
};
IOWA.CountdownTimer.Core.prototype.handleMouseShudder = function() {
    for (var t = this.mouseCoords.x, e = this.mouseCoords.y, i = 0; i < this.bands.length; i++)
        t > this.bands[i].center.x - this.bands[i].radius && t < this.bands[i].center.x + this.bands[i].radius && e > this.bands[i].center.y - this.bands[i].radius && e < this.bands[i].center.y + this.bands[i].radius ? this.bands[i].shudder(!0) : this.bands[i].shudder(!1);
    this.mouseCoords = null
};
IOWA.CountdownTimer.Core.prototype.getFormat = function() {
    var t = this.containerDomElement.offsetWidth < IOWA.CountdownTimer.MOBILE_MAX_BREAKPOINT;
    this.format = t ? "stacked" : "horizontal"
};
IOWA.CountdownTimer.Core.prototype.setQuality = function(t) {
    this.quality = t, this.getDigits();
    for (var e = 0; e < this.bands.length; e++)
        this.bands[e].setQuality(this.quality)
};
IOWA.CountdownTimer.Core.prototype.createBands = function() {
    for (var t = 6, e = [], i = {
            digit_0: Math.floor(this.lastNumbers.hours / 10),
            digit_1: this.lastNumbers.hours % 10,
            digit_2: Math.floor(this.lastNumbers.minutes / 10),
            digit_3: this.lastNumbers.minutes % 10,
            digit_4: Math.floor(this.lastNumbers.seconds / 10),
            digit_5: this.lastNumbers.seconds % 10
        }, n = 0; n < t; n++) {
        var r = i["digit_" + n];
        e.push(new IOWA.CountdownTimer.Band(this.canvasElement, this.quality, this, this.digits, r))
    }
    return e
};
IOWA.CountdownTimer.Core.prototype.getBandCenter = function(t) {
    var e, i, n, r = this.containerDomElement.offsetWidth,
        s = "horizontal" === this.format ? this.containerDomElement.offsetWidth / 2 : this.containerDomElement.offsetWidth;
    return "horizontal" === this.format ? (n = Math.floor(t / 2), e = this.layout.x + this.layout.radius + 2 * this.layout.radius * t + this.bandPadding * t + n * (this.bandGutter - this.bandPadding), i = this.layout.y + this.layout.radius) : (n = Math.floor(t / 2), e = this.layout.x + this.layout.radius + 2 * this.layout.radius * t + this.bandPadding * t + n * (this.bandGutter - this.bandPadding), i = s / 2 - r / 4 + r / 24, n = Math.floor(t / 4), n > 0 && (i = s / 2 + r / 4 - r / 24, e -= r - 2 * this.countdownMargin + this.bandGutter)), {
        x: e,
        y: i
    }
};
IOWA.CountdownTimer.Core.prototype.addUnits = function() {
    var t = "horizontal" === this.format ? 82 : 32,
        e = this.canvasElement.getContext("2d");
    var i = this;
    var logo = new Image(); logo.src = "logo.png";
    logo.onload = function () {
        e.drawImage(logo, i.bands[5].center.x + i.layout.radius + i.bandPadding, i.bands[5].center.y - i.layout.radius);
    };
    e.font = "bold 16px verdana", e.fillStyle = "red", e.textAlign = "left", e.fillText("0xCC", this.bands[5].center.x + this.layout.radius + this.bandPadding, this.bands[5].center.y + this.layout.radius);
	
    e.save(), e.scale(this.pixelRatio, this.pixelRatio), e.font = "500 16px verdana", e.fillStyle = "#FFFFFF", e.textAlign = "center", e.fillText("Hour", this.bands[0].center.x + this.layout.radius + this.bandPadding / 2, this.bands[0].center.y + this.layout.radius + t), e.fillText("Minute", this.bands[2].center.x + this.layout.radius + this.bandPadding / 2, this.bands[2].center.y + this.layout.radius + t), e.fillText("Second", this.bands[4].center.x + this.layout.radius + this.bandPadding / 2, this.bands[4].center.y + this.layout.radius + t), e.restore()
};
IOWA.CountdownTimer.Core.prototype.addSeparators = function() {
    var t = this.canvasElement.getContext("2d");
    t.save(), t.scale(this.pixelRatio, this.pixelRatio);
    //for (var e = 0; e < this.separators.length; e++) t.clearRect(this.separators[e].x - 2, this.separators[e].y - 2, this.separators[e].w + 4, this.separators[e].h + 4), t.beginPath(), t.moveTo(this.separators[e].x, this.separators[e].y), t.lineTo(this.separators[e].x + this.separators[e].w, this.separators[e].y + this.separators[e].h), t.lineWidth = this.strokeWeight, t.strokeStyle = "#78909C", t.lineCap = "round", t.stroke();
    for (var e = 0; e < this.separators.length; e++) t.clearRect(this.separators[e].x - 2, this.separators[e].y - 2, this.separators[e].w + 4, this.separators[e].h + 4), t.beginPath(), t.arc(this.separators[e].x, this.separators[e].y, this.separators[e].w, 0,2*Math.PI), t.arc(this.separators[e].x, this.separators[e].y-30, this.separators[e].w, 0,2*Math.PI), t.fillStyle = "#78909C", t.fill(), t.stroke();
    t.restore()
};
IOWA.CountdownTimer.Core.prototype.getSeparators = function() {
    this.separators = [];
    for (var t = 1; t <= 2; t++) {
        var e = this.bands[2 * t].center.x - this.layout.radius - (this.bandPadding + this.bandGutter) / 2,
            i = this.bands[2 * t].center.y + this.layout.radius - this.bandGutter / 1.6;
        this.separators.push({
            x: e,
            y: i,
            w: this.bandGutter / 2,
            h: this.bandGutter / 1.8
        })
    }
};
IOWA.CountdownTimer.Core.prototype.getDigits = function() {
    for (var t = 0; t < 10; t++) {
        this.digits[t] = this.getPath("path-" + t);
    }
};
IOWA.CountdownTimer.Core.prototype.getPath = function(t) {
    for (var e = 66, i = document.getElementById(t), n = i.getTotalLength(), r = this.quality, s = [], o = 0; o < r; o++) {
        var a = o * n / r,
            l = i.getPointAtLength(a);
        s.push({
            x: (l.x - e) / e,
            y: (l.y - e) / e
        })
    }
    return {
        points: s
    }
};
IOWA.CountdownTimer.Core.prototype.getLayout = function() {
    var t = this.containerDomElement.offsetWidth,
        e = "horizontal" === this.format ? this.containerDomElement.offsetWidth / 2 : this.containerDomElement.offsetWidth;
    
    t < IOWA.CountdownTimer.MOBILE_BREAKPOINT ? (this.countdownMargin = 14, this.bandGutter = 16, this.bandPadding = 4) : t < IOWA.CountdownTimer.MOBILE_MAX_BREAKPOINT ? (this.countdownMargin = 14, this.bandGutter = 16, this.bandPadding = 4) : t < IOWA.CountdownTimer.TABLET_BREAKPOINT ? (this.countdownMargin = 40, this.bandGutter = 16, this.bandPadding = 4) : t < this.maxWidth ? (this.countdownMargin = 80, this.bandGutter = 16, this.bandPadding = 4) : t > this.maxWidth && (this.countdownMargin = Math.round((t - this.maxWidth) / 2), this.bandGutter = 32, this.bandPadding = 8),
    t < IOWA.CountdownTimer.MOBILE_BREAKPOINT ? this.strokeWeight = 2.5 : t < IOWA.CountdownTimer.MOBILE_MAX_BREAKPOINT ? this.strokeWeight = 3 : t < IOWA.CountdownTimer.TABLET_BREAKPOINT ? this.strokeWeight = 2.5 : t < IOWA.CountdownTimer.DESKTOP_BREAKPOINT ? this.strokeWeight = 3 : t < IOWA.CountdownTimer.XLARGE_BREAKPOINT && (this.strokeWeight = 4);
	var i = t - 2 * this.countdownMargin,
        n = e,
        r = (i - 2 * this.bandGutter - 3 * this.bandPadding) / 6 / 2,
        s = this.countdownMargin,
        o = n / 2 - r;
    "horizontal" === this.format && (o -= IOWA.CountdownTimer.CENTER_OFFSET), "stacked" === this.format && (r = (i - this.bandGutter - 2 * this.bandPadding) / 4 / 2), this.layout = {
        x: s,
        y: o,
        radius: r
    }
};
IOWA.CountdownTimer.Core.prototype.onResize = function() {
    this.needsCanvasReset = !0
};
IOWA.CountdownTimer.Core.prototype.resetCanvas = function() {
    if (!this.drawAll) {
        var t = this.canvasElement.getContext("2d");
        t.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height)
    }
    this.getFormat(), this.setCanvasSize(), this.getLayout(), this.unitsAdded = !1;
    for (var e = 0; e < this.bands.length; e++)
        this.bands[e].radius = this.layout.radius, this.bands[e].center = this.getBandCenter(e), this.bands[e].redraw();
    this.getSeparators(), this.needsCanvasReset = !1
};
IOWA.CountdownTimer.Core.prototype.setCanvasSize = function() {
    this.canvasElement.width = this.containerDomElement.offsetWidth * this.pixelRatio,
    this.canvasElement.height = "horizontal" === this.format ? this.containerDomElement.offsetWidth / 2 * this.pixelRatio : this.containerDomElement.offsetWidth * this.pixelRatio,
    this.canvasElement.style.width = this.containerDomElement.offsetWidth + "px",
    this.canvasElement.style.height = "horizontal" === this.format ? this.containerDomElement.offsetWidth / 2 + "px" : this.containerDomElement.offsetWidth + "px"
};
