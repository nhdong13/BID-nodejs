import express from "express";
import controller from "@controllers/sittingRequest.controller";

const router = express.Router();

router.route("/listParent").post(controller.listByParentId);
router.route("/listByStatus").post(controller.listByParentAndStatus);
router.route("/listBabysitter").get(controller.listMatchedBabysitter);
router.route("/bsitterSitting").post(controller.listSittingByBabysitterId);
router.route("/getOverlapRequests").post(controller.getOverlapRequests);
router.route("/recommend/:id").post(controller.recommendBabysitter);
router.route("/acceptBabysitter/:requestId&:sitterId").get(controller.acceptBabysitter);
router.route("/startSittingRequest/:requestId&:sitterId").get(controller.startSittingRequest);
router.route("/doneSittingRequest/:requestId&:sitterId").get(controller.doneSittingRequest);
router.route("/cancelSittingRequest/").put(controller.cancelSittingRequest);
router.route("/all").get(controller.listForWeb);
router.route("/").post(controller.create);
router.route("/").get(controller.list);
router.route("/:id").get(controller.read);
router.route("/:id").put(controller.update);
router.route("/:id").delete(controller.destroy);

export default router;
