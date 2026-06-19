const db = require("./db");
const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// حفظ فاتورة
app.post("/api/invoices", async (req, res) => {
  try {
    const { port, declaration, date, total } = req.body;

    const [result] = await db.execute(
      `INSERT INTO invoices
      (port, declaration, invoice_date, total_amount)
      VALUES (?, ?, ?, ?)`,
      [port, declaration, date, total],
    );

    res.json({
      success: true,
      invoiceId: result.insertId,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// عرض الفواتير
app.get("/api/check", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM invoices ORDER BY invoice_id DESC",
    );

    res.json(rows);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
