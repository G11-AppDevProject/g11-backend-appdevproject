const express = require("express");
const router = express.Router();
const ClearanceReport = require("../models/clearanceReportModel");

// ===============================
// CREATE department clearance report
// ===============================
router.post("/", async (req, res) => {
  try {
    const {
      faculty_id,
      department,
      status,
      remarks,
      submitted_on,
      academic_year,
      semester,
      required_documents,
      request_id,
      download_url
    } = req.body;

    // Prevent duplicate department
    const exists = await ClearanceReport.findOne({
      faculty_id,
      academic_year,
      semester,
      department
    });

    if (exists) {
      return res.status(400).json({
        message: "This department already has a clearance report"
      });
    }

    const newReport = await ClearanceReport.create({
      faculty_id,
      department,
      status,
      remarks,
      submitted_on,
      academic_year,
      semester,
      required_documents,
      request_id,
      download_url
    });

    res.status(201).json(newReport);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ===============================
// GET all clearance reports for a faculty
// ===============================
router.get("/:facultyId", async (req, res) => {
  try {
    const facultyId = req.params.facultyId;

    const reports = await ClearanceReport.find({
      faculty_id: facultyId
    });

    if (reports.length === 0) {
      return res.status(404).json({ message: "No clearance reports found" });
    }

    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ===============================
// UPDATE a specific department report
// ===============================
router.put("/:id", async (req, res) => {
  try {
    const updated = await ClearanceReport.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ===============================
// DELETE a department report
// ===============================
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await ClearanceReport.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({ message: "Report deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
