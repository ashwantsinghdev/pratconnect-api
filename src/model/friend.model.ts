import mongoose,{model,Schema} from "mongoose";

const friendSchema=new Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:"Auth",
    },
    friend:{
        type:mongoose.Types.ObjectId,
        ref:"Auth"
    },
    status:{
        type:String,
        enum:["requested","accepted"],
        default:"requested"

    }
},{timestamps:true})

friendSchema.pre("save",async function(){
    const count=await model("Friend").countDocuments({
        user:this.user,
        friend:this.friend
    })
    if(count>0) throw new Error("Friend request already sent ")
})
const FriendModel=model("Friend",friendSchema)

export default FriendModel