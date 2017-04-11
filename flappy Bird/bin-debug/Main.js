//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Main.prototype.onAddToStage = function (event) {
        //设置加载进度界面
        //Config to load process interface
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        var loadValue = { 'stageW': stageW, 'stageH': stageH };
        this.loadingView = new LoadingUI(loadValue);
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    Main.prototype.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this); //延迟加载组资源加载完成
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this); //延迟加载组资源加载失败
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this); //延迟加载组资源加载进度
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this); //一个加载项加载失败时间
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    Main.prototype.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            var self = this;
            egret.Tween.get(this.loadingView).to({ alpha: 0 }, 100).call(function () {
                self.stage.removeChild(self.loadingView);
                self.createGameScene();
            });
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    Main.prototype.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    Main.prototype.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    Main.prototype.onResourceProgress = function (event) {
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    Main.prototype.createGameScene = function () {
        var self = this;
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        var measured = { 'stageW': stageW, 'stageH': stageH };
        var Mask = new egret.Sprite();
        Mask.graphics.beginFill(0x000000);
        Mask.graphics.drawRect(0, 0, stageW, stageH);
        Mask.graphics.endFill();
        Mask.alpha = 0;
        var num = 0;
        var firstTouchImage;
        var integralNum;
        //背景
        var backgroundimg;
        //小鸟
        var bird;
        function touchOver() {
            bird.jump();
        }
        //柱子   
        var columnArry = [];
        var ArchitextureTimer = new egret.Timer(100, 0);
        var columnNum = 0;
        ArchitextureTimer.addEventListener(egret.TimerEvent.TIMER, function () {
            if (columnNum >= 16) {
                var Architexture = new Architecture(measured);
                this.addChildAt(Architexture, 1);
                columnArry.push(Architexture);
                columnNum = 0;
                if ((columnArry[0].x + columnArry[0].width) < 0) {
                    columnArry[0].remove();
                    columnArry.shift();
                }
                if ((columnArry[0].x + columnArry[0].width) < 0) {
                    columnArry[0].remove();
                    columnArry.shift();
                }
            }
            columnNum++;
        }, this);
        // ArchitextureTimer.start();
        //地面 
        var floor;
        //暂停按钮
        var suspendBtnArry = { 'btnbackgroundImage': 'button_pause_png', 'touchstart': suspend, 'btnsize': 2 };
        var suspendBtn;
        suspendBtn = new Button(suspendBtnArry);
        suspendBtn.x = 100;
        suspendBtn.y = 300;
        //暂停方法
        function suspend() {
            self.removeChild(suspendBtn);
            self.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, touchOver, self.stage);
            self.removeEventListener(egret.Event.ENTER_FRAME, randem, self);
            ArchitextureTimer.reset();
            bird.birdSuspend();
            for (var i = 0; i < collisionLength; i++) {
                columnArry[i].columnStop();
            }
            floor.floorStop();
            self.addChildAt(birdContinueBtn, 5);
        }
        //继续按钮
        var birdContinueBtnArry = { 'btnbackgroundImage': 'button_resume_png', 'touchstart': birdContinue, 'btnsize': 2 };
        var birdContinueBtn = new Button(birdContinueBtnArry);
        birdContinueBtn.x = 100;
        birdContinueBtn.y = 300;
        //继续方法
        function birdContinue() {
            self.removeChild(birdContinueBtn);
            bird.fall();
            ArchitextureTimer.start();
            floor.Start();
            for (var i = 0; i < collisionLength; i++) {
                columnArry[i].columnStart();
            }
            self.addEventListener(egret.Event.ENTER_FRAME, randem, self); //监听碰撞
            self.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, touchOver, self.stage); //点击事件
            self.addChildAt(suspendBtn, 6);
        }
        //Stop方法
        var stopLength;
        var colorMatrix = [
            1.8, 0, 0, 0, 100,
            0, 1.8, 0, 0, 100,
            0, 0, 1.8, 0, 100,
            0, 0, 0, 1.8, 0
        ];
        var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
        function Stop() {
            self.removeChild(suspendBtn);
            egret.Tween.get(self).to({ filters: [colorFlilter] }).wait(100).to({ filters: [] });
            egret.Tween.removeTweens(bird);
            self.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, touchOver, self.stage);
            self.removeEventListener(egret.Event.ENTER_FRAME, randem, self);
            floor.floorStop();
            bird.birdStop();
            ArchitextureTimer.reset();
            stopLength = columnArry.length;
            for (var i = 0; i < stopLength; i++) {
                columnArry[i].columnStop();
            }
            var idTimeout = egret.setTimeout(function () {
                GameOver();
            }, this, 700);
        }
        //游戏结束
        function GameOver() {
            var imgdata = new egret.Bitmap(RES.getRes('text_game_over_png'));
            imgdata.scaleX = 2;
            imgdata.scaleY = 2;
            imgdata.anchorOffsetX = imgdata.width / 2;
            imgdata.x = stageW / 2;
            imgdata.y = stageH / 4;
            self.addChild(imgdata);
            var startValue = { 'btnbackgroundImage': 'button_play_png', 'btnsize': 2 };
            var start = new Button(startValue);
            start.x = stageW / 4;
            start.y = stageH / 3 * 2.2;
            self.addChildAt(start, 5);
            var rackValue = { 'btnbackgroundImage': 'button_score_png', 'btnsize': 2 };
            var rack = new Button(rackValue);
            rack.x = stageW / 4 * 3;
            rack.y = stageH / 3 * 2.2;
            self.addChildAt(rack, 5);
            start.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
                self.addChildAt(Mask, 66);
                egret.Tween.get(Mask).to({ alpha: 1 }, 200).call(function () {
                    self.removeChildAt(5);
                    self.removeChildAt(1);
                    Start();
                }).to({ alpha: 0 }, 200).call(function () {
                    //self.removeChild(Mask);
                });
            }, this);
        }
        //重新开始按钮
        var startBtnArry = { 'btnbackgroundImage': 'button_restart_png', 'touchstart': Start, 'btnsize': 1.5 };
        var startBtn = new Button(startBtnArry);
        startBtn.x = 200;
        startBtn.y = 200;
        this.addChildAt(startBtn, 11);
        //重新开始方法
        function Start() {
            num = 0;
            self.removeChildren();
            backgroundimg = new BackgroundImage(measured);
            self.addChildAt(backgroundimg, 1);
            firstTouchImage = new egret.Bitmap(RES.getRes('tutorial_png'));
            firstTouchImage.scaleX = 2;
            firstTouchImage.scaleY = 2;
            firstTouchImage.x = stageW / 2 - firstTouchImage.width;
            firstTouchImage.y = stageH / 2 - firstTouchImage.height;
            self.stage.addChildAt(firstTouchImage, 66);
            integralNum = new Num();
            integralNum.x = stageW / 2;
            integralNum.y = stageH / 4;
            integralNum.scaleX = 2;
            integralNum.scaleY = 2;
            self.addChildAt(integralNum, 10);
            bird = new Bird(measured);
            bird.x = stageW / 3;
            bird.y = stageH / 2;
            self.addChildAt(bird, 2);
            floor = new Floor(measured);
            self.addChildAt(floor, 100);
            columnArry = [];
            self.touchEnabled = true;
            self.addEventListener(egret.TouchEvent.TOUCH_BEGIN, firstTouch, self);
        }
        function firstTouch() {
            //暂停按钮
            self.addChildAt(suspendBtn, 6);
            self.stage.removeChild(firstTouchImage);
            ArchitextureTimer.start();
            floor.Start();
            bird.fall();
            self.addEventListener(egret.Event.ENTER_FRAME, randem, self); //点击事件
            self.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, firstTouch, self);
            self.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, touchOver, self.stage);
        }
        //刚进入游戏
        function firstGame() {
            backgroundimg = new BackgroundImage(measured);
            self.addChildAt(backgroundimg, 1);
            bird = new Bird(measured);
            bird.x = stageW / 2 + bird.width / 2;
            bird.y = stageH / 3 * 1.4;
            self.addChildAt(bird, 5);
            egret.Tween.get(bird, { loop: true }).to({ y: stageH / 3 * 1.4 + 40 }, 400).to({ y: stageH / 3 * 1.4 }, 400);
            floor = new Floor(measured);
            self.addChildAt(floor, 5);
            var rateValue = { 'btnbackgroundImage': 'button_rate_png', 'btnsize': 2 };
            var rate = new Button(rateValue);
            rate.x = stageW / 2;
            rate.y = stageH / 3 * 1.8;
            self.addChildAt(rate, 5);
            var flappybirdValue = { 'btnbackgroundImage': 'title_png', 'btnsize': 2 };
            var flappybird = new Button(flappybirdValue);
            flappybird.x = stageW / 2;
            flappybird.y = stageH / 3;
            self.addChildAt(flappybird, 5);
            var startValue = { 'btnbackgroundImage': 'button_play_png', 'btnsize': 2 };
            var start = new Button(startValue);
            start.x = stageW / 4;
            start.y = stageH / 3 * 2.2;
            self.addChildAt(start, 5);
            var rackValue = { 'btnbackgroundImage': 'button_score_png', 'btnsize': 2 };
            var rack = new Button(rackValue);
            rack.x = stageW / 4 * 3;
            rack.y = stageH / 3 * 2.2;
            self.addChildAt(rack, 5);
            start.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
                self.addChildAt(Mask, 66);
                egret.Tween.get(Mask).to({ alpha: 1 }, 200).call(function () {
                    self.removeChildAt(5);
                    self.removeChildAt(1);
                    Start();
                }).to({ alpha: 0 }, 200).call(function () {
                    //self.removeChild(Mask);
                });
            }, this); //开始游戏
        }
        firstGame(); //进入游戏
        //碰撞
        var birdCollision;
        var collisionLength;
        var birdAtr;
        this.addEventListener(egret.Event.ENTER_FRAME, randem, this);
        function randem() {
            birdAtr = bird.getBird();
            var gameOver = false;
            birdCollision = new egret.Rectangle(birdAtr.x - birdAtr.width / 2, birdAtr.y - birdAtr.height / 2, birdAtr.width - 5, birdAtr.height * 1.3);
            bird.y >= (stageH / 3 * 2.3 + bird.height) && Stop();
            collisionLength = columnArry.length;
            for (var i = 0; i < collisionLength; i++) {
                if (columnArry[i].changeAfter()) {
                    num += 1;
                    integralNum.changeNum(num);
                }
                gameOver = columnArry[i].collision(birdCollision);
                if (gameOver) {
                    Stop();
                }
            }
        }
    };
    return Main;
}(egret.DisplayObjectContainer));
__reflect(Main.prototype, "Main");
