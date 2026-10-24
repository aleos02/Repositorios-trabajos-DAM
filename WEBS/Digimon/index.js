document.addEventListener("DOMContentLoaded", async function () {
    //Seleccionamos el elemento para insertar los datos
    const digimons = document.getElementById("digimonHTML");
    
    //Creamos el formulario y lo insertamos con sus inputs
    const form = document.createElement("form");
    const input1 = document.createElement("input");
    input1.type = "number";
    input1.placeholder = "10";
    input1.min = "1";
    input1.max = "100";
    input1.defaultValue = "10";
    const input2 = document.createElement("input");
    input2.type = "text";
    input2.placeholder = "Buscar Digimon..."
    const input3 = document.createElement("button");
    input3.innerText = "Buscar";  
    form.appendChild(input1);
    form.appendChild(input2);
    form.appendChild(input3);
    document.body.insertBefore(form, digimons);

    input3.addEventListener("click", async function(event) {
      event.preventDefault();
      const valor2 = input2.value;
      const valor1 = input1.value;
        if(valor2 ===""||valor2===null||valor1===null) {
            alert("Debes escribir algo");
            return;
        }
        else{
          try {
            const datos = await fetch("https://digi-api.com/api/v1/digimon?pageSize="+valor1+"&name="+valor2);
            if (!datos.ok) {
              throw new Error("Error en la petición");
            }
            const resultados = await datos.json();

            const digi = resultados.content.map(digimon => {
              return `<div class="digimon" onclick="window.location.href = 'details.html?id=${digimon.id}'">
                <p>${digimon.id}</p>	
                <img src="${digimon.image}" alt="${digimon.name}">
                <h2>${digimon.name}</h2>
                <h4>Nivel desconocido</h4>
            </div>`

          }).join('');

            digimons.innerHTML = digi;
        }
        catch (error) {
          console.log(error);
        }
      }});

    
   
    //Obtenemos la pagina que queremos
    const numPage = Math.floor(Math.random() * 148);
    
    //Funcion para obtener las apis y datos de la primera página
    async function getApis() {
      try {
        const datos = await fetch("https://digi-api.com/api/v1/digimon?pageSize=10&page="+numPage);
        if (!datos.ok) {
          throw new Error("Error en la petición");
        }
        const resultados = await datos.json();
        //const apis = resultados.content.map((digimon) => digimon.href);
        const digi = resultados.content.map(digimon => {

          return `<div class="digimon" onclick="window.location.href = 'details.html?id=${digimon.id}'">
                <p>${digimon.id}</p>	
                <img src="${digimon.image}" alt="${digimon.name}">
                <h2>${digimon.name}</h2>
                <h4>Nivel desconocido</h4>
            </div>`

      }).join('');

        digimons.innerHTML = digi;
        
        //getDigimon(apis);
      } catch (error) {
        console.log(error);
      }
    }
    getApis();
    
});


