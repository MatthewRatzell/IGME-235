class Bullet extends PIXI.Graphics{
    constructor(color=0xFFFFFF,x=0,y=0,width=4,height=6,xpos,ypos){
        super();
        //making the bullets the right color
        this.beginFill(color);
        //drawing the bullet
        this.drawRect(-2,-3,width,height);
        this.endFill();
        //setting the sprites data structure x and y to what we supplied in the construcot
        this.x = x;
        this.y = y;
        //figuring out and normalizing our directions
        let xMovement = (xpos-this.x)/400;
        let yMovement = (ypos-this.y)/300;
        this.fwd = {x:xMovement,y:yMovement};
        this.speed = 400;
        this.isAlive = true;
        Object.seal(this);
    }
    move(dt=1/60){
        this.x+=this.fwd.x*this.speed*dt;
        this.y+=this.fwd.y*this.speed*dt;
    }
}

class Duck extends PIXI.Sprite{
    constructor(x=0,y=0,q=0){
        super(app.loader.resources["media/gameSprites/duck.png"].texture);
        
        //setting the sprites data structure x and y to what we supplied in the construcot
        this.x = x;
        this.y = y;
        //if they spawn left they go right
        if(q==0){
            this.fwd = {x:1,y:0};
        }
        //else they spawn right then they go left and also get flipped
        else{
            this.fwd = {x:-1,y:0};
            this.scale.x = -1;
        }

        let speed = Math.floor(Math.random() * 400) + 0 ;
        this.speed = speed;
        this.isAlive = true;
    }
    move(dt=1/60){
        this.x+=this.fwd.x*this.speed*dt;
        this.y+=this.fwd.y*this.speed*dt;
    }
}