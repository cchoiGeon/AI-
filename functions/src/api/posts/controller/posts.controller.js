import { response } from "../../../utils/response/response.js";
import { status } from "../../../utils/response/response.status.js";
import { checkUidInLocals } from "../../../utils/validators/logincheck.js";

import { checkAnswerDataSchema, getWriteDataSchema, patchWriteDataSchema, saveWriteDataSchema } from "../../../vaild/posts.vaild.js";
import { CheckPostDataDTO, GetPostDataDTO, UpdatePostDataDTO, SavePostDataDTO } from "../dto/posts.dto.js";
import { PostsService } from "../service/posts.service.js";

const postService = new PostsService();

export async function savePostData(req, res) {
    try {
        if (!checkUidInLocals(res)) {
            return res.status(409).json(response(status.EMPTY_RES_LOCALS_UID));
        }

        const { error, value } = saveWriteDataSchema.validate(req.body);
        if (error) {
            const errorMessages = error.details.map(detail => detail.message);
            return res.status(400).json(response(status.POST_DATA_NOT_FOUND, errorMessages));
        }

        const saveDataDTO = new SavePostDataDTO(value);
        await postService.savePostData(res.locals.uid, saveDataDTO);

        return res.json(response(status.SUCCESS));
    } catch (err) {
        if (err.message === 'SAVE_DATA_ERR') {
            return res.status(500).json(response(status.POST_SAVE_ERROR));
        }
        console.log(err);
        return res.status(500).json(response(status.INTERNAL_SERVER_ERROR));
    }
}

export async function checkPostData(req, res) {
    try {
        if (!checkUidInLocals(res)) {
            return res.status(409).json(response(status.EMPTY_RES_LOCALS_UID));
        }

        await postService.checkPostData(res.locals.uid);

        return res.json(response(status.SUCCESS));
    } catch (err) {
        if (err.message === 'GET_DATA_ERR') {
            return res.status(404).json(response(status.POST_NO_DATA));
        }
        console.log(err);
        return res.status(500).json(response(status.INTERNAL_SERVER_ERROR));
    }
}

export async function getPostData(req, res) {
    try {
        if (!checkUidInLocals(res)) {
            return res.status(409).json(response(status.EMPTY_RES_LOCALS_UID));
        }

        const { error, value } = getWriteDataSchema.validate(req.params);
        if (error) {
            const errorMessages = error.details.map(detail => detail.message);
            return res.status(400).json(response(status.POST_EMPTY_QUERY_DATA, errorMessages));
        }

        const getPostDataDTO = new GetPostDataDTO(value);
        const result = await postService.getPostData(res.locals.uid, getPostDataDTO);

        return res.json(response(status.SUCCESS, result));
    } catch (err) {
        if (err.message === 'DATA_NOT_FOUND') {
            return res.status(404).json(response(status.POST_DATA_NOT_FOUND));
        }
        console.log(err);
        return res.status(500).json(response(status.INTERNAL_SERVER_ERROR));
    }
}

export async function updatePostData(req, res) {
    try {
        if (!checkUidInLocals(res)) {
            return res.status(409).json(response(status.EMPTY_RES_LOCALS_UID));
        }

        const { error, value } = patchWriteDataSchema.validate(req.body);
        if (error) {
            const errorMessages = error.details.map(detail => detail.message);
            return res.status(400).json(response(status.EMPTY_REQUEST_BODY, errorMessages));
        }

        const updatePostDataDTO = new UpdatePostDataDTO(value);
        await postService.updatePostData(res.locals.uid, updatePostDataDTO);

        return res.json(response(status.SUCCESS));
    } catch (err) {
        if (err.message === 'PATCH_DATA_ERR') {
            return res.status(404).json(response(status.POST_PATCH_ERROR));
        }
        console.log(err);
        return res.status(500).json(response(status.INTERNAL_SERVER_ERROR));
    }
}

export async function checkPostPageData(req, res) {
    try {
        if (!checkUidInLocals(res)) {
            return res.status(409).json(response(status.EMPTY_RES_LOCALS_UID));
        }

        const { error, value } = checkAnswerDataSchema.validate(req.params);
        if (error) {
            const errorMessages = error.details.map(detail => detail.message);
            return res.status(400).json(response(status.POST_EMPTY_REQUEST_DATA, errorMessages));
        }

        const checkPostDataDTO = new CheckPostDataDTO(value);
        await postService.checkPostPageData(res.locals.uid, checkPostDataDTO);

        return res.json(response(status.SUCCESS));
    } catch (err) {
        if (err.message === 'DATA_NOT_FOUND') {
            return res.status(404).json(response(status.POST_DATA_NOT_FOUND));
        }
        console.error(err);
        return res.status(500).json(response(status.INTERNAL_SERVER_ERROR));
    }
}

export async function checkWrittenPages(req, res) {
    try {
        if (!checkUidInLocals(res)) {
            return res.status(409).json(response(status.EMPTY_RES_LOCALS_UID));
        }

        const result = await postService.checkWrittenPages(res.locals.uid);

        return res.json(response(status.SUCCESS, result));
    } catch (err) {
        if (err.message === 'DATA_NOT_FOUND') {
            return res.status(404).json(response(status.POST_DATA_NOT_FOUND));
        }
        console.log(err);
        return res.status(500).json(response(status.INTERNAL_SERVER_ERROR));
    }
}
