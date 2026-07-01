import { NextFunction, Response, Request } from "express";
import { CatchError, TryError } from "../utils/error";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

export interface PayloadInterface {
  id: mongoose.Types.ObjectId;
  fullname: string;
  email: string;
  mobile: string;
  image: string | null;
}

export interface SessionInterface extends Request {
  session?: PayloadInterface;
}

const AuthMiddleware = async (
  req: SessionInterface,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accesToken = req.cookies.accesToken;
    if (!accesToken) throw TryError("Unauthorized", 404);

    const payload = (await jwt.verify(
      accesToken,
      process.env.AUTH_SECRET!,
    )) as JwtPayload;

    req.session = {
      id: payload.id,
      email: payload.email,
      mobile: payload.mobile,
      fullname: payload.fullname,
      image: payload.image,
    };
    next();
  } catch (err) {
    CatchError(err, res, "Unauthorized");
  }
};

export default AuthMiddleware;
