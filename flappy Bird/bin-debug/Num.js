var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Num = (function (_super) {
    __extends(Num, _super);
    function Num() {
        var _this = _super.call(this) || this;
        _this.nowArry = [];
        _this.overArry = [];
        _this.numArry = ['font_048_png', 'font_049_png', 'font_050_png', 'font_051_png', 'font_052_png', 'font_053_png', 'font_054_png', 'font_055_png', 'font_056_png', 'font_057_png'];
        _this.changeNum(0);
        return _this;
    }
    Num.prototype.changeNum = function (num) {
        this.nowArry = [];
        this.removeChildren();
        this.num = String(num);
        this.numLength = this.num.length;
        for (var i = 0; i < this.numLength; i++) {
            this.nowArry.push(this.num[i]);
        }
        ;
        this.removeChildren();
        this.changeNow();
    };
    Num.prototype.changeNow = function () {
        var len = this.nowArry.length;
        var numWidth = 0;
        for (var i = 0; i < len; i++) {
            var imgdata = new egret.Bitmap(RES.getRes(this.numArry[String(this.nowArry[i])]));
            numWidth = imgdata.width * i;
            imgdata.x = numWidth;
            this.addChild(imgdata);
        }
        this.anchorOffsetX = this.width / 2;
        this.anchorOffsetY = this.height / 2;
    };
    return Num;
}(egret.DisplayObjectContainer));
__reflect(Num.prototype, "Num");
