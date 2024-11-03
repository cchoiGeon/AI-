import { db } from "../../../../config/firebase.config.js";

export class MyProfileRepository {
    async GetUserMainQuestion(uid) {
        try {
            return (await db.collection("대질문").doc(uid).get()).data();
        } catch (err) {
            console.error("myprofile/GetUserMainQuestion error:",err);
            throw err;
        }
    }
    async SaveMainQuestion(uid,saveMainQuestionDTO){
        try {
            await db.runTransaction(async (transaction) => {
                const mainQuestionRef = db.collection("대질문").doc(uid);
                const userRef = db.collection("유저").doc(uid);
    
                transaction.set(mainQuestionRef, {
                    data: saveMainQuestionDTO.data,
                });
                transaction.update(userRef, {
                    userCase: saveMainQuestionDTO.userCase,
                });
            });
        } catch (err) {
            console.error("myprofile/SaveMainQuestion error: ", err);
            throw err;
        }
    }
    
    async GetMainQuestion(caseNum) {
        try {
            return (await db.collection("대질문").doc(caseNum).get()).data() ?? null;
        } catch (err) {
            console.error("myprofile/GetMainQuestion error: ",err);
            throw err;
        }
    }
}