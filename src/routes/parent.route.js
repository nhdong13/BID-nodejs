import express from "express";
import controller from "@controllers/parent.controller";

const router = express.Router();

router.route("/").get(controller.list);
router.route("/getRequest").get(controller.getParentRequest);
router.route("/").post(controller.create);
router.route("/:id").get(controller.read);
router.route("/:id").put(controller.update);
router.route("/:id").delete(controller.destroy);

export default router;
