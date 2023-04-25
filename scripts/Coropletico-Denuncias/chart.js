const mapaFetch = d3.json('../data/barrios-caba.geojson');
const dataFetch = d3.dsv(';', '../data/147_vehiculos_mal_estacionados.csv', d3.autoType);

Promise.all([mapaFetch, dataFetch]).then(([barrios, data]) => {
  const datosFiltrados = data.filter((d) => d.prestacion === 'VEHÍCULO MAL ESTACIONADO');
  const reclamosPorBarrio = d3.group(datosFiltrados, (d) => d.domicilio_barrio);

  const totalDenuncias = datosFiltrados.length;



  let chartMap = Plot.plot({
    projection: {
      type: 'mercator',
      domain: barrios,
    },
    color: {
      type: 'quantize',
      n: 10,
      scheme: 'ylorbr',
      label: 'Porcentaje de denuncias por barrio',
      legend: false,
    },
    marks: [
      Plot.geo(barrios, {
        fill: (d) => {
          let nombreBarrio = d.properties.BARRIO;
          let totalReclamos = reclamosPorBarrio.get(nombreBarrio).length;
          let porcentaje = (totalReclamos / totalDenuncias) * 100;
          return porcentaje;
        },
        stroke: '#ccc',
        title: (d) => {
          let nombreBarrio = d.properties.BARRIO;
          let totalReclamos = reclamosPorBarrio.get(nombreBarrio).length;
          let porcentaje = (totalReclamos / totalDenuncias) * 100;
          return `${nombreBarrio}`;
        },
      }),
      Plot.text(
        barrios.features,
        Plot.centroid({
          text: (d) => {
            let nombreBarrio = d.properties.BARRIO;
            let totalReclamos = reclamosPorBarrio.get(nombreBarrio).length;
            let porcentaje = (totalReclamos / totalDenuncias) * 100;
            return `${porcentaje.toFixed(2)}%`;
            
          },
          fill: "black",
          stroke: "white",
          textAnchor: "middle",
          dx: 4,
          fontSize: 10,
        })
      ),
    ],
  });

  d3.select('#chart').append(() => chartMap);
});