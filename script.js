window.onload = function () {
    // Função que lê os dados do HTML e gera o gráfico de Pareto
    window.gerarGrafico = function () {
        const linhas = document.querySelectorAll("#corpo-tabela tr");
        const dataPoints = [];

        for (let linha of linhas) {
            const defeito = linha.querySelector('input[type="text"]').value.trim();
            const quantidade = Number(linha.querySelector('input[type="number"]').value);

            if (defeito && !isNaN(quantidade) && quantidade >= 0) {
                dataPoints.push({ label: defeito, y: quantidade });
            }
        }

        if (dataPoints.length === 0) {
            alert("Por favor, preencha ao menos um defeito e quantidade válidos.");
            return;
        }

        // Ordena do maior para o menor (necessário para Pareto)
        dataPoints.sort((a, b) => b.y - a.y);

        // Cria o gráfico principal
        var chart = new CanvasJS.Chart("chartContainer", {
            title: {
                text: "Diagrama de Pareto"
            },
            axisY: {
                title: "Quantidade",
                lineColor: "#4F81BC",
                tickColor: "#4F81BC",
                labelFontColor: "#4F81BC"
            },
            axisY2: {
                title: "Percentual acumulado",
                suffix: "%",
                lineColor: "#C0504E",
                tickColor: "#C0504E",
                labelFontColor: "#C0504E"
            },
            data: [{
                type: "column",
                dataPoints: dataPoints
            }]
        });

        chart.render();
        createPareto(chart);
    };

    // Função que cria a linha de Pareto
    function createPareto(chart) {
        var dps = [];
        var yTotal = chart.data[0].dataPoints.reduce((sum, p) => sum + p.y, 0);
        var yPercent = 0;

        for (var i = 0; i < chart.data[0].dataPoints.length; i++) {
            var yValue = chart.data[0].dataPoints[i].y;
            yPercent += (yValue / yTotal * 100);
            dps.push({ label: chart.data[0].dataPoints[i].label, y: yPercent });
        }

        chart.addTo("data", {
            type: "line",
            yValueFormatString: "0.##\"%\"",
            dataPoints: dps
        });

        chart.data[1].set("axisYType", "secondary", false);
        chart.axisY[0].set("maximum", yTotal);
        chart.axisY2[0].set("maximum", 100);
    }

    // Mesmas funções para adicionar e remover linhas
    window.adicionarLinha = function () {
        const tabela = document.getElementById("corpo-tabela");
        const novaLinha = document.createElement("tr");
        novaLinha.innerHTML = `
            <td><input type="text" placeholder="Ex: Outro defeito"></td>
            <td><input type="number" placeholder="Ex: 5"></td>
            <td><button onclick="removerLinha(this)">Remover</button></td>
        `;
        tabela.appendChild(novaLinha);
    };

    window.removerLinha = function (botao) {
        const linha = botao.parentNode.parentNode;
        linha.remove();
    };
};
