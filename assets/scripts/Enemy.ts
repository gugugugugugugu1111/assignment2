const {ccclass, property} = cc._decorator;

import GameManager from "./GameManager"; 
import Player from "./Player";

@ccclass
export default class EnemyController extends cc.Component {
    @property
    public moveSpeed: number = -150; 

    private rb: cc.RigidBody | null = null;

    onLoad () {
        this.rb = this.getComponent(cc.RigidBody);
    }

    update (dt: number) {
        if (this.rb) {
            this.rb.linearVelocity = cc.v2(this.moveSpeed, this.rb.linearVelocity.y);
        }
    }

    // 2.4.x 的碰撞回呼參數順序跟 3.x 不同
    onBeginContact (contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
        if (otherCollider.node.name === 'Player') {
            const worldManifold = contact.getWorldManifold();
            const normal = worldManifold.normal;

            // 判斷玩家是否從上方踩擊
            if (normal.y < -0.7 || normal.y > 0.7) { // 視你的碰撞群組順序，法線可能向上或向下
                // 玩家踩頭成功
                let playerCtrl = otherCollider.node.getComponent(Player);
                if (playerCtrl) {
                    playerCtrl.bounce(); 
                }
                
                if (GameManager.instance) {
                    GameManager.instance.addScore(100);
                }
                this.node.destroy();
            } else {
                // 側面相撞
                if (GameManager.instance) {
                    GameManager.instance.loseLife();
                }
            }
        } else if (otherCollider.node.name !== 'Ground') {
            // 碰到牆壁反轉方向
            this.moveSpeed *= -1;
        }
    }
}