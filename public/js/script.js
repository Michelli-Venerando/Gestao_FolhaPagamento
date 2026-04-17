/*function irPara(pagina) {
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
}*/

/* ============================
   CARREGAR FUNCIONÁRIOS
============================ */

async function carregarFuncionarios() {
  const res = await fetch("/funcionarios");
  const dados = await res.json();

  const tabela = document.getElementById("listaFuncionarios");
  tabela.innerHTML = "";

  dados.forEach(func => {
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
   CARREGAR FUNCIONÁRIOS
============================ */
/*async function carregarFuncionarios() {
  const res = await fetch("/funcionarios");
  const dados = await res.json();

  //const tabela = document.getElementById("listaFuncionarios");
  const tabela = document.getElementById("lista");
  tabela.innerHTML = "";

  /*dados.forEach(func => {
    tabela.innerHTML += `
      <tr>
        <td>${func.nome}</td>
        <td>${func.cargo}</td>
        <td>${formatarMoeda(func.salario)}</td>
        <td>
          <button onclick="editarFuncionario('${func.id}', '${func.nome}', '${func.cargo}', '${func.salario}')">
            Editar
          </button>
        </td>
      </tr>
    `;
  });*/
  dados.forEach(func => {
  tabela.innerHTML += `
    <li>
      ${func.nome} - R$ ${func.salario}
      <button onclick="editarFuncionario('${func.id}', '${func.nome}', '${func.salario}')">Editar</button>
      <button onclick="excluirFuncionario('${func.id}')">Excluir</button>
    </li>
  `;
});


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
   SALVAR
============================ */
/*async function salvarFuncionario() {
  const id = document.getElementById("idFuncionario").value;
  const nome = document.getElementById("nome").value;
  const cargo = document.getElementById("cargo").value;
  const salario = document.getElementById("salario").value;

  const metodo = id ? "PUT" : "POST";
  const url = id ? `/funcionarios/${id}` : "/funcionarios";

  await fetch(url, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, cargo, salario })
  });

  limparFormulario();
  carregarFuncionarios();
}*/

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
/*function limparFormulario() {
  document.getElementById("idFuncionario").value = "";
  document.getElementById("nome").value = "";
  document.getElementById("cargo").value = "";
  document.getElementById("salario").value = "";
}
function limparFormulario() {
  document.getElementById("idFuncionario").value = "";
  document.getElementById("nome").value = "";
  document.getElementById("cargo").value = "";
  document.getElementById("salario").value = "";
  document.getElementById("bonificacao").value = "";
  document.getElementById("vt_diario").value = "";
}
*/
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