import express from "express";
import trackingRoutes from "@routes/tracking.route";
import userRoutes from "@routes/user.route";
import authRoutes from "@routes/auth.route";

const router = express.Router();

router.get("/status", (req, res) => res.send("Server is up!"));

router.use("/trackings", trackingRoutes);
router.use("/users", userRoutes);
router.use("/auth", authRoutes);

export default router;
