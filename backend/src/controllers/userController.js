import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/User.js";

export const getMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("_id name email role createdAt");

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  return res.status(200).json({ success: true, data: user });
});
