import { Router } from "express";
import {
  isLoggedIn,
  refreshAccessToken,
  registerUser,
  userLogin,
  userLogout,
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(userLogin);
router.route("/logout").post(verifyJWT, userLogout);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/check-auth").get(verifyJWT, isLoggedIn);

export { router };
