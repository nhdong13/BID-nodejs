import express from "express";
import controller from "@controllers/user.controller";

const router = express.Router();

router.route("/").get(controller.list);
router.route("/").post(controller.create);
router.route("/:id").get(controller.read);
router.route("/:id").put(controller.update);
router.route("/:id").delete(controller.destroy);
router.route("/bsitterRegister").post(controller.createBsitter);
router.route("/parentRegister").post(controller.createParent);

export default router;
