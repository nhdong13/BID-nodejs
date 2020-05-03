import express from "express";
import controller from "@controllers/cert.controller";

const router = express.Router();

router.route("/").get(controller.getAllCerts);

export default router;
