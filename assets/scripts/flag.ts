const {ccclass, property} = cc._decorator;
import GameManager from "./GameManager";

@ccclass
export default class FlagController extends cc.Component {

    @property(cc.AudioClip)
    winClip: cc.AudioClip | null = null;
    private isTriggered: boolean = false;
    onBeginContact(contact:cc.PhysicsContact, self:cc.PhysicsCollider, other:cc.PhysicsCollider) {
        if (this.isTriggered) return;
        if (other.node.name === 'Player') {
            this.isTriggered = true;
            if (this.winClip) {
                cc.audioEngine.playEffect(this.winClip, false);
            }

            this.scheduleOnce(() => {
                if (GameManager.instance) {
                    GameManager.instance.winGame();
                }
            }, 1.0); 
        }
    }
}