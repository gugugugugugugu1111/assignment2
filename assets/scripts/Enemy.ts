const {ccclass, property} = cc._decorator;

import GameManager from "./GameManager"; 
import Player from "./Player";

@ccclass
export default class Enemy extends cc.Component {
    @property
    public moveSpeed: number = 150; 
    
    @property
    public minX: number = -600;

    private rb: cc.RigidBody | null = null;
    private isDead: boolean = false; 
    private anim: cc.Animation | null = null;

    onLoad () {
        this.rb = this.getComponent(cc.RigidBody);
        this.anim = this.getComponent(cc.Animation);
        
        this.schedule(() => {
            if (!this.isDead) {
                this.node.scaleX *= -1; 
            }
        }, 0.2); 
    }

    update (dt: number) {
        if (this.isDead) return;

        if (this.rb) {
            this.rb.linearVelocity = cc.v2(this.moveSpeed, this.rb.linearVelocity.y);
        }
        
        if (this.node.x < this.minX) {
            this.node.destroy();
        }
    }

    onBeginContact (contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
        if (this.isDead) return;

        if (otherCollider.node.name === 'Player') {
            const worldManifold = contact.getWorldManifold();
            const normal = worldManifold.normal;

            if (normal.y < -0.7 || normal.y > 0.7) { 
                this.isDead = true; 
                if (this.rb) this.rb.linearVelocity = cc.v2(0, 0); 
                
                let playerCtrl = otherCollider.node.getComponent(Player);
                if (playerCtrl) {
                    playerCtrl.bounce(); 
                }
                
                if (GameManager.instance) {
                    GameManager.instance.addScore(500);
                }
                
                if (GameManager.instance) GameManager.instance.playStompSound();

                if (this.anim) {
                    this.anim.play("enemycrush"); 
                } 
                setTimeout(() => {
                    if (this.node && this.node.isValid) {
                        this.node.destroy();
                    }
                }, 500);
            } else {
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