import { APIController } from "./api";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { MissingCredentials } from "./errors";

export class CreateAPIController extends APIController {
  excludes?: string[];
  constructor({
    model,
    excludes,
  }: {
    model: mongoose.Model<any, any, any, any>;
    excludes?: string[];
  }) {
    super({ model });
    this.allowedMethods = ["POST"];
    this.excludes = excludes;
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const document = new this.model(req.body);
      await document.save();
      let respone_body: any = {};
      if (this.excludes) {
        let keys = Object.keys(document);
        for (let i = 0; i < keys.length; i++) {
          const field = keys[i];
          if (!this.excludes.includes(field)) {
            respone_body[field] = req.body[field];
          }
        }
        res.status(200).json(respone_body);
      } else {
        res.status(200).json(document);
      }
    } catch (error) {
      console.log(error);
      return next(new MissingCredentials());
    }
  }
}
