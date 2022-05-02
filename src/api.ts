import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import { NotAllowedMethod } from "./errors";

export class APIController {
  model: mongoose.Model<any, any, any, any>;
  allowedMethods: string[];
  itemPerPage: number;

  constructor({ model }: { model: mongoose.Model<any, any, any, any> }) {
    this.model = model;
    this.allowedMethods = ["GET", "POST", "PATCH", "PUT", "DELETE"];
    this.itemPerPage = 10;
  }

  async get(req: Request, res: Response, next: NextFunction) {
    return next(new NotAllowedMethod());
  }

  async create(req: Request, res: Response, next: NextFunction) {
    return next(new NotAllowedMethod());
  }

  async update(req: Request, res: Response, next: NextFunction) {
    return next(new NotAllowedMethod());
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    return next(new NotAllowedMethod());
  }

  async filterModel(req: Request, page: number = 1) {
    return await this.model.find({}, null, this.paginateResults(page));
  }

  paginateResults(page: number): mongoose.QueryOptions {
    return {
      skip: (page - 1) * this.itemPerPage,
      limit: this.itemPerPage,
    };
  }

  asController() {
    return expressAsyncHandler(
      async (req: Request, res: Response, next: NextFunction) => {
        switch (req.method) {
          case "GET":
            await this.get(req, res, next);
            break;

          case "POST":
            await this.create(req, res, next);
            break;

          case "PATCH":
          case "PUT":
            await this.update(req, res, next);
            break;

          case "DELETE":
            await this.delete(req, res, next);
            break;
        }
      }
    );
  }
}
