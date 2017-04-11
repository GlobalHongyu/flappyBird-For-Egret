var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Architecture = (function (_super) {
    __extends(Architecture, _super);
    function Architecture(ArchValue) {
        var _this = _super.call(this) || this;
        _this.after = true;
        _this.ArchValue = ArchValue;
        _this.column();
        _this.x = ArchValue.stageW;
        return _this;
    }
    Architecture.prototype.changeAfter = function () {
        if (this.after) {
            if (this.x + this.width <= this.ArchValue.stageW / 3) {
                this.after = false;
                return true;
            }
        }
    };
    Architecture.prototype.starts = function () {
        var column0 = this.x - 24;
        egret.Tween.get(this).to({ x: column0 }, 120);
    };
    //判断柱子与小鸟的碰撞
    Architecture.prototype.collision = function (bird) {
        this.pipe0Down = new egret.Rectangle(this.x, 0, this.width, this.pipe1.y - 200);
        this.pipe1Up = new egret.Rectangle(this.x, this.pipe1.y, this.width, this.pipe1.height);
        this.stop0 = bird.intersects(this.pipe0Down);
        this.stop1 = bird.intersects(this.pipe1Up);
        if (this.stop0 || this.stop1) {
            return 1;
        }
    };
    //移除益出的柱子
    Architecture.prototype.remove = function () {
        this.parent.removeChild(this);
    };
    Architecture.prototype.pipe = function () {
        return this;
    };
    //柱子定时器停止
    Architecture.prototype.columnStop = function () {
        egret.Tween.removeTweens(this);
        this.timer.reset();
    };
    //柱子定时器开始
    Architecture.prototype.columnStart = function () {
        this.timer.start();
    };
    //创建柱子
    Architecture.prototype.column = function () {
        this.pipe0 = new egret.Bitmap(RES.getRes('pipe_down_png'));
        this.pipe0.pixelHitTest = true;
        this.addChild(this.pipe0);
        var pipe0Y = parseInt(String(Math.random() * this.height));
        this.pipe0.y = -pipe0Y;
        this.pipe0.scaleX = 1.8;
        this.pipe0.scaleY = 1.8;
        this.pipe1 = new egret.Bitmap(RES.getRes('pipe_up_png'));
        this.pipe1.pixelHitTest = true;
        this.pipe1.y = this.height - pipe0Y + 200;
        this.pipe1.scaleX = 1.8;
        this.pipe1.scaleY = 1.8;
        this.addChild(this.pipe1);
        this.timer = new egret.Timer(100, 0);
        var self = this;
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.starts, this);
        this.timer.start();
    };
    return Architecture;
}(egret.DisplayObjectContainer));
__reflect(Architecture.prototype, "Architecture");
