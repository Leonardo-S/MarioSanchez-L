game.PlayerEntity = me.Entity.extend ({
    init:function(x, y, settings){
        
        this._super(me.Entity, 'init',[x, y, {
                image:"leobot",
                spritewidth:"64",
                spriteheight:'64',
                width: 64,
                height: 64,
                getShape: function(){
                return (new me.Rect(0, 0, 64, 64)).toPolygon();
            }
        }]);
    //this is what helps me how my player looks like.
        this.renderable.addAnimation("idle", [39]);
        this.renderable.addAnimation("smallWalk", [143,144, 145, 146, 147, 148, 149, 150, 151], 159);
        
        this.renderable.setCurrentAnimation("idle");
      
        this.body.setVelocity(5, 20);
    },
    
    
    update:function(delta){
        //check if right button is pressed
        if(me.input.isKeyPressed("right")){
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            //this line says to unflip the aniimation 
            this.flipX(false);
        }else{
            this.body.vel.x = 0;
        }    
        if(me.input.isKeyPressed("left")){
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            this.flipX(true);
        }else{
            this.body.vel.x - 0;
        } 
        if (me.input.isKeyPressed('jump')) {   
    if (!this.body.jumping && !this.body.falling) {
        // set current vel to the maximum defined value
        // gravity will then do the rest
        this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
        // set the jumping flag
        this.body.jumping = true;
        // play some audio 
        me.audio.play("jump");
    }
}
        //these are my controlles for my player
        me.collision.check(this, true, this.collideHandeler.bind(this) , true);
        //ydif is the position between mario and whatever he hits or lands on 
        if(this.body.vel.x !==0){
            if (!this.renderable.isCurrentAnimation("smallWalk")) {
                this.renderable.setCurrentAnimation("smallWalk");
                this.renderable.setAnimationFrame();            }
        }else{
            this.renderable.setCurrentAnimation("idle");
        }
        
        
        
        this.body.update(delta);
        this._super(me.Entity, "update", [delta]);
        return true;
   },
    
    collideHandeler: function(response) {
        
    }
    
});


game.LevelTrigger = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init',[x, y, settings]);
        this.body.onCollision = this.onCollision.bind(this);
        this.level = settings.level;
        this.xSpawn = settings.xSpawn;
        this.ySpawn = settings.ySpawn;
    },
    
    onCollision: function() {
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        me.levelDirector.loadLevel(this.level);
        me.state.current().resetPlayer(this.xSpawn, this.ySpawn);
    }
});

game.BadGuy = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init',[x, y, {
                image:"slimey",
                spritewidth:"60",
                spriteheight:'28',
                width: 60,
                height: 28,
                getShape: function(){
                return (new me.Rect(0, 0, 0, 128)).toPolygon();
            }
        }]);
    
    this.spritewidth = 60;
    var width = settings.width;
    x = this.pos.x;
    this.startX = x;
    this.endX = x + width - this.spritewidth;
    this.pos.x = x + width - this.spritewidth;
    this.updateBounds();
    
    this.alwaysUpdate = true;
    
    this.walkLeft = false;
    this.alive = true;
    this.type = "badguy";
    
    this.renderable.addAnimation("run",[0, 1, 2],80 );
    this.renderable.setCurrentAnimation("run");
    
    this.body.setVelocity(4, 6);
    },
    
    update: function(delta){
        this.body.update(delta);
        me.collision.check(this, true, this.collideHandler.bind(this),true);
        
        if(this.alive){
            if (this.walkLeft && this.pos.x <=this.startX){
                this.walkLeft = (false);
            }else if(!this.walkLeft && this.pos.x >=this.endX){
                this.walkLeft = true;
            }
            this.flipX(!this.walkLeft);
            this.body.vel.x += (this.walkLeft) ?-this.body.accel.x * me.timer.tick : this.body.accel.x * me.timer.tick;
            
        }else {
            me.world.removeChild(this);
        }
        
        this._super(me.Entity,"update", [delta]);
        return true;
    },
    
    collideHandler: function(){
//        if(response.b.type==='BadGuy')
    }
//    
    
    
});