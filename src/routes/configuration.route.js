import express from "express";
import controller from "@controllers/configuration.controller";

const router = express.Router();

router.route("/").get(controller.list);
router.route("/:id").get(controller.getPriceByDate);
router.route("/").post(controller.create);
router.route("/:id").delete(controller.destroy);

export default router;
