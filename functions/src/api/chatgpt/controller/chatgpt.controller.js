import { combinePrompt } from "../../../utils/prompt/combine.prompt.js";
import { createCasePrompt } from "../../../utils/prompt/makeCase.prompt.js";
import { createReQuestionPrompt } from "../../../utils/prompt/makeReQuestion.prompt.js";
import { response } from "../../../utils/response/response.js";
import { status } from "../../../utils/response/response.status.js";
import { checkUidInLocals } from "../../../utils/validators/logincheck.js";
import { combineSchema, makeCaseSchema, makeReQuestionSchema } from "../../../vaild/chatgpt.vaild.js";
import { ChatGPTAPI } from '../service/chatgpt.service.js';

const chatGPTService = new ChatGPTAPI();

export async function MakeCase(req, res) {
    try {
        if (!checkUidInLocals(res)) {
            return res.status(409).json(response(status.EMPTY_RES_LOCALS_UID));
        }

        const {error, value} = makeCaseSchema.validate(req.body);
        if (error) {
            const errorMessages = error.details.map(detail => detail.message);
            return res.status(400).json(response(status.CHATGPT_EMPTY_DATA, errorMessages));
        }

        const CHATGPTTOKEN=100;
        const prompt = createCasePrompt(value.data);

        const result = await chatGPTService.GetChatGPTData(prompt,CHATGPTTOKEN);

        return res.json(response(status.SUCCESS, result));
    } catch (err) {
        if (err.message === 'CHATGPT_AUTH_ERR') {
            return res.status(401).json(response(status.CHATGPT_AUTH_ERROR));
        }
        if (err.message === 'CHATGPT_RATE_LIMIT_ERR') {
            return res.status(429).json(response(status.CHATGPT_RATE_LIMIT_ERROR));
        }
        if (err.message === 'CHATGPT_ERR') {
            return res.status(500).json(response(status.CHATGPT_GET_QUERY_ERROR));
        }
        console.error(err);
        return res.status(500).json(response(status.INTERNAL_SERVER_ERROR));
    }
}

export async function MakeReQuestionData(req, res) {
    try {
        if (!checkUidInLocals(res)) {
            return res.status(409).json(response(status.EMPTY_RES_LOCALS_UID));
        }

        const {error, value} = makeReQuestionSchema.validate(req.body);
        if (error) {
            const errorMessages = error.details.map(detail => detail.message);
            return res.status(400).json(response(status.CHATGPT_EMPTY_DATA, errorMessages));
        }

        const CHATGPTTOKEN=1000;
        const prompt = createReQuestionPrompt(value.question,value.data);

        const result = await chatGPTService.GetChatGPTData(prompt,CHATGPTTOKEN);

        return res.json(response(status.SUCCESS, result));
    } catch (err) {
        if (err.message === 'CHATGPT_AUTH_ERR') {
            return res.status(401).json(response(status.CHATGPT_AUTH_ERROR));
        }
        if (err.message === 'CHATGPT_RATE_LIMIT_ERR') {
            return res.status(429).json(response(status.CHATGPT_RATE_LIMIT_ERROR));
        }
        if (err.message === 'CHATGPT_ERR') {
            return res.status(500).json(response(status.CHATGPT_GET_QUERY_ERROR));
        }
        console.error(err);
        return res.status(500).json(response(status.INTERNAL_SERVER_ERROR));
    }
}

export async function Combine(req, res) {
    try {
        if (!checkUidInLocals(res)) {
            return res.status(409).json(response(status.EMPTY_RES_LOCALS_UID));
        }

        // Joi 검증 실행
        const { error,value } = combineSchema.validate(req.body);
        // Joi 검증 실패 시
        if (error) {
            const errorMessages = error.details.map(detail => detail.message);
            return res.status(400).json(response(status.CHATGPT_EMPTY_DATA, errorMessages));
        }
        
        const CHATGPTTOKEN=2000;
        const prompt = combinePrompt(value.question1,value.question2,value.data1,value.data2);
        
        const result = await chatGPTService.GetChatGPTData(prompt,CHATGPTTOKEN);
        return res.send(response(status.SUCCESS, result));
    } catch (err) {
        if (err.message === 'CHATGPT_AUTH_ERR') {
            return res.status(401).json(response(status.CHATGPT_AUTH_ERROR));
        }
        if (err.message === 'CHATGPT_RATE_LIMIT_ERR') {
            return res.status(429).json(response(status.CHATGPT_RATE_LIMIT_ERROR));
        }
        if (err.message === 'CHATGPT_ERR') {
            return res.status(500).json(response(status.CHATGPT_GET_QUERY_ERROR));
        }
        console.error(err);
        return res.status(500).json(response(status.INTERNAL_SERVER_ERROR));
    }
}
