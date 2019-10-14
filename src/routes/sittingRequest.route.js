import express from "express";
import controller from "@controllers/sittingRequest.controller";

const router = express.Router();

router.route("/listParent").get(controller.listByParentId);
router.route("/listStatus").get(controller.listByParentAndStatus);
router.route("/listBabysitter").get(controller.listMatchedBabysitter);
router.route("/recommend/:id").get(controller.recommendBabysitter);
router.route("/").post(controller.create);
router.route("/:id").get(controller.read);
router.route("/:id").put(controller.update);
router.route("/:id").delete(controller.destroy);

export default router;
