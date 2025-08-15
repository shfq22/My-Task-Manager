import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  deleteUser,
  getAllTask,
  getAllUsers,
  getUserById,
} from "../controllers/admin.controllers.js";

const router = Router();

router.route("/").get(verifyJWT, getAllUsers);
router.route("/tasks").get(verifyJWT, getAllTask);
router.route("/:userId").get(verifyJWT, getUserById);
router.route("/:userId").delete(verifyJWT, deleteUser);

export { router };
