const {ccclass} = cc._decorator;
@ccclass
export default class MenuController extends cc.Component {
    public startGame() {
        cc.director.loadScene("Game"); 
    }
}