const {ccclass, property} = cc._decorator;

@ccclass
export default class BlockController extends cc.Component {
    private isTriggered: boolean = false;

    // ⚠️ 記得去該磚塊的 PhysicsBoxCollider 把 Enabled Contact Listener 打勾！
    onBeginContact (contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
        if (this.isTriggered) return;

        if (otherCollider.node.name === 'Player') {
            const worldManifold = contact.getWorldManifold();
            const normal = worldManifold.normal;

            // 判斷玩家是否從「下方」用頭頂撞磚塊
            // 當玩家向上撞擊靜態磚塊時，法向量 normal.y 通常會接近 1 或 -1 (依群組順序而定)
            if (normal.y > 0.7 || normal.y < -0.7) {
                this.isTriggered = true;
                this.boxTriggered();
            }
        }
    }

    boxTriggered () {
        cc.log("問號磚塊被頂到了！");
        
        // 評分項：讓瑪利歐變大 (Scale 變成 1.5 倍) 
        let playerNode = cc.find("Canvas/Player"); 
        if (playerNode) {
            // 播放頂磚塊微微往上彈一下的動畫效果（自由發揮，或直接變大）
            playerNode.runAction(cc.scaleTo(0.2, 3, 3)); 
        }

        // 頂過之後可以換成「被頂過的空磚塊」圖片
        // let sprite = this.getComponent(cc.Sprite);
        // if (sprite) sprite.spriteFrame = ...
    }
}