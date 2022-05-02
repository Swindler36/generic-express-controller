import { APIController } from "./api";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { DocumentNotFound } from "./errors";

export class RetrieveAPIController extends APIController {
  fields?: string[];
  constructor({
    model,
    fields,
  }: {
    model: mongoose.Model<any, any, any, any>;
    fields?: string[];
  }) {
    super({ model });
    this.allowedMethods = ["GET"];
    this.fields = fields;
  }

  async filterModel(req: Request, page?: number): Promise<any> {
    let id = req.params.id;
    if (this.fields) {
      return await this.model.findById({ _id: id }).select(this.fields);
    } else {
      return await this.model.findById({ _id: id });
    }
  }

  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    let document: any = {};
    try {
      document = await this.filterModel(req);
    } catch (error) {
      return next(new DocumentNotFound());
    }

    res.status(200).json(document);
  }
}
