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

    @property(cc.Node)
    public gameOverPanel: cc.Node | null = null;

    @property(cc.Label)
    public timerLabel: cc.Label | null = null;

    @property(cc.Label)
    public finalScoreLabel: cc.Label | null = null;

    @property(cc.Label)
    public finalTimeLabel: cc.Label | null = null;

    @property(cc.Label)
    public killScoreLabel: cc.Label | null = null;

    @property(cc.Label)
    public conclude: cc.Label | null = null;

    private isInvincible: boolean = false;  
    private score: number = 0;
    private life: number = 3;
    private spawnPos: cc.Vec2 | null= null;
    private timer: number = 60;
    private win: number = 0;

    // 🎯 新增：最強的全局結束狀態鎖
    private isGameEnded: boolean = false; 

    onLoad () {
        GameManager.instance = this;
        
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().gravity = cc.v2(0, -2000);
        if (this.playerNode) {
            this.spawnPos = this.playerNode.getPosition();
        }
        if (this.gameOverPanel) {
            this.gameOverPanel.active = false;
        }
        
        this.updateUI();
    }

    public addScore(points: number) {
        if (this.isGameEnded) return; // 遊戲結束後不給加分
        this.score += points;
        this.updateUI();
    }

    public loseLife() {
        // 🎯 防護：如果遊戲已經結束或正在無敵，直接略過
        if (this.isGameEnded || this.isInvincible) return;

        this.isInvincible = true;
        this.life--;

        if (this.life < 0) this.life = 0;
        this.updateUI();

        if (this.life <= 0) {
            this.isGameEnded = true; // 🎯 鎖死遊戲狀態
            this.gameOver();
        } else {
            this.respawnPlayer();
            this.scheduleOnce(() => {
                this.isInvincible = false;
            }, 1.0);
        }
    }

    private respawnPlayer() {
        if (this.playerNode && this.spawnPos) {
            this.playerNode.setPosition(this.spawnPos);
            let pc = this.playerNode.getComponent("Player") as any;
            if (pc) pc.resetFallFlag(); 

            let rb = this.playerNode.getComponent(cc.RigidBody);
            if (rb) rb.linearVelocity = cc.v2(0, 0);
        }
    }

    public winGame() {
        if (this.isGameEnded) return; // 🎯 防止連續觸發兩次勝利
        cc.log("You Win!");
        this.win = 1;
        this.isGameEnded = true; // 🎯 鎖死遊戲狀態
        this.gameOver();
    }

    private gameOver() {
        cc.log("Game Over Sequence Started!");
        
        // 1. 暫停物理引擎
        cc.director.getPhysicsManager().enabled = false;
        
        if (this.gameOverPanel) {
            this.gameOverPanel.active = true;
            
            if (this.conclude) {
                if(this.win > 0) {
                    this.conclude.string = `You Win!`;
                } else {
                    this.conclude.string = `Game Over`;
                }
            }
            if (this.finalScoreLabel) {
                this.finalScoreLabel.string = `Final Score: ${this.score + Math.floor(this.timer)*15 + this.win*1000 + this.life*500}`;
            }
            if (this.finalTimeLabel) {
                this.finalTimeLabel.string = `Final Time: ${Math.floor(this.timer)} s`;
            }
            if (this.killScoreLabel) {
                this.killScoreLabel.string = `Enemy Score: ${this.score}`;
            }
        }
    }

    public onRestartBtnClicked() {
        cc.director.loadScene("Game");
    }

    public onBackToMenuClicked() {
        cc.director.loadScene("Menu");
    }

    update (dt: number) {
        // 🎯 終極防線：只要遊戲一結束（包含勝利或死亡），update 後面的計時器代碼絕對不會再執行！
        if (this.isGameEnded) return;

        this.timer -= dt; 
        if (this.timerLabel) {
            this.timerLabel.string = `Time: ${Math.floor(this.timer)} s`;
        }
        
        if (this.timer <= 0) {
            this.timer = 0;
            this.isGameEnded = true; // 🎯 鎖死遊戲狀態，解決時間歸零的無限迴圈 Bug
            this.gameOver(); 
        }
    }

    private updateUI() {
        if (this.scoreLabel) this.scoreLabel.string = `Score: ${this.score}`;
        if (this.lifeLabel) this.lifeLabel.string = `Life: ${this.life}`;
    }
}