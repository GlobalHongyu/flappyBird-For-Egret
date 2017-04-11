
class Button extends egret.DisplayObjectContainer {
   
    private btnbackgroundImage: string ;
    private size = 1;
    private touchstart;
    private touchend ;
    private touchmove;
    
    private touch():void{};
    
    
    public constructor(btnjson) {
        super();
        
        this.size = btnjson.btnsize;
        this.btnbackgroundImage = btnjson.btnbackgroundImage ;
    
        this.touchstart = btnjson.touchstart ? btnjson.touchstart:this.touch;
        this.touchend = btnjson.touchend ? btnjson.touchend:this.touch;
        this.touchmove = btnjson.touchmove ? btnjson.touchmove:this.touch;
        
        this.onLoadComplete();
        
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onbtn,this);

        this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,this.onbtnend,this);

        this.addEventListener(egret.TouchEvent.TOUCH_END,this.onbtnend,this);
        
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.onbtnmove,this);
    }

    private onbtnmove(): void{
    
        this.touchmove();
        
    }

    private onLoadComplete(): void {


       var imgdata=new egret.Bitmap(RES.getRes(this.btnbackgroundImage));

        imgdata.touchEnabled = true;
        imgdata.scaleX=this.size;
        imgdata.scaleY=this.size;
        this.addChild(imgdata);
        this.anchorOffsetX = this.width / 2;
        this.anchorOffsetY = this.height / 2;
   


    }



    private onClick(event: MouseEvent): void {

        console.log("onClick");
        this.onbtnend();

    }

    public onbtn(event: Event): void {
       

        var colorMatrix = [
            1.8,0,0,0,100,
            0,1.8,0,0,100,
            0,0,1.8,0,100,
            0,0,0,1.8,0
        ];
        var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
        egret.Tween.get(this).to({
            scaleX : 0.8,
            scaleY : 0.8,
            filters: [colorFlilter]
        },100); 
        this.touchstart();
        
    }

    public onbtnend(): void {
        egret.Tween.get(this).to({
            scaleX: 1,
            scaleY: 1,
            filters: []
        },100);
        this.touchend();
    }


}


