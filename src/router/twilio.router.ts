import { Router } from "express";
import AuthMiddleware from "../middleware/auth.middleware";
import { getTurnServer } from "../controller/twilio.controler";

const TwilioRouter=Router()

TwilioRouter.get("/turn-server",AuthMiddleware,getTurnServer)

export default TwilioRouter