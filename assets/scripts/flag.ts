const {ccclass} = cc._decorator;
import GameManager from "./GameManager";

@ccclass
export default class FlagController extends cc.Component {
    onBeginContact(contact:cc.PhysicsContact, self:cc.PhysicsCollider, other:cc.PhysicsCollider) {
        if (other.node.name === 'Player') {
            if (GameManager.instance) {
                GameManager.instance.winGame();
            }
        }
    }
}