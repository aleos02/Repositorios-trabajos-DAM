document.addEventListener("DOMContentLoaded", async function () {

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
console.log(id);
const digimons = document.getElementById("digimonHTML");

getDigimom();


async function getDigimom() {
    try {
        const datos = await fetch("https://digi-api.com/api/v1/digimon/" + id);
        if (!datos.ok) {
            throw new Error("Error en la petición");
        }
        const digimon = await datos.json();

        const preEvo = digimon.priorEvolutions.map(evolution => 
            `<div class="preEvolution" onclick="window.location.href = 'details.html?id=${evolution.digimon}'">
                <h2>${evolution.id}</h2>
                <h2>${evolution.digimon}</h2>
                <img src="${evolution.image}" alt="${evolution.name}">
            </div>`
        ).join('');

        const postEvo = digimon.nextEvolutions.map(evolution => 
            `<div class="postEvolution" onclick="window.location.href = 'details.html?id=${evolution.digimon}'">
                <h2>${evolution.id}</h2>
                <h2>${evolution.digimon}</h2>
                <img src="${evolution.image}" alt="${evolution.name}">
            </div>`
        ).join('');

        const digi = 
            `<div class="digimon">
                <h2>Id: ${digimon.id}</h2>
                <h2>Name: ${digimon.name}</h2>
                <h2>Level: ${digimon.levels[0]?.level}</h2>
                <img src="${digimon.images[0].href}" alt="${digimon.name}">
                <h2>Types: ${digimon.types[0]?.type}</h2>
                <h2>Attributes: ${digimon.attributes[0]?.attribute}</h2>
                <p>${digimon.descriptions[1]?.description}</p>
                <div class="preEvo">${preEvo}</div>	
                <div class="postEvo">${postEvo}</div>
            </div>`;
        
        digimons.innerHTML = digi;

        const volver = document.createElement("button");
        volver.classList.add("volver");
        volver.innerHTML = 'Volver';
        document.body.appendChild(volver);
        volver.addEventListener("click", function() {
            window.location.href = "index.html";
        });
        
        

    } catch (error) {
        console.log(error);
    }
    }
});
