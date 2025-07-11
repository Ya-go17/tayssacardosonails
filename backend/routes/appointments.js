const express = require('express');
const router = express.Router();

// Rota exemplo
router.get('/', (req, res) => {
  res.json({ message: 'Lista de agendamentos' });
});

module.exports = router;