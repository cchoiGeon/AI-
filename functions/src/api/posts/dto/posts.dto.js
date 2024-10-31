export class SavePostDataDTO {
    constructor({ data, question, mainQuestionId, subQuestionId }) {
        this.data = data;
        this.question = question;
        this.mainQuestionId = mainQuestionId;
        this.subQuestionId = subQuestionId;
    }
}

export class GetPostDataDTO {
    constructor({ mainId, subId }) {
        this.mainId = mainId;
        this.subId = subId;
    }
}

export class UpdatePostDataDTO {
    constructor({ data, mainId, subId }) {
        this.data = data;
        this.mainId = mainId;
        this.subId = subId;
    }
}

export class CheckPostDataDTO {
    constructor({ mainQuestionId }) {
        this.mainId = mainQuestionId;
    }
}

export class CheckPostPageDTO {
    constructor({ mainQuestionId }) {
        this.mainQuestionId = mainQuestionId;
    }
}
