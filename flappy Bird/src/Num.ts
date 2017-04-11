class Num extends egret.DisplayObjectContainer{

	private numArry;

	private numLength;

	private nowArry = [];

	private num;

	private overArry=[];

	public constructor() {
		super();

		this.numArry=['font_048_png','font_049_png','font_050_png','font_051_png','font_052_png','font_053_png','font_054_png','font_055_png','font_056_png','font_057_png'];
		
		this.changeNum(0);

	}

	public changeNum(num){
		this.nowArry=[];
		this.removeChildren();
		this.num =String(num);

		this.numLength=this.num.length;

		for(var i=0;i<this.numLength;i++){
			this.nowArry.push(this.num[i]);
		};
		this.removeChildren();
		this.changeNow();
	}

	private changeNow(){


		var len = this.nowArry.length;
		var numWidth = 0;
		
		for(var i=0;i<len;i++){
		
		var imgdata=new egret.Bitmap(RES.getRes(this.numArry[String(this.nowArry[i])]));

		numWidth = imgdata.width*i;

		imgdata.x = numWidth;
		
		this.addChild(imgdata);

		}

		this.anchorOffsetX = this.width / 2;
        this.anchorOffsetY = this.height / 2;
		
	}



}