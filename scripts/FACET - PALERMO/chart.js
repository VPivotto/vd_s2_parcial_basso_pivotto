// config. fecha español
d3.json('https://cdn.jsdelivr.net/npm/d3-time-format@3/locale/es-ES.json').then(locale => {
  d3.timeFormatDefaultLocale(locale)
})

const mapaFetch = d3.json('palermo.geojson');
const dataFetch = d3.dsv(';', '147_vehiculos_mal_estacionados.csv', d3.autoType);

Promise.all([mapaFetch, dataFetch]).then(([barrios, data]) => {
  const datosFiltrados = data.filter((d) => d.prestacion === 'VEHÍCULO MAL ESTACIONADO' && d.domicilio_barrio === 'PALERMO');
  const denunciasPorBarrio = d3.group(datosFiltrados, (d) => d.domicilio_barrio);

  barrios.features.forEach((feature) => {
    const barrio = feature.properties.BARRIO;
    feature.properties.DENUNCIAS = denunciasPorBarrio.get(barrio)?.length;
  });
  
  /* Mapa Coroplético */
  let chartMap = Plot.plot({
    projection: {
      type: 'mercator',
      domain: barrios,
    },
    color: {
      scheme: 'ylorbr',
    },
    marks: [
      Plot.density(datosFiltrados, {
        x: 'lon',
        y: 'lat',
        fill: 'density',
        bandwidth: 1,
        thresholds: 1000,
      }),
      Plot.geo(barrios, {
        stroke: 'grey',
        fill: 'transparent',
        title: (d) => `${d.properties.BARRIO}\n${d.properties.DENUNCIAS} denuncias`,
      }),
      Plot.text(
        [{lon: -58.445, lat: -34.577}],
        {
          x: 'lon',
          y: 'lat',
          text: (d) => "Plaza Dumont",
          fill: "black",
          stroke: "white",
          textAnchor: "center",
          dx: 4,
          fontSize: 10,
        }
        ),
    ],
    facet: {
      data: datosFiltrados,
      x: d => {
        const dayOfWeek = d3.timeParse('%d/%m/%Y')(d.fecha_ingreso).getDay();
        return dayOfWeek >= 1 && dayOfWeek <= 5 ? 'Lunes-Viernes' :  'Sábado-Domingo';
      },
    },
    fx: {
      domain: ['Lunes-Viernes', 'Sábado-Domingo']
    },
    width: 1000
  })

  d3.select('#chart').append(() => chartMap)
})
