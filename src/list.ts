import { APIController } from "./api";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { DocumentNotFound } from "./errors";

export class ListAPIController extends APIController {
  search?: string;
  enableOrder?: boolean;
  enableCount?: boolean;
  constructor({
    model,
    search = undefined,
    enableOrder = true,
    enableCount = false,
  }: {
    model: mongoose.Model<any, any, any, any>;
    search?: string;
    enableOrder?: boolean;
    enableCount?: boolean;
  }) {
    super({ model });
    this.allowedMethods = ["GET"];
    this.search = search;
    this.enableOrder = enableOrder;
    this.enableCount = enableCount;
  }

  async filterModel(req: Request, page: number): Promise<any> {
    const { search, order, _filter } = req.query;
    let queryOptions = {
      ...this.paginateResults(page),
    };

    if (order && this.enableOrder) {
      let orderField = String(order);
      queryOptions["sort"] = {};
      queryOptions["sort"][orderField.replace("-", "")] = orderField.startsWith(
        "-"
      )
        ? -1
        : 1;
    }
    let filter: any = {};

    if (search && this.search) {
      filter[this.search] = new RegExp(String(search));
    }

    if (_filter) {
      try {
        filter = {
          ...filter,
          ...JSON.parse(String(_filter)),
        };
      } catch (error) {
        console.log(error);
      }
    }

    return await this.model.find(filter, null, queryOptions);
  }

  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    let documents: any = {};
    let page = req.query.page;
    let pageNumber = page ? Number(page) : 1;

    try {
      documents = await this.filterModel(req, pageNumber);
    } catch (error) {
      return next(new DocumentNotFound());
    }

    if (this.enableCount) {
      let count = await this.model.countDocuments();
      res.status(200).json({
        count: count,
        nextPage:
          count - (pageNumber - 1) * this.itemPerPage > this.itemPerPage
            ? pageNumber + 1
            : null,
        prevPage: pageNumber > 1 ? pageNumber + 1 : null,
        results: documents,
      });
    }

    res.status(200).json({
      results: documents,
    });
  }
}
