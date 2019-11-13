import express from "express";
import controller from "@controllers/parent.controller";

const router = express.Router();

router.route("/findByCode/:userId&:code").get(controller.findByCode);
router.route("/createCode").put(controller.createCode);
router.route("/").get(controller.list);
router.route("/").post(controller.create);
router.route("/:id").get(controller.read);
router.route("/:id").put(controller.update);
router.route("/:id").delete(controller.destroy);

export default router;
