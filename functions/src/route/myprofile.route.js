import express from 'express';
import { GetMainQuestion, GetUserMainQuestion, SaveMainQuestion } from '../api/myprofile/controller/myprofile.controller.js';

export const myprofileRouter = express.Router();


myprofileRouter.get("/main-question",GetUserMainQuestion); // 사용자 맞춤형 목차 Uid DB에서 가져오기
myprofileRouter.get("/main-question/:caseNum",GetMainQuestion); // 사용자 맞춤형 목차 공용 DB에서 가져오기
myprofileRouter.post("/main-question",SaveMainQuestion); // 사용자 맞춤형 목차 Uid 저장 로직