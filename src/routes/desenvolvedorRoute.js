import { Router } from "express";
import * as desenvolvedorController from "../controllers/desenvolvedorController.js";
import { validarId } from "../middlewares/validarId.js";

const router = Router();

router.get("/", desenvolvedorController.listar);
router.get("/:id", validarId, desenvolvedorController.buscarPorId);
router.post("/", desenvolvedorController.criar);
router.put("/:id", validarId, desenvolvedorController.atualizar);
router.delete("/:id", validarId, desenvolvedorController.excluir);

export default router;
