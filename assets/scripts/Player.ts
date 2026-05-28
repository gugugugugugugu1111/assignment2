const {ccclass, property} = cc._decorator;
import GameManager from "./GameManager";

@ccclass
export default class Player extends cc.Component {
    @property
    public jumpForce: number = 900; 
    @property
    public moveSpeed: number = 400;
    @property
    public minX: number = -600;

    @property(cc.AudioClip)
    public jumpClip: cc.AudioClip | null = null;

    @property(cc.AudioClip)
    public growClip: cc.AudioClip | null = null;

    @property(cc.AudioClip)
    public shrinkClip: cc.AudioClip | null = null;

    private rb: cc.RigidBody | null= null;
    private moveDirection: number = 0;
    private isFallingOut: boolean = false;
    private anim: cc.Animation | null = null;
    private currentAnim: string = "";
    private originalScaleX: number = 1;
    onLoad () {
        this.rb = this.getComponent(cc.RigidBody);
        this.anim = this.getComponent(cc.Animation);
        this.originalScaleX = Math.abs(this.node.scaleX);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDestroy () {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown (event: cc.Event.EventKeyboard) {
        switch(event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                this.moveDirection = -1;
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this.moveDirection = 1;
                break;
            case cc.macro.KEY.w:
            case cc.macro.KEY.up:
            case cc.macro.KEY.space:
                if (this.rb) {
                    if (Math.abs(this.rb.linearVelocity.y) < 0.1) {
                        this.rb.linearVelocity = cc.v2(this.rb.linearVelocity.x, this.jumpForce);
                        if (this.jumpClip) cc.audioEngine.playEffect(this.jumpClip, false);
                    }              
                }
                break;
        }
    }

    onKeyUp (event: cc.Event.EventKeyboard) {
        switch(event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this.moveDirection = 0;
                break;
        }
    }

    update (dt: number) {
        if (this.rb) {
            this.rb.linearVelocity = cc.v2(this.moveDirection * this.moveSpeed, this.rb.linearVelocity.y);
        }
        if (this.node.x < this.minX) {
            this.node.x = this.minX;
        }
        if (this.node.y < -500 && !this.isFallingOut) {
            this.isFallingOut = true;
            if (GameManager.instance) {
                GameManager.instance.loseLife();
            }
        }

        if (this.moveDirection > 0) {
            this.node.scaleX = this.originalScaleX;
        } else if (this.moveDirection < 0) {
            this.node.scaleX = -this.originalScaleX;
        }
        let animState = "idle"; 
        if(this.rb){
            if (Math.abs(this.rb.linearVelocity.y) > 0.1) {
                animState = "jump"; 
            } else if (this.moveDirection !== 0) {
                animState = "walk"; 
            }
        }
        

        if (this.anim && this.currentAnim !== animState) {
            this.anim.play(animState);
            this.currentAnim = animState;
        }
    }

    public bounce () {
        if (this.rb) {
            this.rb.linearVelocity = cc.v2(this.rb.linearVelocity.x, this.jumpForce * 0.8);
        }
    }
    public resetFallFlag() {
        this.isFallingOut = false;
    }

    public grow() {
    this.originalScaleX *= 2; 
    if (this.growClip) {
            cc.audioEngine.playEffect(this.growClip, false);
        }
    cc.tween(this.node)
        .to(0.2, { scale: this.originalScaleX * 1.2 }, { easing: 'backOut' }) 
        .to(0.1, { scale: this.originalScaleX }) 
        .start();
    this.scheduleOnce(() => {
            this.shrink();
        }, 10);
    cc.log("瑪利歐成長了！新的縮放基準為: " + this.originalScaleX);
    }
    public shrink() {


        this.originalScaleX /= 2; 

        cc.tween(this.node)
            .to(0.2, { scale: this.originalScaleX * 0.8 }, { easing: 'backOut' }) 
            .to(0.1, { scale: this.originalScaleX }) 
            .start();

        cc.log("10秒到了，瑪利歐變回原狀！");
    }
}

