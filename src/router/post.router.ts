import { Router } from "express";
import { createPost, fetchPost } from "../controller/post.controller";


const PostRouter=Router()

PostRouter.post("/",createPost)
PostRouter.get("/",fetchPost)

export default PostRouter