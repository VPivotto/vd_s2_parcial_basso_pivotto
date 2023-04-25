const mapaFetch = d3.json('/data/barrios-caba.geojson');
const dataFetch = d3.dsv(';', '/data/147_vehiculos_mal_estacionados.csv', d3.autoType);

Promise.all([mapaFetch, dataFetch]).then(([barrios, data]) => {
  const datosFiltrados = data.filter((d) => d.prestacion === 'REMOCIÓN DE VEHÍCULO / AUTO ABANDONADO');
  const denunciasPorBarrio = d3.group(datosFiltrados, (d) => d.domicilio_barrio);

  barrios.features.forEach((feature) => {
    const barrio = feature.properties.BARRIO;
    feature.properties.DENUNCIAS = denunciasPorBarrio.get(barrio)?.length;
  });

  let chartMap = Plot.plot({
    projection: {
      type: 'mercator',
      domain: barrios,
    },
    color: {
      scheme: 'greens'
    },
    marks: [
      Plot.density(datosFiltrados, {
        x: 'lon',
        y: 'lat',
        fill: 'density',
        bandwidth: 15,
        thresholds: 30,
      }),
      Plot.geo(barrios, {
        stroke: 'gray',
        fill: 'none',
        title: (d) => `${d.properties.BARRIO}\n${d.properties.DENUNCIAS} denuncias`,
      }),
      
      Plot.text(
        barrios.features,
        Plot.centroid({
          text: (d) => d.properties.BARRIO,
          fill: "black",
          stroke: "white",
          textAnchor: "center",
          dx: 4,
          fontSize: 8,
          filter: (d) => d.properties.DENUNCIAS > 10
        })
      )
    ],
  });

  d3.select('#chart').append(() => chartMap);
});




