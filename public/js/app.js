function irPara(pagina) {
  const content = document.getElementById("content");

  if (pagina === "funcionarios") {
    content.innerHTML = `
      <h1>Funcionários</h1>
      <button onclick="carregarFuncionarios()">Carregar</button>
      <ul id="lista"></ul>
    `;
  }

  if (pagina === "lancamentos") {
    content.innerHTML = `
      <h1>Lançamentos</h1>
      <p>Aqui vamos registrar eventos</p>
    `;
  }

  if (pagina === "relatorios") {
    content.innerHTML = `
      <h1>Relatórios</h1>
      <button onclick="gerarPDF()">Gerar PDF</button>
    `;
  }
}

/* ============================
   CADASTRAR FUNCIONÁRIOS
============================ */

async function cadastrarFuncionario() {
  const funcionario = {
    nome: document.getElementById("nome").value,
    data_admissao: document.getElementById("data_admissao").value,
    telefone: document.getElementById("telefone").value,
    pix: document.getElementById("pix").value,
    salario: parseFloat(document.getElementById("salario").value),
    bonificacao: parseFloat(document.getElementById("bonificacao").value),
    tipo_pagamento: document.getElementById("tipo_pagamento").value,
    vt_diario: parseFloat(document.getElementById("vt_diario").value)
  };

  await fetch("/funcionarios", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(funcionario)
  });

  alert("Funcionário cadastrado!");

  carregarFuncionarios();
}

/* ============================
   CARREGAR FUNCIONÁRIOS
============================ */

async function carregarFuncionarios() {
  const res = await fetch("/funcionarios");
  const dados = await res.json();

  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  dados.forEach(f => {
    const li = document.createElement("li");
    li.textContent = f.nome + " - R$ " + f.salario;
    lista.appendChild(li);
  });
}

/* ============================
   GERAR PDF
============================ */
function gerarPDF() {
  window.open("/gerar-pdf", "_blank");
}

function mostrarTela(tela) {
  document.getElementById("tela-funcionarios").style.display = "none";
  document.getElementById("tela-lancamentos").style.display = "none";
  document.getElementById("tela-folha").style.display = "none";

  document.getElementById("tela-" + tela).style.display = "block";
}