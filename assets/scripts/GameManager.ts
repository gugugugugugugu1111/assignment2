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

    @property(cc.AudioClip)
    public bgmClip: cc.AudioClip | null = null;

    @property(cc.AudioClip)
    public dieClip: cc.AudioClip | null = null;

    @property(cc.AudioClip)
    public stompClip: cc.AudioClip | null = null; 

    @property(cc.AudioClip)
    public winClip: cc.AudioClip | null = null;

    @property(cc.AudioClip)
    public loseClip: cc.AudioClip | null = null;

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
        if (this.bgmClip) {
            cc.audioEngine.playMusic(this.bgmClip, true);
        }
        this.updateUI();
    }

    public addScore(points: number) {
        if (this.isGameEnded) return; 
        this.score += points;
        this.updateUI();
    }

    public loseLife() {
        if (this.isGameEnded || this.isInvincible) return;

        if (this.dieClip) cc.audioEngine.playEffect(this.dieClip, false);
        
        this.isInvincible = true;
        this.life--;

        if (this.life < 0) this.life = 0;
        this.updateUI();

        if (this.life <= 0) {
            this.isGameEnded = true; 
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
        if (this.isGameEnded) return; 
        cc.log("You Win!");
        cc.audioEngine.stopMusic();
        if (this.winClip) cc.audioEngine.playEffect(this.winClip, false);
        this.win = 1;
        this.isGameEnded = true; 
        this.gameOver();
    }

    private gameOver() {
        cc.log("Game Over Sequence Started!");
        cc.audioEngine.stopMusic(); 

        if (this.win > 0) {
            if (this.winClip)
            cc.audioEngine.playEffect(this.winClip, false);
        } else {
            if (this.loseClip)
            cc.audioEngine.playEffect(this.loseClip, false);
        }
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
                this.finalScoreLabel.string = `Final Score: ${this.score + Math.floor(this.timer)*50*this.win + this.win*1000 + this.life*500*this.win}`;
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

    public playStompSound() {
        if (this.stompClip) cc.audioEngine.playEffect(this.stompClip, false);
    }

    update (dt: number) {
        if (this.isGameEnded) return;

        this.timer -= dt; 
        if (this.timerLabel) {
            this.timerLabel.string = `Time: ${Math.floor(this.timer)} s`;
        }
        
        if (this.timer <= 0) {
            this.timer = 0;
            this.isGameEnded = true; 
            this.gameOver(); 
        }
    }

    private updateUI() {
        if (this.scoreLabel) this.scoreLabel.string = `Score: ${this.score}`;
        if (this.lifeLabel) this.lifeLabel.string = `Life: ${this.life}`;
    }
    
}