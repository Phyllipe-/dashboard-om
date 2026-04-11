# 🗺️ Dashboard de Treino (OM)

Neste painel, pode visualizar a planta do ambiente virtual/físico processada com a semântica E3. Selecione o cenário de treino no menu abaixo para inspecionar os obstáculos e áreas de circulação.

```js
import { requireAuth, logout } from "./auth.js";
const currentUser = requireAuth();

// Preenche header com nome do usuário e liga botão de sair
const headerUser = document.getElementById("header-user");
const headerLogout = document.getElementById("header-logout");
if (headerUser) headerUser.textContent = currentUser.nome;
if (headerLogout) headerLogout.addEventListener("click", logout);
```

```js
// BLOCO 1: Carrega os dados
const todosMapas = await FileAttachment("data/mapas.json").json();
```
```js
// BLOCO 2: Cria o Menu (A variável nasce aqui)
const mapaSelecionado = view(Inputs.select(todosMapas, {
  label: "Selecione o Cenário:",
  format: d => d ? d.id : "Sem ID",
  value: todosMapas.length > 0 ? todosMapas[0] : null
}));
```
```js
// BLOCO 3: Renderização (A variável é lida aqui, noutro bloco!)
if (!mapaSelecionado) {
  display(html`<div style="color: orange;">Aguardando seleção do mapa...</div>`);
} else if (!mapaSelecionado.camadas) {
  display(html`<div style="color: red; font-weight: bold;">Erro: Propriedade 'camadas' desapareceu.</div>`);
} else {
  const directionIndicatorsPT_BR = ["Esquerda", "EsquerdaFrente", "Frente", "FrenteDireita", "Direita", "TrásDireita", "Trás", "EsquerdaTrás"];
  
  const camadasBrutas = mapaSelecionado.camadas;
  const { cols, rows } = camadasBrutas[0];
  const escalaDesejada = 16; 

  const ordemHierarquia = ["floor", "interactive_elements", "furniture", "eletronics", "utensils", "door_and_windows", "walls", "persons"];
  const camadasOrdenadas = camadasBrutas.sort((a, b) => {
     const indexA = ordemHierarquia.indexOf(a.layerName);
     const indexB = ordemHierarquia.indexOf(b.layerName);
     return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
  });

  const mapaFinal = Plot.plot({
    width: cols * escalaDesejada,
    height: rows * escalaDesejada,
    aspectRatio: 1,
    x: { domain: [0, cols], axis: null },
    y: { domain: [-rows, 0], axis: null },
    marks: [
      camadasOrdenadas.map(c => {
        if (c.layerName === "persons") {
          return Plot.dot(c.geojson.features, {
            x: d => d.geometry.coordinates[0], y: d => d.geometry.coordinates[1],
            r: escalaDesejada / 4, fill: "red", stroke: "black", strokeWidth: 1.5,
            title: d => `Personagem: ${d.properties.nomeAmigavel}\nDireção Inicial: ${directionIndicatorsPT_BR[d.properties.direcaoIndex]}`, tip: true
          });
        }
        return Plot.geo(c.geojson, {
          fill: d => {
            if (["walls", "door_and_windows", "furniture", "eletronics", "utensils", "interactive_elements"].includes(c.layerName)) return "transparent";
            if (c.layerName === "floor") return "#f0f0f0"; return "steelblue";
          },
          stroke: d => {
            if (c.layerName === "floor") return d.properties.areaInterna ? "#cccccc" : "none"; 
            if (c.layerName === "walls") return "#444";
            if (c.layerName === "door_and_windows") return "none";
            if (c.layerName === "interactive_elements") return "#0000FF";
            if (["furniture", "eletronics", "utensils"].includes(c.layerName)) {
              if (c.layerName === "furniture") return "#d95f02";  
              if (c.layerName === "eletronics") return "#377eb8"; 
              if (c.layerName === "utensils") return "#000000";   
            }
            return "none"; 
          },
          strokeWidth: d => (c.layerName === "floor") ? 0.5 : 1.5,
          strokeLinejoin: "round",
          title: d => `Objeto: ${d.properties.nomeAmigavel}\nCamada: ${d.properties.layerName}${c.layerName === "floor" ? (d.properties.areaInterna ? "\nAmbiente: Interno" : "\nAmbiente: Externo") : ""}`,
          tip: true 
        });
      })
    ]
  });

  display(mapaFinal);
}
```

