import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUsersforSidebar , sendMessages , getMessages } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersforSidebar); // ✅ This must call the correct controller
router.get("/:id", protectRoute, getMessages);
router.post("/:id", protectRoute, sendMessages);

export default router;
