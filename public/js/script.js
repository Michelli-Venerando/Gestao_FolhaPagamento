/* ============================
   CARREGAR FUNCIONÁRIOS
============================ */

async function carregarFuncionarios() {
  const res = await fetch("/funcionarios");
  const funcionarios = await res.json();

  const select = document.getElementById("funcionarioLancamento");
  select.innerHTML = "";

  funcionarios.forEach(f => {
    select.innerHTML += `<option value="${f.id}">${f.nome}</option>`;
  });

  const tabela = document.getElementById("listaFuncionarios");
  tabela.innerHTML = "";

  funcionarios.forEach(func => {
    tabela.innerHTML += `
      <tr>
        <td>${func.nome}</td>
        <td>R$ ${func.salario}</td>
        <td>
          <button class="btn btn-primary" onclick='editarFuncionario(${JSON.stringify(func)})'>Editar</button>
          <button class="btn btn-danger" onclick="excluirFuncionario('${func.id}')">Excluir</button>
        </td>
      </tr>
    `;
  });
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
   EXCLUIR
============================ */
async function excluirFuncionario(id) {
  if (!confirm("Deseja excluir?")) return;

  await fetch(`/funcionarios/${id}`, {
    method: "DELETE"
  });

  carregarFuncionarios();
}

/* ============================
   EDITAR
============================ */
function editarFuncionario(func) {
  document.getElementById("idFuncionario").value = func.id;
  document.getElementById("nome").value = func.nome;
  document.getElementById("data_admissao").value = func.data_admissao;
  document.getElementById("telefone").value = func.telefone;
  document.getElementById("pix").value = func.pix;
  document.getElementById("salario").value = func.salario;
  document.getElementById("bonificacao").value = func.bonificacao;
  document.getElementById("vt_diario").value = func.vt_diario;
  document.getElementById("tipo_pagamento").value = func.tipo_pagamento;
}


/* ============================
   SALVAR FUNCIOÁRIOS
============================ */
async function salvarFuncionario() {
  const id = document.getElementById("idFuncionario").value;

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

  const metodo = id ? "PUT" : "POST";
  const url = id ? `/funcionarios/${id}` : "/funcionarios";

  await fetch(url, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(funcionario)
  });

  limparFormulario();
  carregarFuncionarios();
}

/* ============================
   LIMPAR FORMULARIO
============================ */
function limparFormulario() {
  document.getElementById("idFuncionario").value = "";
  document.getElementById("nome").value = "";
  document.getElementById("data_admissao").value = "";
  document.getElementById("telefone").value = "";
  document.getElementById("pix").value = "";
  document.getElementById("salario").value = "";
  document.getElementById("bonificacao").value = "";
  document.getElementById("vt_diario").value = "";
}


/* ============================
   SALVAR LANÇAMENTOS
============================ */
async function salvarLancamento() {
  const funcionario_id = document.getElementById("funcionarioLancamento").value;
  const data = document.getElementById("dataLancamento").value;
  const tipo = document.getElementById("tipoLancamento").value;
  const valor = document.getElementById("valorLancamento").value;

  if (tipo === "falta" || tipo === "atraso") {
    await fetch("/faltas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        funcionario_id,
        data,
        tipo
      })
    });
  }

 if (tipo === "desconto") {
  const data = document.getElementById("dataLancamento").value;
  //const descricao = document.getElementById("obsLancamento").value;
  let descricao = document.getElementById("obsLancamento").value;

if (descricao === "Outros") {
  descricao = document.getElementById("obsOutro").value;
}

  await fetch("/descontos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      funcionario_id,
      valor,
      data_desconto: data,
      descricao,
      data_aplicacao: data
    })
  });
}

  alert("Lançamento salvo!");
}

/* ============================
   ABRIR LANÇAMENTO
============================ */
function abrirLancamentos() {
  document.getElementById("tela-funcionarios").style.display = "none";
  document.getElementById("tela-lancamentos").style.display = "block";

  carregarFuncionarios();
}
/* ============================
   GERAR PDF
============================ */
function gerarPDF() {
  window.open("/gerar-pdf", "_blank");
}

/* ============================
   MOSTRAR TELA
============================ */
function mostrarTela(tela) {
  document.getElementById("tela-funcionarios").style.display = "none";
  document.getElementById("tela-lancamentos").style.display = "none";
  document.getElementById("tela-folha").style.display = "none";

  document.getElementById("tela-" + tela).style.display = "block";

    if (tela === "lancamentos") {
    carregarFuncionarios(); // 🔥 GARANTE que carrega
  }

  function toggleOutroCampo() {
  const tipo = document.getElementById("obsLancamento").value;
  const campo = document.getElementById("obsOutro");

  campo.style.display = tipo === "Outros" ? "block" : "none";
}
}

document.addEventListener("DOMContentLoaded", () => {
  carregarFuncionarios();
});