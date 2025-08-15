import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createTask,
  getTaskbyId,
  updateTaskStatus,
  updateTask,
  deleteTask,
  getUserTasks,
  filterTasks,
} from "../controllers/task.controllers.js";
const router = Router();

router.route("/").post(
  verifyJWT,
  upload.fields([
    { name: "doc1", maxCount: 1 },
    { name: "doc2", maxCount: 1 },
    { name: "doc3", maxCount: 1 },
  ]),
  createTask
);

router.route("/user-tasks").get(verifyJWT, getUserTasks);
router.route("/filter").post(verifyJWT, filterTasks);

router.route("/:taskId").get(verifyJWT, getTaskbyId);
router.route("/:taskId/status").patch(verifyJWT, updateTaskStatus);
router.route("/:taskId").patch(verifyJWT, updateTask);
router.route("/:taskId").delete(verifyJWT, deleteTask);

export { router };
