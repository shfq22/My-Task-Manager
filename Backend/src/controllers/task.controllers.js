import mongoose from "mongoose";
import { Task } from "../models/task.models.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";

const createTask = asyncHandler(async (req, res) => {
  const { title, description, dueDate, priority, assignedTo } = req.body;
  const user = req.user;
  console.log("BODY:", req.body);
  console.log("FILES:", req.files);
  if (!user || user.role !== "admin") {
    throw new ApiError(403, "You are not authorized to create a task");
  }
  if (!title || !description || !dueDate || !priority || !assignedTo) {
    throw new ApiError(400, "All fields are required");
  }

  const updatedDueDate = new Date(dueDate);

  const doc1LocalPath = req.files?.doc1?.[0]?.path;
  const doc2LocalPath = req.files?.doc2?.[0]?.path;
  const doc3LocalPath = req.files?.doc3?.[0]?.path;

  const doc1 = doc1LocalPath ? await uploadOnCloudinary(doc1LocalPath) : null;
  const doc2 = doc2LocalPath ? await uploadOnCloudinary(doc2LocalPath) : null;
  const doc3 = doc3LocalPath ? await uploadOnCloudinary(doc3LocalPath) : null;

  const attachedDocument = [doc1, doc2, doc3];
  if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
    throw new ApiError(400, "Invalid user ID");
  }
  const task = await Task.create({
    title,
    description,
    dueDate: updatedDueDate,
    attachedDocument,
    priority,
    assignedTo: new mongoose.Types.ObjectId(assignedTo),
  });

  const createdTask = await Task.findById(task._id);

  if (!createdTask) {
    throw new ApiError(500, "Something went wrong while creating task");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdTask, "Task created successfully"));
});

const getTaskbyId = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  if (!taskId) {
    throw new ApiError(400, "Task ID is required");
  }

  const task = await Task.findById(
    new mongoose.Types.ObjectId(taskId)
  ).populate("assignedTo", "-password -refreshToken");

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task fetched successfully"));
});

const updateTaskStatus = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  if (!taskId || !status) {
    throw new ApiError(400, "Task ID and status are required");
  }
  const user = req.user;

  const task = await Task.findById(new mongoose.Types.ObjectId(taskId));

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (task.assignedTo.toString() !== user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this task");
  }

  task.status = status;
  await task.save({ validateBeforeSave: false });
  const updatedTask = await Task.findById(task._id).populate(
    "assignedTo",
    "-password -_id -refreshToken"
  );
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedTask, "Task status updated successfully")
    );
});

const updateTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { title, description, dueDate, priority } = req.body;
  if (!title && !description && !dueDate && !priority) {
    throw new ApiError(400, "At least one field is required to update");
  }
  const user = req.user;

  if (!user || user.role !== "admin") {
    throw new ApiError(403, "You are not authorized to update this task");
  }

  if (!taskId) {
    throw new ApiError(400, "Task ID is required");
  }

  const task = await Task.findById(new mongoose.Types.ObjectId(taskId));

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (title) task.title = title;
  if (description) task.description = description;
  if (dueDate) task.dueDate = new Date(dueDate);
  if (priority) task.priority = priority;
  task.status = "completed";

  await task.save({ validateBeforeSave: false });
  const updatedTask = await Task.findById(task._id).populate(
    "assignedTo",
    "-password -_id -refreshToken"
  );
  return res
    .status(200)
    .json(new ApiResponse(200, updatedTask, "Task updated successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  if (!taskId) {
    throw new ApiError(400, "Task ID is required");
  }

  const user = req.user;
  if (!user || user.role !== "admin") {
    throw new ApiError(403, "You are not authorized to delete this task");
  }
  const task = await Task.findById(new mongoose.Types.ObjectId(taskId));

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  await Task.deleteOne({ _id: task._id });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Task deleted successfully"));
});

const getUserTasks = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(403, "You are not authorized to view tasks");
  }

  const tasks = await Task.find({ assignedTo: user._id })
    .populate("assignedTo", "-password  -refreshToken")
    .sort({ createdAt: -1 });

  if (!tasks || tasks.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, [], "No tasks found for this user"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "User tasks fetched successfully"));
});

const filterTasks = asyncHandler(async (req, res) => {
  const { status, priority, dueDate } = req.body;
  const user = req.user;
  if (!user) {
    throw new ApiError(403, "You are not authorized to filter tasks");
  }
  const tasks = await Task.find({
    assignedTo: user._id,
    ...(status && { status }),
    ...(priority && { priority }),
    ...(dueDate && { dueDate: { $gte: new Date(dueDate) } }),
  })
    .populate("assignedTo", "-password -_id -refreshToken")
    .sort({ createdAt: -1 });

  if (!tasks || tasks.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, [], "No tasks found with the given filters"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks filtered successfully"));
});

export {
  createTask,
  getTaskbyId,
  updateTaskStatus,
  updateTask,
  deleteTask,
  getUserTasks,
  filterTasks,
};
