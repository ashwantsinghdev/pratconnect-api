import { NextFunction, Response } from "express";
import { TryError, CatchError } from "../utils/error";
import AuthModel from "../model/auth.model";
import moment from "moment";
import { SessionInterface } from "./auth.middleware";

const RefreshToken = async (
  req: SessionInterface,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) throw TryError("Failed to refresh token", 401);

    const user = await AuthModel.findOne({ refreshToken });

    if (!user) throw TryError("Failed to refresh token", 401);

    const today = moment();
    const expiry = moment(user.expiry);

    const isExpired = today.isAfter(expiry);

    if (isExpired) throw TryError("Failed to refresh token", 401);

    req.session = {
      id: user._id,
      email: user.email,
      mobile: user.mobile,
      fullname: user.fullname,
      image: user.image ?? null,
    };

    next();
  } catch (err) {
    CatchError(err, res, "failed to refresh token");
  }
};
export default RefreshToken;