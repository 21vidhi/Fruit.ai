const express = require("express");
const router = express.Router();

let faqs = []; // In-memory database for FAQs

// GET /faqs: Fetch all FAQs
router.get("/", (req, res) => {
  res.json(faqs);
});

// GET /faqs/:id: Fetch a single FAQ by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const faq = faqs.find((f) => f.id == id);

  if (!faq) {
    return res.status(404).json({ msg: "FAQ not found" });
  }

  res.json(faq);
});

// POST /faqs: Create a new FAQ
router.post("/", (req, res) => {
  const { question, answer } = req.body;

  // Error handling if required fields are missing
  if (!question || !answer) {
    return res
      .status(400)
      .json({ msg: "Please provide both question and answer." });
  }

  const newFaq = { id: faqs.length + 1, question, answer };
  faqs.push(newFaq);
  res.status(201).json(newFaq);
});

// PUT /faqs/:id: Update a FAQ by ID
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { question, answer } = req.body;

  // Error handling for missing fields
  if (!question || !answer) {
    return res
      .status(400)
      .json({ msg: "Please provide both question and answer." });
  }

  const faqIndex = faqs.findIndex((f) => f.id == id);

  if (faqIndex === -1) {
    return res.status(404).json({ msg: "FAQ not found" });
  }

  faqs[faqIndex] = { id: Number(id), question, answer };
  res.json(faqs[faqIndex]);
});

// DELETE /faqs/:id: Delete a FAQ by ID
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const faqIndex = faqs.findIndex((f) => f.id == id);

  if (faqIndex === -1) {
    return res.status(404).json({ msg: "FAQ not found" });
  }

  faqs = faqs.filter((f) => f.id != id);
  res.json({ msg: "FAQ deleted" });
});

module.exports = router;
