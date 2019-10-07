import express from "express";
import trackingRoutes from "@routes/tracking.route";
import userRoutes from "@routes/user.route";
import authRoutes from "@routes/auth.route";
import sittingRoutes from "@routes/sittingRequest.route";
import parentRoutess from "@routes/parent.route";

const router = express.Router();

router.get("/status", (req, res) => res.send("Server is up!"));

router.use("/auth", authRoutes);
router.use("/trackings", trackingRoutes);
router.use("/users", userRoutes);
router.use("/sittingRequests", sittingRoutes);
router.use("/parents", parentRoutess);

export default router;
