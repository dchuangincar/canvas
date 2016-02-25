/**
 * Created by dave on 16/2/25 10:07.
 */
'use strict';

function CvsComponent(context, left, top, width, height) {
    this.parent = context;
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
    this.bufferCanvas = document.createElement("canvas");
    this.bufferCanvas.width = width;
    this.bufferCanvas.height = height;
    this.bufferContext = this.bufferCanvas.getContext("2d");

    this.invalidate = function() {
        this.parent.clearRect(this.left, this.top, this.width, this.height);
    };

    this.draw = function() {
        this.invalidate();
        if (this.onDraw) {
            this.onDraw(bufferContext);
            this.parent.drawImage(this.bufferCanvas, this.left, this.top);
        }
        this.postDraw || this.postDraw();
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
        if (x != undefined && y != undefined && !this.isPointInComponent(x, y)) {
            return false; // 不属于此控件的事件,返回false
        }
        if (!this.on) return false;
        else return this.on(event);
    };
}

function CvsContainer(context, left, top, width, height) {
    this.prototype = new CvsComponent(context, left, top, width, height);

    this.children = [];

    this.prototype.addChild = function(child) {
        return this.children.append(child) - 1;
    };

    this.prototype.removeChild = function(index) {
        return this.children.splice(index, 1)[0];
    };

    this.draw = function() {
        this.invalidate();
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].draw(this.bufferContext);
        }
        this.parent.drawImage(this.bufferCanvas, this.left, this.top);
        this.postDraw || this.postDraw();
    }

    this.trigger = function(event, x, y) {
        if (x != undefined && y != undefined && this.isPointInComponent(x, y)) {
            for (var i = 0; i < this.children.length; i++) {

            }
        }
    }
}