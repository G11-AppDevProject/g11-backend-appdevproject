const mongoose = require("mongoose");

const ClearanceRequestSchema = new mongoose.Schema({
  faculty_id: { type: String, required: true },
  academic_year: { type: String, required: true },
  semester: { type: String, required: true },
  status: { type: String, default: "Pending" },
  submitted_on: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model(
  "ClearanceRequest",
  ClearanceRequestSchema,
  "clearance_request"
);
