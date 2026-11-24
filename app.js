import express from "express";
import estudioRoute from "./src/routes/estudioRoute.js";
import desenvolvedorRoute from "./src/routes/desenvolvedorRoute.js";
import jogoRoute from "./src/routes/jogoRoute.js";
import { tratarErro } from "./src/middlewares/tratarErro.js";

const app = express();

app.use(express.json());

app.use("/estudios", estudioRoute);
app.use("/desenvolvedores", desenvolvedorRoute);
app.use("/jogos", jogoRoute);

app.use((req, res) => {
    res.status(404).json({ erro: "Rota não encontrada" });
});

app.use(tratarErro);

export default app;
