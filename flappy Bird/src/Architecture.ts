class Architecture extends egret.DisplayObjectContainer{

	private ArchValue;			//传过来的 屏幕高度 屏幕宽度 小鸟包围盒
	private timer : egret.Timer;  //柱子定时器

	private pipe0;			//上面的柱子
	private pipe1;			//下面的柱子

	private after=true;

	public constructor(ArchValue) {

		super();
		
		
		this.ArchValue=ArchValue;
		this.column();
		this.x=ArchValue.stageW;
		
	}
	
	public changeAfter(){
		if(this.after){
			if(this.x+this.width<=this.ArchValue.stageW/3){
				this.after=false;
				return true;
			}
		}
	}

	private starts():void{
		
		var column0=this.x-24;
		egret.Tween.get(this).to({ x: column0 },120)

	}

	

	private pipe0Down : egret.Rectangle;

	private pipe1Up : egret.Rectangle;

	private stop0;

	private stop1;
//判断柱子与小鸟的碰撞
	public collision(bird){
	
	this.pipe0Down =  new egret.Rectangle(this.x,0,this.width,this.pipe1.y-200);

	this.pipe1Up =  new egret.Rectangle(this.x,this.pipe1.y,this.width,this.pipe1.height);

	this.stop0 = bird.intersects(this.pipe0Down);

	this.stop1 = bird.intersects(this.pipe1Up);

		if(this.stop0||this.stop1){return 1}

	}
//移除益出的柱子
	public remove():void{
		this.parent.removeChild(this);
	}
	public pipe(){
		return this;
	}

//柱子定时器停止
	public columnStop():void{
		egret.Tween.removeTweens(this);
		this.timer.reset();

	}
//柱子定时器开始
	public columnStart():void{

		this.timer.start();

	}
//创建柱子
	private column():void{

		this.pipe0=new egret.Bitmap(RES.getRes('pipe_down_png'));
		this.pipe0.pixelHitTest=true;
		this.addChild(this.pipe0);
		var pipe0Y= parseInt(String(Math.random()*this.height));
		this.pipe0.y=-pipe0Y;
		this.pipe0.scaleX=1.8;
		this.pipe0.scaleY=1.8;

		this.pipe1=new egret.Bitmap(RES.getRes('pipe_up_png'));
		this.pipe1.pixelHitTest=true;
		this.pipe1.y=this.height-pipe0Y+200;
		this.pipe1.scaleX=1.8;
		this.pipe1.scaleY=1.8;

		
		this.addChild(this.pipe1);

		this.timer=new egret.Timer(100,0);
		var self=this;
		this.timer.addEventListener(egret.TimerEvent.TIMER,this.starts,this);
		this.timer.start();
	}

	
}