
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt')
// Dentro do server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Conexão com MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Conectado ao MongoDB");
}).catch((err) => {
    console.error("Erro ao conectar no MongoDB:", err);
});

// Schema e Model de Usuário
const usuarioSchema = new mongoose.Schema({
    nome: String,
    email: String,
    senha: String
});
const Usuario = mongoose.model('Usuario', usuarioSchema);






// Rota de login
app.post('/api/login',
  [
    body('email').isEmail().withMessage('Email inválido.'),
    body('senha').notEmpty().withMessage('Senha é obrigatória.')
  ],
  async (req, res) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.status(400).json({ success: false, errors: erros.array() });
    }

    const { email, senha } = req.body;

    try {
      const usuario = await Usuario.findOne({ email });

      if (!usuario) {
        return res.json({ success: false, message: "Email não encontrado." });
      }

      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
      if (!senhaCorreta) {
        return res.json({ success: false, message: "Senha incorreta." });
      }

      return res.json({ success: true, message: "Login bem-sucedido." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Erro no servidor." });
    }
  }
);











// Rota de cadastro
app.post("/api/cadastrar",
  [
    body('nome').notEmpty().withMessage('Nome é obrigatório.'),
    body('email').isEmail().withMessage('Email inválido.'),
    body('senha').isLength({ min: 8 }).withMessage('A senha deve ter no mínimo 8 caracteres.')
  ],
  async (req, res) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.status(400).json({ success: false, errors: erros.array() });
    }

    const { nome, email, senha } = req.body;

    try {
      const usuarioExistente = await Usuario.findOne({ email });
      if (usuarioExistente) {
        return res.json({ success: false, message: "Email já cadastrado." });
      }

      const hashedPassword = await bcrypt.hash(senha, 10);
      const novoUsuario = new Usuario({ nome, email, senha: hashedPassword });
      await novoUsuario.save();

      res.json({ success: true, message: "Usuário cadastrado com sucesso." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Erro ao salvar usuário." });
    }
  }
);