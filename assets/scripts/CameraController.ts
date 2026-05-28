const {ccclass, property} = cc._decorator;

@ccclass
export default class CameraController extends cc.Component {
    @property(cc.Node)
    public playerNode: cc.Node | null = null;

    @property
    public minX: number = 0; 

    update (dt: number) {
        if (this.playerNode) {
            let targetX = this.playerNode.x;
            
            if (targetX < this.minX) {
                targetX = this.minX;
            }

            this.node.x = targetX;
        }
    }
}