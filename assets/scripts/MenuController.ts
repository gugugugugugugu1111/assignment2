const {ccclass, property} = cc._decorator;

declare const firebase: any;

@ccclass
export default class MenuController extends cc.Component {
    
    public startGame() {
        cc.director.loadScene("Game"); 
    }

    public onLoginInfoClick() {
        if (typeof firebase === 'undefined') return;

        let nickname = prompt("請輸入暱稱：", "瑪利歐");

        if (nickname === null) return; 
        if (nickname.trim() === "") {
            alert("名稱不能為空");
            return;
        }

        firebase.auth().signInAnonymously().then(() => {
            const user = firebase.auth().currentUser;
            
            return user.updateProfile({
                displayName: nickname
            }).then(() => {
                alert(`登入成功\n歡迎回來${nickname}\nUID: ${user.uid.substring(0, 8)}...`);
            });
        }).catch((error: any) => {
            alert("登入失敗：" + error.message);
        });
    }

    public onLeaderboardClick() {
        if (typeof firebase === 'undefined') {
            alert("Firebase 尚未載入完成");
            return;
        }

        const scoreRef = firebase.database().ref('leaderboard');
        
        scoreRef.orderByChild('score').limitToLast(5).once('value', (snapshot: any) => {
            let record = "--- 排行榜 ---\n\n";
            let data: any[] = [];
            
            snapshot.forEach((child: any) => {
                data.push(child.val());
            });

            if (data.length === 0) {
                alert("沒有資料");
                return;
            }

            data.reverse().forEach((item, index) => {
                record += `第 ${index + 1} 名 | 玩家: ${item.username || "匿名"} | 分數: ${item.score}\n`;
            });

            alert(record);
        }).catch((error: any) => {
            alert("讀取排行榜失敗：" + error.message);
        });
    }
}