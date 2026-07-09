import { Request, Response } from "express";
import FriendModel from "../model/friend.model";
import { CatchError, TryError } from "../utils/error";
import { SessionInterface } from "../middleware/auth.middleware";
import AuthModel from "../model/auth.model";
import mongoose from "mongoose";

export const addFriend = async (req: SessionInterface, res: Response) => {
  try {
    req.body.user = req.session?.id;
    const friend = await FriendModel.create(req.body);
    res.json(friend);
  } catch (err) {
    CatchError(err, res, "Failed to send friend request");
  }
};

export const fetchFriend = async (req: SessionInterface, res: Response) => {
  try {
    const userId = req.session?.id;
    const friends = await FriendModel.find({
      status: "accepted",
      $or: [{ user: userId }, { friend: userId }],
    })
      .populate("friend")
      .populate("user");

    const modified = friends.map((item: any) => {
      const isUser = item.user._id.toString() === userId;
      return {
        _id: item._id,
        friend: isUser ? item.friend : item.user,
        status: item.status,
        createdAt: item.createdAt,
        updated: item.updatedAt,
      };
    });

    res.json(modified);
  } catch (err) {
    CatchError(err, res, "Failed to add friend request");
  }
};

export const deleteFriend = async (req: SessionInterface, res: Response) => {
  try {
    await FriendModel.deleteOne({ _id: req.params.id });
    res.json({ message: "Friend deleted" });
  } catch (err) {
    CatchError(err, res, "failed to delete friend");
  }
};

export const suggestedFriend = async (req: SessionInterface, res: Response) => {
  try {
    const userId = req.session?.id;

    const friends = await AuthModel.aggregate([
      {
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(userId) },
        },
      },
      { $sample: { size: 5 } },
      { $project: { fullname: 1, image: 1, createdAt: 1 } },
    ]);

    const modified = await Promise.all(
      friends.map(async (item) => {
       
        const count = await FriendModel.countDocuments({
          $or: [
            { user: userId, friend: item._id },
            { user: item._id, friend: userId },
          ],
        });
        return count === 0 ? item : null;
      }),
    );

    const filtered = modified.filter((item: any) => item !== null);
    res.json(filtered);
  } catch (err) {
    CatchError(err, res, "failed to suggest friend");
  }
};

export const friendRequest = async (req: SessionInterface, res: Response) => {
  try {
    if (!req.session) throw TryError("Failed to fetch friend request");

    const friends = await FriendModel.find({
      friend: req.session.id,
      status: "requested",
    }).populate("user", "fullname image");
    res.json(friends);
  } catch (err) {
    CatchError(err, res, "Failed to request friend");
  }
};

export const updateFriendStatus = async (
  req: SessionInterface,
  res: Response,
) => {
  try {
    if (!req.session) throw TryError("Failed to update status");

    await FriendModel.updateOne(
      { _id: req.params.id },
      { $set: { status: req.body.status } },
    );
    res.json({ message: "Friend status updated" });
  } catch (err) {
    CatchError(err, res, "Failed to update friend status");
  }
};
