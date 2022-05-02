import { ListAPIController } from "./list";
import { CreateAPIController } from "./create";
import { UpdateAPIController } from "./update";
import { DeleteAPIController } from "./delete";
import { RetrieveAPIController } from "./retrieve";
import mongoose from "mongoose";
import { Router } from "express";

export class RestRouter {
  list: ListAPIController;
  retrieve: RetrieveAPIController;
  create: CreateAPIController;
  update: UpdateAPIController;
  delete: DeleteAPIController;
  actions: string[];
  constructor({
    model,
    search,
    actions = ["list", "create", "retrieve", "update", "delete"],
  }: {
    model: mongoose.Model<any, any, any, any>;
    search?: string;
    actions?: string[];
  }) {
    this.actions = actions;

    this.list = new ListAPIController({
      model,
      search,
      enableCount: true,
      enableOrder: true,
    });
    this.create = new CreateAPIController({ model });

    this.retrieve = new RetrieveAPIController({ model });

    this.update = new UpdateAPIController({ model });
    this.delete = new DeleteAPIController({ model });
  }

  asRouter() {
    const router = Router();
    if (this.actions.includes("list"))
      router.get("/list", this.list.asController());
    if (this.actions.includes("retrieve"))
      router.get("/get/:id", this.retrieve.asController());
    if (this.actions.includes("create"))
      router.post("/create", this.create.asController());
    if (this.actions.includes("update"))
      router.patch("/update/:id", this.update.asController());
    if (this.actions.includes("delete"))
      router.delete("/delete/:id", this.delete.asController());

    return router;
  }
}
