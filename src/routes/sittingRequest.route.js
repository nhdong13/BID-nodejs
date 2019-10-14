import express from "express";
import controller from "@controllers/sittingRequest.controller";

const router = express.Router();

router.route("/listParent").post(controller.listByParentId);
router.route("/listStatus").get(controller.listByParentAndStatus);
router.route("/").post(controller.create);
router.route("/:id").get(controller.read);
router.route("/:id").put(controller.update);
router.route("/:id").delete(controller.destroy);

export default router;
