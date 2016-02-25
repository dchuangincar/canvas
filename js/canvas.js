/**
 * Created by dave on 16/2/25 10:07.
 */
'use strict';

function CvsComponent(parent, left, top, width, height) {
    if (parent instanceof CvsContainer) {
        this.parent = parent;
        this.parentContext = parent.getContext();
        this.parent.addChild(this);
    } else {
        this.parent = null;
        this.parentContext = parent;
    }
    this.$key = "" + String(Math.random());
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
    this.bufferCanvas = document.createElement("canvas");
    this.bufferCanvas.width = width;
    this.bufferCanvas.height = height;
    this.bufferContext = this.bufferCanvas.getContext("2d");

    this.getKey = function() {
        return this.$key;
    };

    this.getContext = function() {
        return this.bufferContext;
    };

    this.invalidate = function() {
        this.bufferContext.clearRect(0, 0, this.width, this.height);
    };

    this.draw = function() {
        this.invalidate();
        if (this.onDraw) {
            this.onDraw.call(this, this.bufferContext);
            this.parentContext.drawImage(this.bufferCanvas, this.left, this.top, this.width, this.height);
        }
        console.log("drawing component: " + [this.left, this.top, this.width, this.height]);
    };

    this.isPointInComponent = function(x, y) {
        return x >= left && x <= left + width
            && y >= top && y <= top + height;
    };

    this.translate = function(x, y) {
        this.invalidate();
        this.bufferContext.translate(5, 10);
        if (this.onDraw) {
            this.onDraw.call(this, this.bufferContext);
            if (this.parent) {
                this.parent.drawImage(this.bufferCanvas, this.left, this.top, this.width, this.height);
            } else {
                this.parentContext.drawImage(this.bufferCanvas, this.left, this.top, this.width, this.height);
            }
        }
    };

    this.trigger = function(event, x, y) {
        //if (event.type != "mousemove") console.log([this, event, x, y]);
        if (x != undefined && y != undefined && !this.isPointInComponent(x, y)) {
            return false; // 不属于此控件的事件,返回false
        }
        if (!this.on) return false;
        else return this.on(event);
    };
}

function CvsContainer(parent, left, top, width, height) {
    if (parent instanceof CvsContainer) {
        this.parent = parent;
        this.parentContext = parent.getContext();
        this.parent.addChild(this);
    } else {
        this.parent = null;
        this.parentContext = parent;
    }
    this.$key = "" + String(Math.random());
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
    this.bufferCanvas = document.createElement("canvas");
    this.bufferCanvas.width = width;
    this.bufferCanvas.height = height;
    this.bufferContext = this.bufferCanvas.getContext("2d");

    this.children = [];

    this.addChild = function(child) {
        return this.children.push(child) - 1;
    };

    this.removeChild = function(child) {
        var index = this.children.findIndex(function(c) {
            return c.$key == child.$key;
        });
        return this.children.splice(index, 1)[0];
    };

    this.getKey = function() {
        return this.$key;
    };

    this.getContext = function() {
        return this.bufferContext;
    };

    this.invalidate = function() {
        this.bufferContext.clearRect(0, 0, this.width, this.height);
    };

    this.draw = function() {
        this.invalidate();
        this.onDraw && this.onDraw.call(this, this.bufferContext);
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].draw();
        }
        this.parentContext.drawImage(this.bufferCanvas, this.left, this.top, this.width, this.height);
    };

    this.drawImage = function(img, left, top, width, height) {
        if (this.parent) {
            this.getContext().drawImage(img, left, top, width, height);
            this.parent.drawImage(this.bufferCanvas, this.left, this.top, this.width, this.height);
        } else {
            this.parentContext.drawImage(this.bufferCanvas, this.left, this.top, this.width, this.height);
        }
    };

    this.isPointInComponent = function(x, y) {
        return x >= left && x <= left + width
            && y >= top && y <= top + height;
    };

    this.translate = function(x, y) {
        this.bufferContext.translate(x, y);
        this.draw();
    };

    this.trigger = function(event, x, y) {
        if (x != undefined && y != undefined) {
            if (!this.isPointInComponent(x, y)) return false;
            for (var i1 = 0; i1 < this.children.length; i1++) {
                var result1 = this.children[i1].trigger(event, x - left, y - top);
                if (result1) return true;
            }
        } else {
            for (var i2 = 0; i2 < this.children.length; i2++) {
                var result2 = this.children[i2].trigger(event);
                if (result2) return true;
            }
        }
        return false;
    };
}