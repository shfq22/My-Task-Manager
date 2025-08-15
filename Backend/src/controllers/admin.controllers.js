import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import mongoose from "mongoose";
import { Task } from "../models/task.models.js";
const getAllUsers = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user || user.role !== "admin") {
    throw new ApiError(403, "You are not authorized to view users");
  }

  const users = await User.find({
    role: { $ne: "admin" },
  }).select("-password -refreshToken");

  if (!users || users.length === 0) {
    return res.status(404).json(new ApiResponse(404, [], "No users found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully"));
});

const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = req.user;

  if (!user || user.role !== "admin") {
    throw new ApiError(403, "You are not authorized to view users");
  }

  const getUser = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "tasks",
        localField: "_id",
        foreignField: "assignedTo",
        as: "tasks",
      },
    },
    {
      $project: {
        password: 0,
        refreshToken: 0,
      },
    },
  ]);

  if (!getUser || getUser.length === 0) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, getUser[0], "User fetched successfully"));
});

const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = req.user;
  if (!user || user.role !== "admin") {
    throw new ApiError(403, "You are not authorized to delete users");
  }
  const userToDelete = await User.findByIdAndDelete(
    new mongoose.Types.ObjectId(userId)
  );
  if (!userToDelete) {
    throw new ApiError(404, "User not found");
  }

  await Task.deleteMany({ assignedTo: userToDelete._id });
  return res
    .status(200)
    .json(new ApiResponse(200, null, "User deleted successfully"));
});

const getAllTask = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user || user.role !== "admin") {
    throw new ApiError("You are not authorised to view this route");
  }

  const tasks = await Task.find({
    assignedTo: { $ne: user._id },
  }).populate("assignedTo", "-password -_id -refreshToken");

  if (!tasks || tasks.length === 0) {
    return res.status(404).json(new ApiResponse(404, {}, "no task found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks fetched successfully!"));
});

export { getAllUsers, getUserById, deleteUser, getAllTask };
