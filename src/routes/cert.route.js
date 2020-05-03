import express from "express";
import controller from "@controllers/cert.controller";

const router = express.Router();

router.route("/").get(controller.getAllCerts);
router.route("/").post(controller.create);
router.route("/:id").put(controller.update);
router.route("/:id").delete(controller.destroy);

export default router;
