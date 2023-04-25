const mapaFetch = d3.json('/data/barrios-caba.geojson')
const dataFetch = d3.dsv(';', '/data/147_vehiculos_mal_estacionados.csv', d3.autoType)

Promise.all([mapaFetch, dataFetch]).then(([barrios, data]) => {
  const dataBoti = data.filter(d => d.canal === 'Boti');
  
  const reclamosPorBarrio = d3.group(data, d => d.domicilio_barrio)
  const reclamosBotiPorBarrio = d3.group(dataBoti, d => d.domicilio_barrio)
  
  let chartMap = Plot.plot({
    projection: {
      type: 'mercator',
      domain: barrios,
    },
    color: {
      type: 'quantize',
      n: 10,
      scheme: 'ylorbr',
      label: 'Porcentaje de denuncias con Boti',
      legend: true,
    },
    marks: [
      Plot.geo(barrios, {
        fill: d => {
          let nombreBarrio = d.properties.BARRIO
          let totalReclamos = reclamosPorBarrio.get(nombreBarrio).length
          let botiReclamos = reclamosBotiPorBarrio.get(nombreBarrio)?.length || 0
          let porcentajeBoti = (botiReclamos / totalReclamos) * 100
          return porcentajeBoti
        },
        stroke: '#ccc',
        title: d => {
          let nombreBarrio = d.properties.BARRIO
          let totalReclamos = reclamosPorBarrio.get(nombreBarrio).length
          let botiReclamos = reclamosBotiPorBarrio.get(nombreBarrio)?.length || 0
          let porcentajeBoti = (botiReclamos / totalReclamos) * 100
          return `${nombreBarrio}\n${porcentajeBoti.toFixed(2)}% denuncias con Boti`
        },
      }),
    ],
  })

  d3.select('#chart').append(() => chartMap)
})
