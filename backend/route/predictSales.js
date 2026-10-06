const express = require('express');
const { PythonShell } = require('python-shell');
const path = require('path');
const { authenticateUser, authorizeRole } = require('../middleware/AuthMiddleware');
const router = express.Router();

const validDate = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;

router.post('/predict-sales', authenticateUser, authorizeRole(['admin', 'manager']), (req, res) => {
  const { sale_date } = req.body;
  if (!validDate(sale_date)) return res.status(400).json({ error: 'A valid sale_date in YYYY-MM-DD format is required' });

  let options = {
    mode: 'text',
    pythonOptions: ['-u'],
    scriptPath: path.resolve(__dirname, '../ml_models'), // existing configured model path
    args: [sale_date]
  };

  PythonShell.run('predict_sales.py', options, function (err, results) {
    if (err) {
      console.error('Prediction Error:', err.message);
      return res.status(500).json({ error: 'Prediction failed' });
    }
    res.json({ predicted_quantity: results?.[0] });
  });
});

module.exports = router;
