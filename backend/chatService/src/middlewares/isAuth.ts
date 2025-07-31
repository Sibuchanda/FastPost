import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface IUser extends Document{
    _id: string;
    name: string;
    email: string;
}

export interface AuthenticatedRequest extends Request {
    user?: IUser | null;
}


export const isAuth = async(req:AuthenticatedRequest, res: Response, next:NextFunction): Promise<void> =>{
      try{
       const authHeader = req.headers.authorization;
       if(!authHeader || !authHeader.startsWith("Bearer ")){
        res.status(401).json({
            message: "Please Login - No such auth header",
        });
        return;
       }
       const token = authHeader.split(" ")[1];
       const decodeValue = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload

       if(!decodeValue || !decodeValue.user){
        res.status(401).json({
            message: "Invalid token"
        });
        return;
       }
       req.user=decodeValue.user;
       next();
      }catch(err){
          res.status(401).json({
            message: "Please Login - JWT error"
          });
      }
};