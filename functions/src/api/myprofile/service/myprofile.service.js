import { GetMainQuestionResposne, GetUserMainQuestionResponse } from "../dto/myprofile.dto.js";
import { MyProfileRepository } from "../repository/myprofile.repositroy.js";

export class MyProfileService {
    constructor () {
        this.myProfileRepository = new MyProfileRepository;
    }
    async GetUserMainQuestion(uid) {
        try {
            const result = await this.myProfileRepository.GetUserMainQuestion(uid);
            if(!result){
                throw new Error('DATA_NOT_FOUND');
            }
            return new GetUserMainQuestionResponse(result);
        } catch (err) {
            console.error("myprofile/GetUserMainQuestion error: ",err);
            throw err;
        }
    }
    async SaveMainQuestion(uid,saveMainQuestionDTO) {
        try {
            await this.myProfileRepository.SaveMainQuestion(uid,saveMainQuestionDTO);
        } catch (err) {
            console.error("myprofile/SaveMainQuestion error: ",err);
            throw err;
        }
    }
    
    async GetMainQuestion(caseNum) {
        try {
            const result = await this.myProfileRepository.GetMainQuestion(caseNum);
            if(!result){
                throw new Error('DATA_NOT_FOUND');
            }
            return new GetMainQuestionResposne(result);
        } catch (err) {
            console.error("myprofile/GetMainQuestion error: ",err);
            throw err;
        }
    }

}