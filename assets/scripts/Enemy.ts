const {ccclass, property} = cc._decorator;

import GameManager from "./GameManager"; 
import Player from "./Player";

@ccclass
export default class Enemy extends cc.Component {
    @property
    public moveSpeed: number = 150; 
    
    @property
    public minX: number = -600; // 🎯 新增：設定怪物最左邊界

    private rb: cc.RigidBody | null = null;
    private isDead: boolean = false; // 🎯 新增：死亡鎖定，避免一幀內重複觸發

    onLoad () {
        this.rb = this.getComponent(cc.RigidBody);
    }

    update (dt: number) {
        if (this.isDead) return;

        if (this.rb) {
            this.rb.linearVelocity = cc.v2(this.moveSpeed, this.rb.linearVelocity.y);
        }
        
        // 🎯 解決痛點：走到最左邊的世界盡頭時，直接自我銷毀
        if (this.node.x < this.minX) {
            this.node.destroy();
        }
    }

    onBeginContact (contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
        if (this.isDead) return;

        if (otherCollider.node.name === 'Player') {
            const worldManifold = contact.getWorldManifold();
            const normal = worldManifold.normal;

            // 判斷玩家是否從上方踩擊
            if (normal.y < -0.7 || normal.y > 0.7) { 
                this.isDead = true; // 鎖定狀態
                if (this.rb) this.rb.linearVelocity = cc.v2(0, 0); // 馬上停下
                
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
                // 🎯 核心修正：跳脫物理引擎的運算幀，避免 Box2D 碰撞箱壞死
                setTimeout(() => {
                    if (GameManager.instance) {
                        GameManager.instance.loseLife();
                    }
                }, 1);
            }
        } else if (otherCollider.node.name !== 'Ground') {
            const worldManifold = contact.getWorldManifold();
            const normal = worldManifold.normal;

            if (Math.abs(normal.x) > 0.5) {
                this.moveSpeed *= -1;
            }
        }
    }
}