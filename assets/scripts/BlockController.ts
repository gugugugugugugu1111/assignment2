const {ccclass, property} = cc._decorator;




@ccclass
export default class BlockController extends cc.Component {
    private isTriggered: boolean = false;
    @property(cc.SpriteFrame)
    emptyBlockSprite: cc.SpriteFrame | null = null;
    @property(cc.SpriteFrame)
    originBlockSprite: cc.SpriteFrame | null = null;

    @property(cc.String)
    spinAnimName: string = "block";

    @property(cc.AudioClip)
    hitSound: cc.AudioClip | null = null;

    onBeginContact (contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
        if (this.isTriggered) return;

        if (otherCollider.node.name === 'Player') {
            const worldManifold = contact.getWorldManifold();
            const normal = worldManifold.normal;

            if (Math.abs(normal.y) > 0.5 && otherCollider.node.y < this.node.y) {
                this.isTriggered = true;
                this.boxTriggered();
            }
        }
    }

    boxTriggered () {

        if (this.hitSound) {
            cc.audioEngine.playEffect(this.hitSound, false);
        }
        let playerNode = cc.find("Canvas/Player"); 
        if (playerNode) {
            let playerScript = playerNode.getComponent("Player");
            if (playerScript) {
                (playerScript as any).grow(); 
            }
        }

        let anim = this.getComponent(cc.Animation);
        if (anim) {
            anim.play(this.spinAnimName);
        }

        let sprite = this.getComponent(cc.Sprite);
        if (sprite && this.emptyBlockSprite !== null) {
            sprite.spriteFrame = this.emptyBlockSprite;
        }

        cc.tween(this.node)
            .by(0.1, { y: 15 }, { easing: 'quadOut' }) 
            .by(0.1, { y: -15 }, { easing: 'quadIn' }) 
            .start();
    }
}