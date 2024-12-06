import { Router } from "express";
import { verifyToken } from "../middleware/authorization";
import { createInventory, DeleteItem, readInventory, updateInventory } from "../controller/itemController";
import { createValidation, updateValidation } from "../middleware/itemsValidation";
// import authorizeAdmin from "../middleware/authorizeAdminValidation";
import { create } from "domain";

const router = Router()

router.post('/inventory', [verifyToken, createValidation], createInventory)
router.get('/inventory/:id?', [verifyToken], readInventory)
router.put('/inventor/:id', [verifyToken, updateValidation], updateInventory)
router.delete('/inventorydel/:id', [verifyToken], DeleteItem)

export default router