import { response } from "../../../utils/response/response.js";
import { status } from "../../../utils/response/response.status.js";
import { checkUidInLocals } from "../../../utils/validators/logincheck.js";
import { getMainQuestionSchema, saveMainQuestionSchema } from "../../../vaild/myprofile.vaild.js";
import { GetMainQuestionDTO, SaveMainQuestionDTO } from "../dto/myprofile.dto.js";
import  { MyProfileService } from '../service/myprofile.service.js'

const myProfileService = new MyProfileService;

export async function GetUserMainQuestion(req, res) {
    try{
        if (!checkUidInLocals(res)) {
            return res.status(409).json(response(status.EMPTY_RES_LOCALS_UID));
        }

        const result = await myProfileService.GetUserMainQuestion(res.locals.uid);

        return res.json(response(status.SUCCESS,result.data));
    }catch(err){
        if(err.message == 'DATA_NOT_FOUND'){
            return res.status(404).json(response(status.MYPROFILE_GET_ERROR));
        }
        console.log("myprofile / GetUserMainQuestion Controller error:",err);
        return res.status(500).json(response(status.INTERNAL_SERVER_ERROR));
    }
}   

export async function SaveMainQuestion(req, res) {
    try{
        if (!checkUidInLocals(res)) {
            return res.status(409).json(response(status.EMPTY_RES_LOCALS_UID));
        }

        const {error, value} = saveMainQuestionSchema.validate(req.body);
        if (error) {
            const errorMessages = error.details.map(detail => detail.message);
            return res.status(400).json(response(status.MYPROFILE_DATA_NOT_FOUND, errorMessages));
        }

        const saveMainQuestionDTO = new SaveMainQuestionDTO(value);
        
        await myProfileService.SaveMainQuestion(res.locals.uid,saveMainQuestionDTO);

        return res.json(response(status.SUCCESS));
    }catch(err){
        console.log("myprofile/SaveMainQuestion error:",err);
        return res.status(500).json(response(status.INTERNAL_SERVER_ERROR));
    }
}   

export async function GetMainQuestion(req, res) {
    try{
        if (!checkUidInLocals(res)) {
            return res.status(409).json(response(status.EMPTY_RES_LOCALS_UID));
        }

        const {error,value} = getMainQuestionSchema.validate(req.params);
        if (error) {
            const errorMessages = error.details.map(detail => detail.message);
            return res.status(400).json(response(status.MYPROFILE_EMPTY_DATA, errorMessages));
        }
        const getMainQuestionDTO = new GetMainQuestionDTO(value);

        const result = await myProfileService.GetMainQuestion(getMainQuestionDTO);
        return res.json(response(status.SUCCESS,result.caseNum));
    }catch(err){
        if(err.message == 'DATA_NOT_FOUND'){
            return res.status(404).json(response(status.MYPROFILE_DATA_NOT_FOUND));
        }
        console.log(err);
        return res.status(500).json(response(status.INTERNAL_SERVER_ERROR));
    }
}   