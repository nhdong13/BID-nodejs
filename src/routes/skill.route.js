import express from "express";
import controller from "@controllers/skill.controller";

const router = express.Router();

router.route("/").get(controller.getAllSkills);
router.route("/all").get(controller.getAll);
router.route("/").post(controller.create);
router.route("/:id").put(controller.update);
router.route("/:id").delete(controller.destroy);

export default router;
