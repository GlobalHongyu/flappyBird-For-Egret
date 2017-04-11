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

class Main extends egret.DisplayObjectContainer {

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView: LoadingUI;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        //设置加载进度界面
        //Config to load process interface
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;
        let loadValue = {'stageW' : stageW, 'stageH' : stageH};
        this.loadingView = new LoadingUI(loadValue);
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);//延迟加载组资源加载完成
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);//延迟加载组资源加载失败
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);//延迟加载组资源加载进度
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);//一个加载项加载失败时间
        RES.loadGroup("preload");
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event: RES.ResourceEvent) {
        if (event.groupName == "preload") {
            var self = this;
            egret.Tween.get(this.loadingView).to({alpha:0},100).call(function(){
                self.stage.removeChild(self.loadingView);
                self.createGameScene();
            });
            
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event: RES.ResourceEvent) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event: RES.ResourceEvent) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event: RES.ResourceEvent) {

    }

    private textfield: egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */
  
    private createGameScene() {
        let self=this;
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;
        let measured={'stageW':stageW,'stageH':stageH}
        let Mask = new egret.Sprite();
        Mask.graphics.beginFill(0x000000);
        Mask.graphics.drawRect(0, 0, stageW, stageH);
        Mask.graphics.endFill();
        Mask.alpha = 0;
        let num=0;
        let firstTouchImage;
        let integralNum: Num;

//背景

        let backgroundimg:BackgroundImage;

//小鸟
        let bird:Bird;

        function touchOver(){
             bird.jump();
        } 

//柱子   
        
        let columnArry=[];
        var ArchitextureTimer=new egret.Timer(100,0);
        let columnNum=0;
        
        ArchitextureTimer.addEventListener(egret.TimerEvent.TIMER,function(){
        
        if(columnNum>=16){
        let Architexture = new Architecture(measured);

        this.addChildAt(Architexture,1);

        columnArry.push(Architexture);

        columnNum=0;

        if((columnArry[0].x+columnArry[0].width)<0){
            columnArry[0].remove();
            columnArry.shift();
        }
        if((columnArry[0].x+columnArry[0].width)<0){
            columnArry[0].remove();
            columnArry.shift();
        }
        }
        columnNum++;

        },this);      
       // ArchitextureTimer.start();


    
//地面 
        let floor :Floor;

 //暂停按钮
        let suspendBtnArry={'btnbackgroundImage':'button_pause_png','touchstart':suspend,'btnsize':2};
        let suspendBtn :Button;
        suspendBtn = new Button(suspendBtnArry);
        suspendBtn.x=100;
        suspendBtn.y=300;

//暂停方法
        function suspend(){
            self.removeChild(suspendBtn);
            self.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,touchOver,self.stage)
            self.removeEventListener(egret.Event.ENTER_FRAME,randem,self)
            ArchitextureTimer.reset();
            bird.birdSuspend();

            for(var i=0 ;i<collisionLength;i++){

            columnArry[i].columnStop();

            }

            floor.floorStop();

            self.addChildAt(birdContinueBtn,5);

        }

//继续按钮
        let birdContinueBtnArry={'btnbackgroundImage':'button_resume_png','touchstart':birdContinue,'btnsize':2};
        let birdContinueBtn = new Button(birdContinueBtnArry);
            birdContinueBtn.x=100;
            birdContinueBtn.y=300;

//继续方法
        function birdContinue(){
        
            self.removeChild(birdContinueBtn);
            bird.fall();
            ArchitextureTimer.start();
            floor.Start();

            for(var i=0 ;i<collisionLength;i++){

                columnArry[i].columnStart();

                }
            self.addEventListener(egret.Event.ENTER_FRAME,randem,self); //监听碰撞

            self.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN,touchOver,self.stage);//点击事件

            self.addChildAt(suspendBtn,6);   
        
        }




//Stop方法
        let stopLength;
        var colorMatrix = [
            1.8,0,0,0,100,
            0,1.8,0,0,100,
            0,0,1.8,0,100,
            0,0,0,1.8,0
        ];
        var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
    
        function Stop(){
            self.removeChild(suspendBtn);
            egret.Tween.get(self).to({filters : [ colorFlilter ]}).wait(100).to({filters : []});
            egret.Tween.removeTweens(bird);
            self.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,touchOver,self.stage)
            self.removeEventListener(egret.Event.ENTER_FRAME,randem,self)
            floor.floorStop();
            bird.birdStop();
            ArchitextureTimer.reset();
            stopLength=columnArry.length;
            for(var i=0;i<stopLength;i++){
            columnArry[i].columnStop();
            }
            var idTimeout= egret.setTimeout( function(){
                    GameOver();
            }, this, 700);
        }
//游戏结束

        function GameOver(){
            var imgdata=new egret.Bitmap(RES.getRes('text_game_over_png'));
            imgdata.scaleX=2;
            imgdata.scaleY=2;
            imgdata.anchorOffsetX=imgdata.width/2;
            imgdata.x=stageW/2;
            imgdata.y=stageH/4;
            self.addChild(imgdata);

            let startValue={ 'btnbackgroundImage':'button_play_png','btnsize':2};
            let start = new Button(startValue);
            start.x=stageW/4;
            start.y=stageH/3*2.2;
            self.addChildAt(start,5);

            let rackValue={ 'btnbackgroundImage':'button_score_png','btnsize':2};
            let rack = new Button(rackValue);
            rack.x=stageW/4*3;
            rack.y=stageH/3*2.2;
            self.addChildAt(rack,5);

            start.addEventListener(egret.TouchEvent.TOUCH_BEGIN,function(){
                self.addChildAt(Mask,66);

                egret.Tween.get(Mask).to({alpha:1},200).call(function(){
                self.removeChildAt(5);
                self.removeChildAt(1);
         
                Start();
                }).to({alpha:0},200).call(function(){
                //self.removeChild(Mask);
                });

            },this);

        }
//重新开始按钮

        let startBtnArry={'btnbackgroundImage':'button_restart_png','touchstart':Start,'btnsize':1.5};
        let startBtn = new Button(startBtnArry);
        startBtn.x=200;
        startBtn.y=200;
        this.addChildAt(startBtn,11);

//重新开始方法
        function Start(){
            num=0;
        self.removeChildren();

        backgroundimg=new BackgroundImage(measured);
        self.addChildAt(backgroundimg,1);

        firstTouchImage = new egret.Bitmap(RES.getRes('tutorial_png'));
        firstTouchImage.scaleX=2;
        firstTouchImage.scaleY=2;
        firstTouchImage.x=stageW/2-firstTouchImage.width;
        firstTouchImage.y=stageH/2-firstTouchImage.height;
        self.stage.addChildAt(firstTouchImage,66);


        integralNum = new Num();
        integralNum.x = stageW/2;
        integralNum.y = stageH/4;
        integralNum.scaleX=2;
        integralNum.scaleY=2;
        self.addChildAt(integralNum,10);


        bird=new Bird(measured);
        bird.x=stageW/3;
        bird.y=stageH/2;

        self.addChildAt(bird,2);

        floor= new Floor(measured);
        self.addChildAt(floor,100);

         
        columnArry=[];
        
        self.touchEnabled = true;
        self.addEventListener(egret.TouchEvent.TOUCH_BEGIN,firstTouch,self);        

        }
       function firstTouch(){
           
//暂停按钮
        self.addChildAt(suspendBtn,6);

        self.stage.removeChild(firstTouchImage);
        ArchitextureTimer.start();
        floor.Start();
        bird.fall();
        self.addEventListener(egret.Event.ENTER_FRAME,randem,self); //点击事件
        self.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,firstTouch,self)
        self.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN,touchOver,self.stage)

       }


//刚进入游戏

        function firstGame(){

            backgroundimg=new BackgroundImage(measured);
            self.addChildAt(backgroundimg,1);

            bird=new Bird(measured);
            bird.x=stageW/2+bird.width/2;
            bird.y=stageH/3*1.4;
            self.addChildAt(bird,5);
            egret.Tween.get(bird , {loop:true}).to({ y : stageH/3*1.4+40},400).to({y : stageH/3*1.4},400)

            floor= new Floor(measured);
            self.addChildAt(floor,5);

            let rateValue={ 'btnbackgroundImage':'button_rate_png','btnsize':2};
            let rate = new Button(rateValue);
            rate.x=stageW/2;
            rate.y=stageH/3*1.8;
            self.addChildAt(rate,5);


            let flappybirdValue={ 'btnbackgroundImage':'title_png','btnsize':2};
            let flappybird = new Button(flappybirdValue);
            flappybird.x=stageW/2;
            flappybird.y=stageH/3;
            self.addChildAt(flappybird,5);

            let startValue={ 'btnbackgroundImage':'button_play_png','btnsize':2};
            let start = new Button(startValue);
            start.x=stageW/4;
            start.y=stageH/3*2.2;
            self.addChildAt(start,5);

            let rackValue={ 'btnbackgroundImage':'button_score_png','btnsize':2};
            let rack = new Button(rackValue);
            rack.x=stageW/4*3;
            rack.y=stageH/3*2.2;
            self.addChildAt(rack,5);

            start.addEventListener(egret.TouchEvent.TOUCH_BEGIN,function(){
                self.addChildAt(Mask,66);

                egret.Tween.get(Mask).to({alpha:1},200).call(function(){
                self.removeChildAt(5);
                self.removeChildAt(1);
         
                Start();
                }).to({alpha:0},200).call(function(){
                //self.removeChild(Mask);
                });

            },this);//开始游戏

        }
        firstGame() //进入游戏

//碰撞
        let birdCollision: egret.Rectangle ;
        
        let collisionLength;

        let birdAtr;

        this.addEventListener(egret.Event.ENTER_FRAME,randem,this);
        
        function randem(){
        
        birdAtr=bird.getBird();

        let gameOver=false;
        
        birdCollision =  new egret.Rectangle(birdAtr.x-birdAtr.width/2,birdAtr.y-birdAtr.height/2,birdAtr.width-5,birdAtr.height*1.3);


        bird.y>=(stageH/3*2.3+bird.height)&&Stop();

        collisionLength=columnArry.length;
        for(var i=0 ;i<collisionLength;i++){
            if(columnArry[i].changeAfter()){
                num+=1;
            
                integralNum.changeNum(num);
            }
           gameOver= columnArry[i].collision(birdCollision);
           if(gameOver){Stop()}
        }

        
        }

       
    }

}


