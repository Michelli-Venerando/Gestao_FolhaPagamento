import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import PDFDocument from "pdfkit";
import path from "path";

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static("public"));
app.use(express.json()); 

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

app.get("/", (req, res) => {
  res.sendFile(path.resolve("public/index.html"));
});

/* ============================
   FUNCIONÁRIOS
============================ */

app.post('/funcionarios', async (req, res) => {
  const { data, error } = await supabase
    .from('funcionarios')
    .insert([req.body])

  if (error) return res.status(400).json(error)

  res.json(data)
})

app.get('/funcionarios', async (req, res) => {
  const { data, error } = await supabase
    .from('funcionarios')
    .select('*')

  if (error) return res.status(400).json(error)

  res.json(data)
})

/* ============================
  EDITAR FUNCIONÁRIOS
============================ */
/*app.put("/funcionarios/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, salario, cargo } = req.body;

  try {
    const { data, error } = await supabase
      .from("funcionarios")
      .update({ nome, salario, cargo })
      .eq("id", id)
      .select();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});*/

app.put("/funcionarios/:id", async (req, res) => {
  const { id } = req.params;

  const {
    nome,
    salario,
    bonificacao,
    vt_diario,
    telefone,
    pix,
    tipo_pagamento
  } = req.body;

  const { data, error } = await supabase
    .from("funcionarios")
    .update({
      nome,
      salario,
      bonificacao,
      vt_diario,
      telefone,
      pix,
      tipo_pagamento
    })
    .eq("id", id)
    .select();

  if (error) return res.status(500).json(error);

  res.json(data);
});

/* ============================
   DESCONTOS
============================ */

app.post('/descontos', async (req, res) => {
  const { data, error } = await supabase
    .from('descontos')
    .insert([req.body])

  if (error) return res.status(400).json(error)

  res.json(data)
})

/* ============================
   FALTAS
============================ */

app.post('/faltas', async (req, res) => {
  const { data, error } = await supabase
    .from('faltas_atrasos')
    .insert([req.body])

  if (error) return res.status(400).json(error)

  res.json(data)
})

/* ============================
   CALCULAR FOLHA
============================ */

app.post('/calcular-folha', async (req, res) => {
  const { funcionario_id, inicio, fim } = req.body

  // buscar funcionário
  const { data: func } = await supabase
    .from('funcionarios')
    .select('*')
    .eq('id', funcionario_id)
    .single()

  // buscar faltas
  const { data: faltas } = await supabase
    .from('faltas_atrasos')
    .select('*')
    .eq('funcionario_id', funcionario_id)
    .gte('data', inicio)
    .lte('data', fim)

  // buscar descontos
  const { data: descontos } = await supabase
    .from('descontos')
    .select('*')
    .eq('funcionario_id', funcionario_id)

  const salarioDia =
    func.tipo_pagamento === 'mensal'
      ? func.salario / 30
      : func.salario / 7

  let faltasQtd = 0
  let teveAtraso = false

  faltas.forEach(f => {
    if (f.tipo === 'falta') faltasQtd++
    if (f.tipo === 'atraso') teveAtraso = true
  })

  let descontoFaltas = faltasQtd * (salarioDia + func.vt_diario)

  let totalDescontos = descontos.reduce((acc, d) => acc + Number(d.valor), 0)

  let bonificacao = (faltasQtd > 0 || teveAtraso) ? 0 : func.bonificacao

  let valorBruto = func.salario
  let valorFinal = valorBruto + bonificacao - totalDescontos - descontoFaltas

  res.json({
    valorBruto,
    bonificacao,
    descontoFaltas,
    totalDescontos,
    valorFinal
  })
})

app.listen(process.env.PORT, () => {
  console.log('Servidor rodando 🚀')
})


/* ============================
   GERAR PDF
============================ */

app.get("/gerar-pdf", async (req, res) => {
  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  doc.pipe(res);

  doc.fontSize(18).text("Folha de Pagamento", { align: "center" });

  doc.moveDown();
  doc.text("Funcionário: João");
  doc.text("Salário: R$ 2.000");

  doc.end();
});

/* ============================
   EXCLUIR
============================ */
app.delete("/funcionarios/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("funcionarios")
    .delete()
    .eq("id", id);

  if (error) return res.status(500).json(error);

  res.json({ success: true });
});