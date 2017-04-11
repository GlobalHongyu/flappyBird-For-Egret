class Floor extends egret.DisplayObjectContainer{

	private floorValue;
	private timer : egret.Timer;
	private imagedata0;
	private imagedata1;

	public constructor(floorValue) {
		super();

		this.floorValue = floorValue;
		this.floorStart();
	}

	private floorStart(){

		this.imagedata0=new egret.Bitmap(RES.getRes('land_png'));
		var imgY=this.floorValue.stageH/3*2.4;
		this.imagedata0.width=this.floorValue.stageW+10;
		this.imagedata0.height=this.floorValue.stageH/4;
		this.imagedata0.x=0;
		this.imagedata0.y=imgY;
		this.imagedata1=new egret.Bitmap(RES.getRes('land_png'));
		this.imagedata1.width=this.floorValue.stageW+10;
		this.imagedata1.height=this.floorValue.stageH/4;
		this.imagedata1.x=this.floorValue.stageW+10;
		this.imagedata1.y=imgY;
		this.timer=new egret.Timer(100,0);
		this.timer.addEventListener(egret.TimerEvent.TIMER,this.start,this);
		this.addChildAt(this.imagedata0,2);
		this.addChildAt(this.imagedata1,2);
		this.timer.start();
	}

	private start(){

		this.imagedata0.x+this.floorValue.stageW<=0&&(this.imagedata0.x=this.imagedata1.x+this.floorValue.stageW+10);
		this.imagedata1.x+this.floorValue.stageW<=0&&(this.imagedata1.x=this.imagedata0.x+this.floorValue.stageW+10);
		
		var img1=this.imagedata0.x-20;
		var img2=this.imagedata1.x-20;
		egret.Tween.get(this.imagedata0).to({ x: img1 },100)
		egret.Tween.get(this.imagedata1).to({ x: img2 },100)
	}

	public floorStop():void{
		egret.Tween.removeTweens(this);
		this.timer.reset();
	}

	public Start(){
		this.timer.start();
	}

}