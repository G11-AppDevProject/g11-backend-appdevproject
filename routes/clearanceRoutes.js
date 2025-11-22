const express = require("express");
const router = express.Router();
const ClearanceRequest = require("../models/clearanceRequestModel");

// CREATE clearance request
router.post("/request", async (req, res) => {
  try {
    const { faculty_id, academic_year, semester } = req.body;

    // Check if already exists
    const exists = await ClearanceRequest.findOne({
      faculty_id,
      academic_year,
      semester,
    });

    if (exists) {
      return res.status(400).json({ message: "Request already exists" });
    }

    const newReq = await ClearanceRequest.create({
      faculty_id,
      academic_year,
      semester,
    });

    res.status(201).json(newReq);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET request by faculty
router.get("/request/:facultyId", async (req, res) => {
  try {
    const requests = await ClearanceRequest.find({
      faculty_id: req.params.facultyId,
    });

    if (requests.length === 0) {
      return res.status(404).json({ message: "No clearance requests found" });
    }

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH update status of request
router.patch("/request/:id", async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "status required" });

    const updated = await ClearanceRequest.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true }
    ).lean();

    if (!updated) return res.status(404).json({ message: "Not found" });

    res.status(200).json({ message: "Updated", data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all clearance requests with filters (for admin)
router.get("/requests", async (req, res) => {
  try {
    const { year, semester } = req.query; // Get year and semester from query params
    const filter = {}; // Initialize an empty filter object

    // Apply filters if year or semester are provided
    if (year) filter.academic_year = year;
    if (semester) filter.semester = semester;

    const docs = await ClearanceRequest.find(filter).lean();

    if (docs.length === 0) {
      return res.status(404).json({ message: "No clearance requests found" });
    }

    res.status(200).json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
