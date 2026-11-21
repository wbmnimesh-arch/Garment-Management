const express = require("express");
const { mongoose } = require("../config/database");
const { User, ROLES } = require("../models/User");

function adminRoutes(auth) {
  const router = express.Router();
  router.use(auth.requireAuth, auth.allowRoles("The Owner", "Human Resources"));

  router.get("/pending-users", async (req, res) => {
    const users = await User.find({ status: "pending" }).select("fullName employeeId email role createdAt").sort({ createdAt: 1 }).lean();
    return res.json({ users });
  });

  router.patch("/users/:id/status", async (req, res) => {
    try {
      const { status } = req.body || {};
      if (!mongoose.isValidObjectId(req.params.id) || !["active", "disabled"].includes(status)) return res.status(400).json({ message: "Invalid user or status." });
      const target = await User.findById(req.params.id);
      if (!target) return res.status(404).json({ message: "User not found." });
      if (req.user.role !== "The Owner" && target.role !== "The Employee") return res.status(403).json({ message: "HR can only manage employee accounts." });
      if (target.id === req.user.id && status === "disabled") return res.status(400).json({ message: "You cannot disable your own account." });
      target.status = status;
      await target.save();
      return res.json({ message: `Account ${status}.` });
    } catch (error) {
      console.error("Account status update failed:", error.message);
      return res.status(500).json({ message: "Could not update the account." });
    }
  });

  router.patch("/users/:id/role", auth.allowRoles("The Owner"), async (req, res) => {
    try {
      const { role } = req.body || {};
      if (!mongoose.isValidObjectId(req.params.id) || !ROLES.includes(role)) return res.status(400).json({ message: "Invalid user or role." });
      const target = await User.findById(req.params.id);
      if (!target) return res.status(404).json({ message: "User not found." });
      if (target.role === "The Owner" && role !== "The Owner" && target.status === "active") {
        const otherOwners = await User.countDocuments({ role: "The Owner", status: "active", _id: { $ne: target._id } });
        if (!otherOwners) return res.status(400).json({ message: "Keep at least one active Owner account." });
      }
      target.role = role;
      await target.save();
      return res.json({ message: "User role updated." });
    } catch (error) {
      console.error("Role update failed:", error.message);
      return res.status(500).json({ message: "Could not update the user role." });
    }
  });

  return router;
}

module.exports = adminRoutes;
