const {ccclass, property} = cc._decorator;
import GameManager from "./GameManager";

@ccclass
export default class Player extends cc.Component {
    @property
    public jumpForce: number = 900; // 2.4.x 物理引擎所需數值較大
    @property
    public moveSpeed: number = 400;
    @property
    public minX: number = -600;

    private rb: cc.RigidBody | null= null;
    private moveDirection: number = 0;
    private isFallingOut: boolean = false;

    onLoad () {
        this.rb = this.getComponent(cc.RigidBody);
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
                // 加上 if (this.rb) 確保安全
                if (this.rb) {
                    if (Math.abs(this.rb.linearVelocity.y) < 0.1) {
                        this.rb.linearVelocity = cc.v2(this.rb.linearVelocity.x, this.jumpForce);
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
        // 掉出地圖外扣命
        if (this.node.y < -500 && !this.isFallingOut) {
            this.isFallingOut = true;
            if (GameManager.instance) {
                GameManager.instance.loseLife();
            }
        }
    }

    public bounce () {
        // 加上 if (this.rb) 確保安全
        if (this.rb) {
            this.rb.linearVelocity = cc.v2(this.rb.linearVelocity.x, this.jumpForce * 0.8);
        }
    }
    public resetFallFlag() {
        this.isFallingOut = false;
    }
}

