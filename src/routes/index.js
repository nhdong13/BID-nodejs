import express from "express";
import trackingRoutes from "@routes/tracking.route";
import userRoutes from "@routes/user.route";
import authRoutes from "@routes/auth.route";
import sittingRoutes from "@routes/sittingRequest.route";
import parentRoutess from "@routes/parent.route";
import invitationRoutes from "@routes/invitation.route";
import { jwtAuthentication } from "../middlewares/jwt.middleware";

const router = express.Router();

router.get("/status", (res) => res.send("Server is up!"));

router.use("/auth", authRoutes);
router.use("/trackings", trackingRoutes);
router.use("/users", jwtAuthentication, userRoutes);
router.use("/sittingRequests", sittingRoutes);
router.use("/parents", parentRoutess);
router.use("/invitations", invitationRoutes);

export default router;
