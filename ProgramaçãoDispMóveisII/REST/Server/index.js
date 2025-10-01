const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const port = 3000;
const app = express();
app.use(cors());
app.use(methodOverride("X-HTTP-Method"));
app.use(methodOverride("X-HTTP-Method-Override"));
app.use(methodOverride("X-Method-Override"));
app.use(methodOverride("_method"));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
let url = "mongodb://localhost:27017/FatecVotorantim";
mongoose
  .connect(url)
  .then(() => console.log("MongoDB connected..."))
  .catch(() => {
    console.log("erro na conexão: ");
  });

var User = mongoose.model("Usuario", {
  nome: String,
  email: String,
  endereco: {
    cep: String,
    logradouro: String,
    cidade: String,
    bairro: String,
    estado: String,
    numero: String,
    complemento: String,
  },
  cursos: [String],
});

// inserir dados

app.post("/inserir", async (req, res) => {
  // espera { matricula, nome, email, endereco: {...}, cursos: [] }
  const payload = req.body || {};
  if (!payload.nome)
    return res
      .status(400)
      .json({ status: "erro", message: "nome é obrigatório" });
  try {
    const user = new User({
      matricula: payload.matricula,
      nome: payload.nome,
      email: payload.email,
      endereco: payload.endereco || {},
      cursos: Array.isArray(payload.cursos)
        ? payload.cursos
        : payload.cursos
        ? payload.cursos.split(",").map((s) => s.trim())
        : [],
    });
    const saved = await user.save();
    console.log("Usuário salvo com sucesso");
    res.json(saved);
  } catch (err) {
    console.error("Erro ao salvar usuário", err);
    res.status(500).json({ status: "erro", message: "falha ao salvar" });
  }
});

// deletar dados campo nome
app.delete("/deletar", async (req, res) => {
  let corpo = req.body.name;
  await User.deleteOne({ nome: corpo });
  res.json({ status: "deletado com sucesso" });
});

// DELETA POR ID
app.delete("/deletar/:id", async (req, res) => {
  let id = req.params.id;
  await User.deleteOne({ _id: id });
  res.json({ status: "deletado com sucesso" });
});

// ALTERAR DADOS

app.put("/alterar/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const payload = req.body || {};
    // usa $set para atualizar apenas os campos enviados
    await User.updateOne({ _id: id }, { $set: payload });
    const updated = await User.findOne({ _id: id });
    res.json(updated);
  } catch (err) {
    console.error("Erro ao alterar usuário", err);
    res.status(500).json({ status: "erro", message: "falha ao alterar" });
  }
});

// Middleware to parse JSON bodies rota
app.get("/", async (req, res) => {
  let user = await User.find({});
  if (user.length > 0) {
    res.json(user);
  } else {
    res.json({ status: "vazio" });
  }
});

// id
app.get("/:id", async (req, res) => {
  let id = req.params.id;
  let user = await User.findOne({ _id: id });
  res.json(user);
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
