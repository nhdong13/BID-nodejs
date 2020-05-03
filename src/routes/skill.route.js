import express from "express";
import controller from "@controllers/skill.controller";

const router = express.Router();

router.route("/").get(controller.getAllSkills);

export default router;
