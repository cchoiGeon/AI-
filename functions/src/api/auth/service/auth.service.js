import { auth } from "../../../../config/firebase.config.js";
import { SESSION_EXPIRES_IN } from "../../../utils/const/constants.js";

export class AuthService {
  
  async login(loginDTO) {
    try {
      return await auth.createSessionCookie(loginDTO.token, { expiresIn: SESSION_EXPIRES_IN });
    } catch (err) {
      console.error('User/LoginService error:', err);
      // 세션 쿠키 생성 실패 시 명확한 에러 메시지
      throw new Error('CREATE_TOKEN_ERR');
    }
  }
}