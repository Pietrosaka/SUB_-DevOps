require("dotenv").config();

const express = require("express");
const cors = require("cors");

const routes = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.get("/", (req, res) => {
    res.json({
        projeto: "Stadium Control API",
        descricao: "Sistema de controle de ingressos para jogos da Copa do Mundo",
        rotas: {
            health: "/api/health",
            ingressos: "/api/ingressos"
        }
    });
});

const port = process.env.PORT || 3000;

app.listen(
    port,
    () => console.log(`API rodando na porta ${port}`)
);
