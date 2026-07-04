import { Router } from "express";
import {
  addFriend,
  deleteFriend,
  fetchFriend,
  friendRequest,
  suggestedFriend,
  updateFriendStatus,
} from "../controller/friend.controller";

const FriendRouter=Router()

FriendRouter.post("/",addFriend)
FriendRouter.put("/:id",updateFriendStatus)

FriendRouter.get("/",fetchFriend)
FriendRouter.get("/suggestion",suggestedFriend)
FriendRouter.get("/request", friendRequest);
FriendRouter.delete("/:id",deleteFriend)



export default FriendRouter