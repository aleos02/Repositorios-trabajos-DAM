document.addEventListener("DOMContentLoaded", async function () {
  const pokemons = document.getElementById("pokemonHTML");

  async function getApis() {
    try {
      const datos = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
      if (!datos.ok) {
        throw new Error("Error en la petición");
      }
      const resultados = await datos.json();
      const apis = resultados.results.map((pokemon) => pokemon.url);
      getPokemon(apis);
    } catch (error) {
      console.log(error);
    }
  }

  async function getPokemon(apis) {
    try {
      const promesas = apis.map((url) => fetch(url).then((res) => res.json()));
      const pokemon = await Promise.all(promesas);

      const pokemonHTML = pokemon
        .map((pokemon) => {
          const tipos = pokemon.types.map((tipo) => tipo.type.name);
          const spanTipos = tipos
            .map((tipo) => {
              const nombreTipo = tipo.charAt(0).toUpperCase() + tipo.slice(1);
              return `<span class="tipos ${tipo}">${nombreTipo}</span>`;
            })
            .join(" ");
          const stats = pokemon.stats.map((stat) => stat.stat.name);
          const value = pokemon.stats.map((stat) => stat.base_stat);
          const spanStats = stats
            .map((stat) => {
              const nombreStat = stat.charAt(0).toUpperCase() + stat.slice(1);
              return `<span>${nombreStat}: ${
                value[stats.indexOf(stat)]
              }</span>`;
            })
            .join("<br>");
          const habilidades = pokemon.abilities.map((habilidad) => habilidad.ability.name);
          const spanHabilidades = habilidades
            .map((habilidad) => {
              const nombreHabilidad = habilidad.charAt(0).toUpperCase() + habilidad.slice(1);
              return `<span>${nombreHabilidad}</span>`;
            })
            .join("<br>");
          console.log(habilidades);
          const srcShiny = pokemon.sprites.front_shiny;
          const numRandom = Math.floor(Math.random() * 50);
          if (numRandom == 25) {
            return `<div class="pokemon shiny">
                        <img src="${pokemon.sprites.front_shiny}" alt="${
              pokemon.name
            }" onmouseover="this.src='${
              pokemon.sprites.back_shiny
            }'" onmouseout="this.src='${pokemon.sprites.front_shiny}'">
                        
                        <h2>#${pokemon.id}</h2>
                        <h2 class="letra">${
                          pokemon.name.charAt(0).toUpperCase() +
                          pokemon.name.slice(1)
                        }⭐</h2>
                        <div class="stats">${spanStats}</div>
                        <div  class="habilidad">Abilities:<br>${spanHabilidades}</div>
                        <div>${spanTipos}</div>
                        </div>
                        `;
          } else
            return `<div class="pokemon">
                    
                        <img src="${pokemon.sprites.front_default}" alt="${
              pokemon.name
            }" onmouseover="this.src='${
              pokemon.sprites.back_default
            }'" onmouseout="this.src='${pokemon.sprites.front_default}'">
                        
                    <h2>#${pokemon.id}</h2>
                    <h2 class="letra">${
                      pokemon.name.charAt(0).toUpperCase() +
                      pokemon.name.slice(1)
                    }</h2>
                    <div class="stats">${spanStats}</div>
                    <div  class="habilidad">Abilities:<br>${spanHabilidades}</div>
                    <div>${spanTipos}</div>
                </div>
                `;
        })
        .join("");

      pokemons.innerHTML = pokemonHTML;
    } catch (error) {
      console.log(error);
    }
  }

  getApis();
});
