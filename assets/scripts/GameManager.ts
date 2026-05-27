const {ccclass, property} = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {
    public static instance: GameManager | null = null;

    @property(cc.Label)
    public scoreLabel: cc.Label | null= null;

    @property(cc.Label)
    public lifeLabel: cc.Label | null = null;

    @property(cc.Node)
    public playerNode: cc.Node | null= null;

    private score: number = 0;
    private life: number = 3;
    private spawnPos: cc.Vec2 | null= null;

    onLoad () {
        GameManager.instance = this;
        
        // 2.4.x 啟用物理引擎的方式
        cc.director.getPhysicsManager().enabled = true;
        // 如果需要除錯顯示碰撞框，把下面這行解除註解
        // cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit | cc.PhysicsManager.DrawBits.e_shapeBit;

        if (this.playerNode) {
            this.spawnPos = this.playerNode.getPosition();
        }
        this.updateUI();
    }

    public addScore(points: number) {
        this.score += points;
        this.updateUI();
    }

    public loseLife() {
        this.life -= 1;
        this.updateUI();
        
        if (this.life <= 0) {
            this.gameOver();
        } else {
            this.respawnPlayer();
        }
    }

    private respawnPlayer() {
        if (this.playerNode && this.spawnPos) {
            this.playerNode.setPosition(this.spawnPos);
            let rb = this.playerNode.getComponent(cc.RigidBody);
            if (rb) {
                rb.linearVelocity = cc.v2(0, 0);
            }
        }
    }

    private gameOver() {
        cc.log("Game Over!");
        // cc.director.loadScene("GameOverScene"); 
    }

    private updateUI() {
        if (this.scoreLabel) this.scoreLabel.string = `Score: ${this.score}`;
        if (this.lifeLabel) this.lifeLabel.string = `Life: ${this.life}`;
    }
}