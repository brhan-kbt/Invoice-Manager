const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const invoiceController = require("../controllers/invoiceController");

const router = express.Router();

router.get("/", verifyToken, invoiceController.getAllInvoices);
router.get("/:id", verifyToken, invoiceController.getInvoiceById);
router.post("/", verifyToken, invoiceController.createInvoice);
router.put("/:id", verifyToken, invoiceController.updateInvoice);
router.delete("/:id", verifyToken, invoiceController.deleteInvoice);

module.exports = router;
