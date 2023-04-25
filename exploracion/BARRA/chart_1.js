d3.dsv(";", "/data/147_vehiculos_mal_estacionados.csv", d3.autoType).then((data) => {
  const datosFiltrados = data.filter(
    (d) => d.prestacion === "VEHÍCULO MAL ESTACIONADO"
  );
  const denunciasPorComuna = Array.from(
    d3.group(datosFiltrados, (d) => d.domicilio_comuna)
  ).map(([comuna, denuncias]) => ({
    comuna,
    count: denuncias.length,
    barrios: d3.group(denuncias, (d) => d.domicilio_barrio),
  }));

  denunciasPorComuna.sort((a, b) => b.count - a.count);

  const chart = Plot.plot({
    marks: [
      Plot.barY(denunciasPorComuna, {
        x: "comuna",
        y: "count",
        fill: "steelblue",
        title: (d) =>
          `Comuna ${d.comuna}\nDenuncias: ${d.count}\nBarrios: ${Array.from(
            d.barrios.keys()
          ).join(", ")}`,
        onMouseenter: (event, d) => barHover(event.currentTarget),
        onMouseleave: (event, d) => barUnhover(event.currentTarget),
      }),
      Plot.text(denunciasPorComuna, {
        x: "comuna",
        y: "count",
        text: "count",
        dy: -10,
        fill: "black",
        textAnchor: "middle",
      }),
    ],
    y: {
      label: "Cantidad de denuncias",
      domain: [0, 1300],
      tickFormat: () => "",
      tickSize: () => "",
      grid: true,
    },
    x: {
      label: "Comuna",
      labelPadding: 30,
      tickPadding: 1.5,
      tickRotate: -45,
      tickAnchor: "end",
      grid: true,
      domain: denunciasPorComuna.map((d) => d.comuna),
      clip: false,
    },
    width: 960,
    height: 500,
    marginTop: 10,
    marginLeft: 70,
    marginBottom: 50,
  });

  // Renderizar el gráfico dentro del elemento SVG
  d3.select("#chart").node().appendChild(chart);

  // Guardar el gráfico como un archivo SVG
  const chartNode = d3.select("#chart").node();
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(chartNode);

  // Descargar el gráfico como archivo SVG
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "chart.svg";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
});
