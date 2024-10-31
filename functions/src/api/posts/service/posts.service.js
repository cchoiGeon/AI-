import { PostsRepository } from "../repository/posts.repositroy.js";

export class PostsService {
    constructor () {
        this.postRepository = new PostsRepository();
    }
    async savePostData(uid, saveDataDTO) {
        try {
           await this.postRepository.savePostData(uid, saveDataDTO);
        } catch (err) {
            console.error(err);
            throw new Error('SAVE_DATA_ERR');
        }
    }
    
    async checkPostData(uid) {
        try {
            const result =await this.postRepository.checkPostData(uid);
            if(!result.exists){
                throw new Error('GET_DATA_ERR');
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
    
    async getPostData(uid, getPostDataDTO) {
        try {
            const result =await this.postRepository.getPostData(uid, getPostDataDTO);
            if(!result){
                throw new Error('DATA_NOT_FOUND');
            }
            return result;
        } catch (err) {
            console.error(err);
            return false;
        }    
    }
    
    async updatePostData(uid, updatePostDataDTO) {
        try {
           await this.postRepository.updatePostData(uid, updatePostDataDTO);
        } catch (err) {
            console.error(err);
            throw new Error('PATCH_DATA_ERR');
        }    
    }
    
    async checkPostPageData(uid, checkPostDataDTO) {
        try {
            console.log("checkPostDataDTO : ",checkPostDataDTO);
            const result = await this.postRepository.checkPostPageData(uid, checkPostDataDTO);
            console.log("체크 결과 : ",result);
            console.log("존재 유무 : ",result.exists);
            if(!result.exists){
                throw new Error('DATA_NOT_FOUND');
            }
        } catch (err) {
            throw err;
        }
    }
    
    async checkWrittenPages(uid) {
        try {
            const result = await this.postRepository.checkWrittenPages(uid);
            if (result === null) {
                throw new Error('DATA_NOT_FOUND'); // 데이터를 찾지 못한 경우 에러 처리
            }
            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
    
}   