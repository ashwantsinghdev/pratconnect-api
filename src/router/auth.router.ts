import { Router } from "express";
import {
  getSession,
  login,
  logout,
  refreshToken,
  signup,
  updateProfilePicture,
} from "../controller/auth.controller";
import AuthMiddleware from "../middleware/auth.middleware";
import RefreshToken from "../middleware/refresh.middleware";

const AuthRouter=Router()

AuthRouter.post("/signup",signup)
AuthRouter.post("/login",login)
AuthRouter.post("/logout",logout)
AuthRouter.get("/refresh-token",RefreshToken,refreshToken)

AuthRouter.get("/session",getSession)
AuthRouter.put("/profile-picture",AuthMiddleware,updateProfilePicture)

export default AuthRouter