const express = require("express");
const db = require("./db");

const router = express.Router();

const STATUS_VALIDOS = ["valido", "utilizado", "cancelado", "suspeito", "duplicado"];

function validarIngresso(dados) {
  const camposObrigatorios = [
    "codigo",
    "nome_torcedor",
    "documento",
    "partida",
    "estadio",
    "setor",
    "assento",
    "valor",
    "status",
    "data_compra"
  ];

  const faltando = camposObrigatorios.filter((campo) => dados[campo] === undefined || dados[campo] === "");

  if (faltando.length > 0) {
    return `Campos obrigatorios ausentes: ${faltando.join(", ")}`;
  }

  if (!STATUS_VALIDOS.includes(String(dados.status).toLowerCase())) {
    return `Status invalido. Use: ${STATUS_VALIDOS.join(", ")}`;
  }

  if (Number.isNaN(Number(dados.valor)) || Number(dados.valor) < 0) {
    return "Valor deve ser um numero maior ou igual a zero";
  }

  return null;
}

router.get("/health", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.json({ status: "ok", banco: "conectado" });
  } catch (err) {
    res.status(500).json({ status: "erro", banco: "desconectado", erro: err.message });
  }
});

router.post("/ingressos", async (req, res) => {
  const dados = req.body;
  const erroValidacao = validarIngresso(dados || {});

  if (erroValidacao) {
    return res.status(400).json({ erro: erroValidacao });
  }

  try {
    const result = await db.query(
      `
      INSERT INTO ingressos
      (codigo, nome_torcedor, documento, partida, estadio, setor, assento, valor, status, data_compra)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *
      `,
      [
        dados.codigo,
        dados.nome_torcedor,
        dados.documento,
        dados.partida,
        dados.estadio,
        dados.setor,
        dados.assento,
        Number(dados.valor),
        String(dados.status).toLowerCase(),
        dados.data_compra
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ erro: "Codigo do ingresso ja cadastrado" });
    }

    res.status(500).json({ erro: err.message });
  }
});

router.get("/ingressos", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM ingressos ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.get("/ingressos/:id", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM ingressos WHERE id=$1",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: "Ingresso nao encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.put("/ingressos/:id", async (req, res) => {
  const statusNormalizado = String(req.body.status || "").toLowerCase();

  if (!STATUS_VALIDOS.includes(statusNormalizado)) {
    return res.status(400).json({ erro: `Status invalido. Use: ${STATUS_VALIDOS.join(", ")}` });
  }

  try {
    const result = await db.query(
      "UPDATE ingressos SET status=$1 WHERE id=$2 RETURNING *",
      [statusNormalizado, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: "Ingresso nao encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.delete("/ingressos/:id", async (req, res) => {
  try {
    const result = await db.query(
      "DELETE FROM ingressos WHERE id=$1 RETURNING *",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: "Ingresso nao encontrado" });
    }

    res.json({ mensagem: "Ingresso removido" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
