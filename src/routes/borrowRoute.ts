import { Router } from "express";
import { verifyToken } from "../middleware/authorization";
import { createValidation, returnValidation, usageValidation } from "../middleware/borrowValidation";
import { analyzeItemUsage, analyzeUsage, createBorrow, returnItem } from "../controller/borrowController";
// import authorizeAdmin from "../middleware/authorizeAdminValidation";

const router = Router()

router.post(`/borrow`, [verifyToken, createValidation], createBorrow)
router.post(`/return`, [verifyToken, returnValidation], returnItem);
router.post(`/usage-report`, [verifyToken, usageValidation], analyzeUsage)
router.post(`/analysis`, [verifyToken], analyzeItemUsage);

export default router