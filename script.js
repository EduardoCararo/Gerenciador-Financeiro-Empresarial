const form = document.getElementById("form");
const tabela = document.getElementById("tabela");
const graficoCtx = document.getElementById("grafico").getContext("2d");

let lancamentos = JSON.parse(localStorage.getItem("lancamentos")) || [];

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = document.getElementById("data").value;
  const descricao = document.getElementById("descricao").value;
  const valor = parseFloat(document.getElementById("valor").value);
  const tipo = document.getElementById("tipo").value;

  lancamentos.push({ data, descricao, valor, tipo });
  localStorage.setItem("lancamentos", JSON.stringify(lancamentos));
  form.reset();

  renderTabela();
  renderGrafico();
});

function excluirLancamento(index) {
  lancamentos.splice(index, 1); // Remove o item da lista
  localStorage.setItem("lancamentos", JSON.stringify(lancamentos)); // Atualiza o armazenamento
  renderTabela(); // Atualiza a tabela
  renderGrafico(); // Atualiza o gráfico
}

function renderTabela() {
  tabela.innerHTML = "";
  lancamentos.forEach(({ data, descricao, valor, tipo }, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="p-2">${data}</td>
      <td class="p-2">${descricao}</td>
      <td class="p-2 ${tipo === "saida" ? "text-red-500" : "text-green-500"}">R$ ${valor.toFixed(2)}</td>
      <td class="p-2">${tipo}</td>
      <td class="p-2">
        <button onclick="excluirLancamento(${index})" class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">Excluir</button>
      </td>
    `;
    tabela.appendChild(tr);
  });
}

function renderGrafico() {
  const datas = {};
  lancamentos.forEach(({ data, valor, tipo }) => {
    if (!datas[data]) datas[data] = 0;
    datas[data] += tipo === "entrada" ? valor : -valor;
  });

  const labels = Object.keys(datas);
  const valores = Object.values(datas);

  if (window.myChart) window.myChart.destroy();

  window.myChart = new Chart(graficoCtx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Lucro/Prejuízo",
        data: valores,
        borderColor: "cyan",
        backgroundColor: "rgba(0, 255, 255, 0.1)",
        tension: 0.4,
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

renderTabela();
renderGrafico();
