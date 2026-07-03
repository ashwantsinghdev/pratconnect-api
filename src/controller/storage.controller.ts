import { Request, Response } from "express";
import { CatchError, TryError } from "../utils/error";
import { downloadObject, uploadObject, isFileExist } from "../utils/s3";

export const downloadFile = async (req: Request, res: Response) => {
  try {
    const path = req.body?.path;

    if (!path) throw TryError("Path is missing failed to generate file url");

    const isExist = await isFileExist(path);

    if (!isExist) throw TryError("File not exist ", 404);

    const url = await downloadObject(path);
    res.json({url});
  } catch (err) {
    CatchError(err, res, "Failed to generate download url");
  }
};


export const uploadFile=async(req:Request,res:Response)=>{
    try {
        const path=req.body?.path
        const type =req.body?.type
        const status=req.body?.status

        if(!path||!type||!status)
            throw TryError("Invalid request path or type ",400)

        const url=await uploadObject(path,type,status)

        res.json({url})


        
    } catch (err) {
        CatchError(err,res,"Failed to generate upload url")
        
    }
}