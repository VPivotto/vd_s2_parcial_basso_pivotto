const mapaFetch = d3.json('../../data/palermo.geojson');
const callesPalermo = d3.json('../../data/callesPalermo.geojson');
const dataFetch = d3.dsv(';', '../../data/147_vehiculos_mal_estacionados.csv', d3.autoType);

Promise.all([mapaFetch, callesPalermo, dataFetch]).then(([palermo, callesPalermo, data]) => {
  const datosFiltrados = data.filter((d) => d.domicilio_barrio === 'PALERMO' && d.prestacion === 'VEHÍCULO MAL ESTACIONADO');
  const datosFiltradosMalEstacionado = data.filter((d) => d.prestacion === 'VEHÍCULO MAL ESTACIONADO');
  const denunciasPorBarrio = d3.group(datosFiltrados, (d) => d.domicilio_barrio);
  const denunciasTotales = d3.group(datosFiltradosMalEstacionado, (d) =>d.domicilio_barrio);
  const totalDenuncias = Array.from(denunciasTotales.values()).flat().length;
  
  palermo.features.forEach((feature) => {
    const barrio = feature.properties.BARRIO;
    feature.properties.DENUNCIAS = denunciasPorBarrio.get(barrio)?.length;
    
  });

  let chartMap = Plot.plot({
    projection: {
      type: 'mercator',
      domain: palermo, // Objeto GeoJson a encuadrar
    },
    color:{
      scheme: 'ylorbr'
    },
    marks: [
      Plot.density(datosFiltrados,{
        x: 'lon',
        y: 'lat',
        fill: 'density',
        bandwidth: 15,
        thresholds: 30,
      }),
      Plot.geo(palermo, {
        stroke: 'gray',
        fill: 'transparent',
      }),
      Plot.geo(callesPalermo,{
        stroke: 'gray',
        fill: 'transparent'
      }),
      Plot.text(
        palermo.features,
        Plot.centroid({
          //text: (d) => ((d.properties.DENUNCIAS/totalDenuncias)*100).toFixed(2) + '%',
          text: (d) => d.properties.BARRIO,
          fill: "black",
          stroke: "white",
          textAnchor: "center",
          dx: 4,
          fontSize: 20,
          //filter: (d) => d.properties.DENUNCIAS > 10
        })
      ),
      Plot.text(
        [{lon: -58.422, lat: -34.587}],
        {
          x: 'lon',
          y: 'lat',
          text: (d) => "Plaza Italia",
          fill: "black",
          stroke: "white",
          textAnchor: "center",
          dx: 4,
          fontSize: 15,
        }
    ),
    Plot.text(
      [{lon: -58.413, lat: -34.592}],
      {
        x: 'lon',
        y: 'lat',
        text: (d) => "Alto Palermo",
        fill: "black",
        stroke: "white",
        textAnchor: "center",
        dx: 4,
        fontSize: 10,
      }
    ),
    Plot.text(
      [{lon: -58.4393, lat: -34.571}],
      {
        x: 'lon',
        y: 'lat',
        text: (d) => "Hospital Militar",
        fill: "black",
        stroke: "white",
        textAnchor: "center",
        dx: 4,
        fontSize: 10,
      }
    ),
    Plot.text(
    [{lon: -58.43, lat: -34.565}],
    {
      x: 'lon',
      y: 'lat',
      text: (d) => "Hipódromo",
      fill: "black",
      stroke: "white",
      textAnchor: "center",
      dx: 4,
      fontSize: 10,
    }
    ),
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

  });


  d3.select('#chart').append(() => chartMap);



})
