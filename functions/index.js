import functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// 사용자 정의 모듈 불러오기 
import { initApp,auth } from './config/firebase.config.js'
import { chatGptRouter } from './src/route/chatgpt.route.js';
import { postsRouter } from './src/route/posts.route.js';
import { myprofileRouter } from './src/route/myprofile.route.js';
import { userRouter } from './src/route/user.route.js';
import { LoginCheckMiddleWares } from './src/middlewares/logincheck.middlewares.js';
import { chatGPTApiLimiter } from './config/rateLimit.config.js';
import { authRouter } from './src/route/auth.route.js';

const app = express();

app.use(cors({ 
    origin: ['https://lifelegacy.co.kr','https://www.lifelegacy.co.kr','http://127.0.0.1:5002','http://192.168.219.103:5500'], 
    credentials: true 
}));

app.use(cookieParser());
app.use(express.json()); // JSON 요청을 처리할 수 있도록 설정
app.use(express.urlencoded({ extended: true })); // URL-encoded 요청을 처리할 수 있도록 설정


app.use("/users",LoginCheckMiddleWares,userRouter);
app.use("/auth",authRouter);
app.use("/profile/me",LoginCheckMiddleWares,myprofileRouter);
app.use("/posts",LoginCheckMiddleWares, postsRouter);
app.use("/chatGpt",LoginCheckMiddleWares, chatGptRouter);

export const api = functions.region("asia-northeast3").https.onRequest(app);
