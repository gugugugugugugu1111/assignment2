
declare const firebase: any;
const {ccclass, property} = cc._decorator;

@ccclass
export default class FirebaseManager extends cc.Component {
    public static instance: FirebaseManager | null = null;
    public db: any = null;

    onLoad() {
        FirebaseManager.instance = this;
        const firebaseConfig = {
            apiKey: "AIzaSyBp587KuL4LT_7Z9nZ5VLY2_fbd-Y0YQ_U",
            authDomain: "mario-f22b2.firebaseapp.com",
            projectId: "mario-f22b2",
            storageBucket: "mario-f22b2.firebasestorage.app",
            messagingSenderId: "566756711606",
            appId: "1:566756711606:web:42e8ce74c3a4cf7ac01a17",
            measurementId: "G-521Y45XJL1",
            databaseURL: "https://mario-f22b2-default-rtdb.firebaseio.com"
        };

        if (typeof firebase !== 'undefined') {
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            this.db = firebase.database();
            
            // 執行匿名登入
            this.signIn();
        } else {
            cc.error("Firebase SDK 尚未載入");
        }
    }

    private signIn() {
        firebase.auth().signInAnonymously()
            .then(() => {
                cc.log("Firebase 匿名登入成功！");
            })
            .catch((error: any) => {
                cc.error("登入失敗:", error);
            });
    }

    // 將這個函數開放給 GameManager 呼叫
    public saveScore(score: number, time: number) {
        if (!this.db) return;
        
        const user = firebase.auth().currentUser;
        if (user) {
            // 寫入資料庫
            this.db.ref('leaderboard/' + user.uid).set({
                score: score,
                time: time,
                timestamp: Date.now()
            }).then(() => {
                cc.log("分數上傳成功！");
            }).catch((error: any) => {
                cc.error("分數上傳失敗:", error);
            });
        }
    }
}