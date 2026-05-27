const {ccclass, property} = cc._decorator;

@ccclass
export default class CameraController extends cc.Component {
    @property(cc.Node)
    public playerNode: cc.Node | null = null;

    @property
    public minX: number = 0; // 相機最左邊界（防止拍到地圖外面）

    update (dt: number) {
        if (this.playerNode) {
            // 讓相機的 X 座標等於玩家的 X 座標
            let targetX = this.playerNode.x;
            
            // 如果超出限制的最左邊界，才進行跟隨
            if (targetX < this.minX) {
                targetX = this.minX;
            }

            // 更新相機位置（Y 軸固定保持 0，不跟著上下晃動）
            this.node.x = targetX;
        }
    }
}