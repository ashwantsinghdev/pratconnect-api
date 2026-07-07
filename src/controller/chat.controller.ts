import mongoose from "mongoose";
import ChatModel from "../model/chat.model";
import { Request, Response } from "express";
import { SessionInterface } from "../middleware/auth.middleware";
import { downloadObject } from "../utils/s3";
import { CatchError, TryError } from "../utils/error";
interface PayloadInterface {
  from: string;
  to: string;
  message: string;
  file?: {
    path: string;
    type: string;
  };
}

export const createChat = (payload: PayloadInterface) => {
  ChatModel.create(payload).catch((err) => {
    console.log(err);
  });
};

export const fetchChats = async(req: SessionInterface, res: Response) => {
  try {
    if (!req.session) throw TryError("Failed to fetch chats");

    const chats = await ChatModel.find({
      $or: [
        { from: req.session.id, to: req.params.to },
        { from: req.params.to, to: req.session.id },
      ],
    }).populate("from","fullname email mobile").lean()

    const modifiedChats = await Promise.all(
      chats.map(async (item) => {
        if (item.file) {
          return {
            ...item,
            file: {
              path: item.file.path && (await downloadObject(item.file.path)),
              type: item.file.type,
            },
          };
        } else {
          return item;
        }
      }),
    );
    res.json(modifiedChats)
  } catch (err) {
    CatchError(err, res, "Failed to fetch chats");
  }
};
