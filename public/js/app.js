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

function gerarPDF() {
  window.open("/gerar-pdf", "_blank");
}