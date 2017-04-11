var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Floor = (function (_super) {
    __extends(Floor, _super);
    function Floor(floorValue) {
        var _this = _super.call(this) || this;
        _this.floorValue = floorValue;
        _this.floorStart();
        return _this;
    }
    Floor.prototype.floorStart = function () {
        this.imagedata0 = new egret.Bitmap(RES.getRes('land_png'));
        var imgY = this.floorValue.stageH / 3 * 2.4;
        this.imagedata0.width = this.floorValue.stageW + 10;
        this.imagedata0.height = this.floorValue.stageH / 4;
        this.imagedata0.x = 0;
        this.imagedata0.y = imgY;
        this.imagedata1 = new egret.Bitmap(RES.getRes('land_png'));
        this.imagedata1.width = this.floorValue.stageW + 10;
        this.imagedata1.height = this.floorValue.stageH / 4;
        this.imagedata1.x = this.floorValue.stageW + 10;
        this.imagedata1.y = imgY;
        this.timer = new egret.Timer(100, 0);
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.start, this);
        this.addChildAt(this.imagedata0, 2);
        this.addChildAt(this.imagedata1, 2);
        this.timer.start();
    };
    Floor.prototype.start = function () {
        this.imagedata0.x + this.floorValue.stageW <= 0 && (this.imagedata0.x = this.imagedata1.x + this.floorValue.stageW + 10);
        this.imagedata1.x + this.floorValue.stageW <= 0 && (this.imagedata1.x = this.imagedata0.x + this.floorValue.stageW + 10);
        var img1 = this.imagedata0.x - 20;
        var img2 = this.imagedata1.x - 20;
        egret.Tween.get(this.imagedata0).to({ x: img1 }, 100);
        egret.Tween.get(this.imagedata1).to({ x: img2 }, 100);
    };
    Floor.prototype.floorStop = function () {
        egret.Tween.removeTweens(this);
        this.timer.reset();
    };
    Floor.prototype.Start = function () {
        this.timer.start();
    };
    return Floor;
}(egret.DisplayObjectContainer));
__reflect(Floor.prototype, "Floor");
