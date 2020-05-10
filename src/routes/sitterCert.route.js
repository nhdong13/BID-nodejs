import express from "express";
import controller from "controllers/sitterCert.controller";

const router = express.Router();

router.route("/").post(controller.create);
router.route("/").delete(controller.terminate);
router.route("/:id").delete(controller.destroy);

export default router;
