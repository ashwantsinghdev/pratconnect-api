import { Response, Request } from "express";
import { SessionInterface } from "../middleware/auth.middleware";
import { CatchError } from "../utils/error";
import PostModel from "../model/post.model";

export const createPost = async (req: SessionInterface, res: Response) => {
  try {
    req.body.user = req.session?.id;
    const post = await PostModel.create(req.body);
    res.json(post);
  } catch (err) {
    CatchError(err, res, "Failed to create post");
  }
};

export const fetchPost=async(req:SessionInterface,res:Response)=>{
    try {
        const posts =await PostModel.find().sort({createdAt:-1})
        res.json(posts)
        
    } catch (err) {
        CatchError(err,res,"Failed to fetch post")
        
    }
}
