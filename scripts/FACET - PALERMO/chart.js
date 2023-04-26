// config. fecha español
d3.json('https://cdn.jsdelivr.net/npm/d3-time-format@3/locale/es-ES.json').then(locale => {
  d3.timeFormatDefaultLocale(locale)
})

const mapaFetch = d3.json('../../data/palermo.geojson');
const dataFetch = d3.dsv(';', '../data/147_vehiculos_mal_estacionados.csv', d3.autoType);

Promise.all([mapaFetch, dataFetch]).then(([barrios, data]) => {
  const datosFiltrados = data.filter((d) => d.prestacion === 'VEHÍCULO MAL ESTACIONADO' && d.domicilio_barrio === 'PALERMO');
  const denunciasPorBarrio = d3.group(datosFiltrados, (d) => d.domicilio_barrio);

  barrios.features.forEach((feature) => {
    const barrio = feature.properties.BARRIO;
    feature.properties.DENUNCIAS = denunciasPorBarrio.get(barrio)?.length;
  });
  
  /* Mapa Coroplético */
  let chartMap = Plot.plot({
    // https://github.com/observablehq/plot#projection-options
    projection: {
      type: 'mercator',
      domain: barrios, // Objeto GeoJson a encuadrar
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
        thresholds: 30,
      }),
      Plot.geo(barrios, {
        stroke: 'grey',
        fill: 'transparent',
        title: (d) => `${d.properties.BARRIO}\n${d.properties.DENUNCIAS} denuncias`,
      }),
      
    ],
    facet: {
      data: datosFiltrados,
      x: d => d3.timeFormat('%a')(d3.timeParse('%d/%m/%Y')(d.fecha_ingreso)),
    },
    fx: {
      domain: ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom']
    },
    width: 1000
  })

  /* Agregamos al DOM la visualización chartMap */
  d3.select('#chart').append(() => chartMap)
})

