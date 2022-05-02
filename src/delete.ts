import { APIController } from "./api";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { NotFound } from "./errors";

export class DeleteAPIController extends APIController {
  constructor({ model }: { model: mongoose.Model<any, any, any, any> }) {
    super({ model });
    this.allowedMethods = ["DELETE"];
  }

  async filterModel(req: Request, page?: number): Promise<any> {
    let id = req.params.id;

    return await this.model.findOneAndDelete({ _id: id });
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const document = await this.filterModel(req, undefined);
      if (!document) return next(new NotFound(this.model.modelName));
      res.status(200).json(document);
    } catch (error) {
      return next(new NotFound(this.model.modelName));
    }
  }
}
