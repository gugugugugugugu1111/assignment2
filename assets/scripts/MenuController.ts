const {ccclass} = cc._decorator;
@ccclass
export default class MenuController extends cc.Component {
    public startGame() {
        cc.director.loadScene("Game"); // 點擊按鈕直接切換到遊戲主畫面
    }
}