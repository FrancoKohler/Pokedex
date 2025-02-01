/*--------COLOR CARD----------*/
function colorType(pokeCard, pokeType) {
  const typeIcon = pokeCard.querySelector(".typeIcon");
  const typeIcon2 = pokeCard.querySelector(".typeIcon2");

  if (typeIcon) {
    typeIcon.src = `../assets/icons/${pokeType.toUpperCase()}.svg`;
  }

  if (typeIcon2) {
    const secondType = pokeCard.querySelector(
      ".pokeType:nth-child(4)"
    )?.innerText;
    if (secondType) {
      typeIcon2.src = `../assets/icons/${secondType.toUpperCase()}.svg`;
    }
  }
  if (pokeCard) {
    pokeCard.style.backgroundImage = `url(../assets/${pokeType.toUpperCase()}.svg)`;
  }
}
/*-------------OVERLAY-----------------*/
function openOverlay(pokemonData) {
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");

  /*------HEIGHT-----*/
  const height = `${pokemonData.height}0`;
  const weight = (pokemonData.weight / 10).toFixed(1);
  /*------IMGS SEGUN EL TIPO-----*/
  const typeIcons = {
    grass: "../assets/icons/grass.svg",
    fire: "../assets/icons/fire.svg",
    water: "../assets/icons/water.svg",
    bug: "../assets/icons/bug.svg",
    normal: "../assets/icons/normal.svg",
    psychic: "../assets/icons/psychic.svg",
    poison: "../assets/icons/poison.svg",
    electric: "../assets/icons/electric.svg",
    ground: "../assets/icons/ground.svg",
    fairy: "../assets/icons/fairy.svg",
    fighting: "../assets/icons/fighting.svg",
    rock: "../assets/icons/rock.svg",
    ghost: "../assets/icons/ghost.svg",
    ice: "../assets/icons/ice.svg",
    dragon: "../assets/icons/dragon.svg",
    flying: "../assets/icons/flying.svg",
    steel: "../assets/icons/steel.svg",
    dark: "../assets/icons/dark.svg",
  };
  const type1 = pokemonData.types[0].type.name;
  const type2 = pokemonData.types[1] ? pokemonData.types[1].type.name : null;
  const type1Image = typeIcons[type1.toLowerCase()] || "";
  const type2Image = type2 ? typeIcons[type2.toLowerCase()] : null;

  const backgroundImage = `url(../assets/bg/${type1.toUpperCase()}-BG.svg)`;

  overlay.style.backgroundImage = backgroundImage;
  overlay.style.backgroundSize = "cover";
  overlay.style.backgroundPosition = "center";
  overlay.style.backgroundRepeat = "no-repeat";

  /*---------OVERLAY----------*/
  overlay.innerHTML = `
  <div class="resultDiv">
  <button class="btn-close" id="btnBack"><img class="btnClose" src="../assets/x.svg" alt="Close X" /></button>
    <div class="searchCard">
      <div class="leftDiv">
        <img class="btnCryOv" style="flex" src="../assets/soundwh.svg" alt="Cry Icon" />
        <p class="p-info">${pokemonData.name}</p>
        <p class="p-info">#${pokemonData.id}</p>

        <div class="infoDiv">
          <img class="imgSearch" src="${
            pokemonData.sprites.front_default
          }" alt="${pokemonData.name}" />
          <div class="typeListOv">
            <div class="typeIconOv">
              <img class="typeIcon" src="${type1Image}" alt="${type1}" />
              <p class="subp-info">${type1}</p>
            </div>
            ${
              type2
                ? `
            <div class="typeIconOv">
              <img class="typeIcon" src="${type2Image}" alt="${type2}" />
              <p class="subp-info">${type2}</p>
            </div>`
                : ""
            }
          </div>
        </div>
      </div>
      
      <div class="rightDiv">
        <h3 class="h-abilities">ABILITIES</h3>
        <div class="abilitiesList">
          ${pokemonData.abilities
            .map((ability) => {
              return `
            <div class="abilityItem">
              <p class="abilities">${ability.ability.name}</p>
            </div>`;
            })
            .join("")}
        </div>

        <!-- Stats List -->
        <div class="statsList">
        <h3 class="h-abilities">BASE STATS</h3>
          ${pokemonData.stats
            .map((stat) => {
              return `
            <div class="statItem">
              <p class="statName">${stat.stat.name.toUpperCase()}</p>
              <p class="statValue">${stat.base_stat}</p>
            </div>`;
            })
            .join("")}
        </div>

        <div class="otherList">
          <p class="h-w">${height} cm</p>
          <p class="h-w">${weight} kg</p>
        </div>
      </div>
    </div>
    <button class="btn-back" id="btnBack">BACK</button>
  </div>
`;

  const btnCry = overlay.querySelector(".btnCryOv");
  if (btnCry) {
    btnCry.addEventListener("click", () => {
      const cryUrl = `https://raw.githubusercontent.com/kuo22/pokemon-cries/master/public/cries/${pokemonData.id}.wav`;
      const audio = new Audio(cryUrl);
      audio.play();
    });
  }

  // Add hover effect for changing images (front/back)
  const imgSearch = overlay.querySelector(".imgSearch");
  imgSearch.addEventListener("mouseenter", () => {
    imgSearch.src = pokemonData.sprites.back_default;
  });

  imgSearch.addEventListener("mouseleave", () => {
    imgSearch.src = pokemonData.sprites.front_default;
  });
  window.addEventListener("click", function (event) {
    if (event.target === overlay) {
      overlay.style.display = "none";
    }
  });
  document.body.appendChild(overlay);

  /*-----------CIERRE DEL OVERLAY AL APRETAR "X"----------*/
  overlay.querySelector(".btn-close").addEventListener("click", () => {
    overlay.style.display = "none";
  });

  /*-----------CIERRE DEL MODAL AL APRETAR FUERA----------*/
  window.addEventListener("click", (event) => {
    if (event.target === overlay) {
      overlay.style.display = "none";
    }
  });
}

let allPokemon = [];

async function fetchPokemon() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
  const data = await response.json();
  const pokemons = data.results;

  const section = document.querySelector("#mainSection");
  section.innerHTML = ""; // Clear section before rendering

  for (let index = 0; index < pokemons.length; index++) {
    const pokemonResponse = await fetch(pokemons[index].url);
    const pokemonData = await pokemonResponse.json();
    allPokemon.push(pokemonData);

    renderPokemonCard(pokemonData, section);
  }
}

/*------RENDER POKEMON FUNCTION--------*/
function renderPokemonCard(pokemonData, section) {
  /*------BTN PARA REPRODUCIR GRITO--------*/
  const cryImg = document.createElement("img");
  cryImg.src = "../assets/sound.svg";
  cryImg.alt = "Cry Icon";
  cryImg.classList.add("cryIcon");

  const btnCry = document.createElement("button");
  btnCry.classList.add("btnCry");
  btnCry.addEventListener("click", () => {
    const cryUrl = `https://raw.githubusercontent.com/kuo22/pokemon-cries/master/public/cries/${pokemonData.id}.wav`;
    new Audio(cryUrl).play();
  });
  btnCry.appendChild(cryImg);

  /*------CREACION DE TARJETA POKEMON--------*/
  const pokeCard = document.createElement("div");
  pokeCard.classList.add("pokeCard");

  /*------NOMBRE DEL POKEMON--------*/
  const pokeName = document.createElement("h4");
  pokeName.innerText = pokemonData.name;
  pokeName.classList.add("pokeName");

  /*------NUMERO DEL POKEMON--------*/
  const pokeNumber = document.createElement("p");
  pokeNumber.innerText = `#${pokemonData.id}`;
  pokeNumber.classList.add("pokeNumber");

  /*------LISTA DE TIPOS--------*/
  const typeList = document.createElement("li");
  const pokeType = document.createElement("p");
  const typeIcon = document.createElement("img");
  typeIcon.classList.add("typeIcon");
  typeIcon.alt = "Type Icon";
  typeList.append(typeIcon);
  pokeType.innerText = pokemonData.types[0].type.name;
  typeList.append(pokeType);
  typeList.classList.add("typeList");
  pokeType.classList.add("pokeType");

  /*--------SEGUNDO TIPO (SI EXISTE)----*/
  if (pokemonData.types[1]) {
    const pokeType2 = document.createElement("p");
    pokeType2.innerText = pokemonData.types[1].type.name;
    const typeIcon2 = document.createElement("img");
    typeIcon2.classList.add("typeIcon2");
    typeIcon2.alt = "Type Icon";
    typeList.append(typeIcon2, pokeType2);
    pokeType2.classList.add("pokeType");
  }

  /*------IMAGEN DEL POKEMON--------*/
  const pokeImg = document.createElement("img");
  pokeImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonData.id}.png`;
  pokeImg.classList.add("pokeImg");
  pokeImg.alt = pokemonData.name;

  /*------AGREGAR ELEMENTOS A LA TARJETA--------*/
  pokeCard.append(pokeImg, pokeName, pokeNumber, typeList, btnCry);
  section.appendChild(pokeCard);

  /*------FUNCION PARA COLOREAR LA TARJETA SEGUN EL TIPO--------*/
  colorType(pokeCard, pokemonData.types[0].type.name);
  pokeCard.addEventListener("click", () => openOverlay(pokemonData));
}

/*------SORT FUNCTION--------*/
function sortPokemon() {
  const sortOption = document.getElementById("sortOption").value;
  const section = document.querySelector("#mainSection");

  if (sortOption === "alphabetical") {
    allPokemon.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption === "type") {
    allPokemon.sort((a, b) =>
      a.types[0].type.name.localeCompare(b.types[0].type.name)
    );
  } else if (sortOption === "number") {
    allPokemon.sort((a, b) => a.id - b.id); // Sort by Pokédex number
  }

  section.innerHTML = ""; // Clear section
  allPokemon.forEach((pokemon) => renderPokemonCard(pokemon, section));
}

/*------INICIAR MOSTRANDO TODOS LOS POKEMON HASTA EL 151--------*/
document.addEventListener("DOMContentLoaded", () => {
  fetchPokemon();
});

/*------GRITO DEL POKEMON--------*/
async function fetchAndPlayCry(pokemonId) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
    );

    const data = await response.json();
    const cryUrl = data.cries.latest;
    if (!cryUrl) {
      alert("No hay sonido disponible para este Pokémon.");
      return;
    }

    const audio = new Audio(cryUrl);
    audio.play();
  } catch (error) {
    console.error("Error:", error);
  }
  btnCry.addEventListener("click", () => {
    fetchAndPlayCry(pokemonId);
  });
  pokeCard.append(btnCry);
}
/*----------SEARCH FUNCITOM------*/
async function searchPokemon() {
  const searchValue = document
    .getElementById("searchPokemon")
    .value.trim()
    .toLowerCase();

  const pokeCards = document.querySelectorAll(".pokeCard");
  let found = false;

  /*----SIN BUSQUEDA MUESTRA TODO----*/
  if (!searchValue) {
    pokeCards.forEach((card) => {
      card.style.display = "flex";
    });
    return;
  }

  pokeCards.forEach((card) => {
    const pokeName = card.querySelector(".pokeName").innerText.toLowerCase();
    const pokeNumber = card
      .querySelector(".pokeNumber")
      .innerText.replace("#", "");
    const pokeType = card.querySelector(".pokeType").innerText.toLowerCase();

    if (
      pokeName.includes(searchValue) ||
      pokeNumber === searchValue ||
      pokeType === searchValue
    ) {
      card.style.display = "flex";
      found = true;
    } else {
      card.style.display = "none";
    }
  });
  if (searchPokemon) {
    /*----------BTN PARA RESETEAR EL HTML----------*/
    const btnBack = document.getElementById("btnBack");
    btnBack.style.display = "flex";

    btnBack.addEventListener("click", () => {
      const section = document.querySelector("#mainSection");
      section.innerHTML = "";

      fetchPokemon();
    });
  }
  if (!found) {
    const resultDiv = document.getElementById("mainSection");
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${searchValue}`
      );

      if (!response.ok) {
        throw new Error("Pokémon no encontrado.");
      }

      const pokemonData = await response.json();

      const cryImg = document.createElement("img");
      cryImg.src = "../assets/sound.svg";
      cryImg.alt = "Cry Icon";
      cryImg.classList.add("cryIcon");

      const btnCry = document.createElement("button");
      btnCry.classList.add("btnCry");
      btnCry.addEventListener("click", () => {
        const cryUrl = `https://raw.githubusercontent.com/kuo22/pokemon-cries/master/public/cries/${pokemonData.id}.wav`;
        const audio = new Audio(cryUrl);
        audio.play();
      });
      btnCry.appendChild(cryImg);

      const pokeCard = document.createElement("div");
      pokeCard.classList.add("pokeCard");

      const pokeName = document.createElement("h4");
      pokeName.innerText = pokemonData.name;
      pokeName.classList.add("pokeName");

      const pokeNumber = document.createElement("p");
      pokeNumber.innerText = `#${pokemonData.id}`;
      pokeNumber.classList.add("pokeNumber");

      const typeList = document.createElement("li");
      const pokeType = document.createElement("p");
      const typeIcon = document.createElement("img");
      typeIcon.classList.add("typeIcon");
      typeIcon.alt = "Type Icon";
      typeList.append(typeIcon);
      pokeType.innerText = pokemonData.types[0].type.name;
      typeList.append(pokeType);
      typeList.classList.add("typeList");
      pokeType.classList.add("pokeType");

      if (pokemonData.types[1]) {
        const pokeType2 = document.createElement("p");
        pokeType2.innerText = pokemonData.types[1].type.name;
        const typeIcon2 = document.createElement("img");
        typeIcon2.classList.add("typeIcon2");
        typeIcon2.alt = "Type Icon";
        typeList.append(typeIcon2, pokeType2);
        pokeType2.classList.add("pokeType");
      }

      const pokeImg = document.createElement("img");
      pokeImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonData.id}.png`;
      pokeImg.classList.add("pokeImg");
      pokeImg.alt = pokemonData.name;

      pokeCard.append(pokeImg, pokeName, pokeNumber, typeList, btnCry);
      resultDiv.appendChild(pokeCard);

      colorType(pokeCard, pokemonData.types[0].type.name);
    } catch (error) {
      const resultDiv = document.getElementById("mainSection");
      resultDiv.innerHTML = `<p>${error.message}</p>`;
    }
  }
}

/*--------EVENT KEY PARA USO DE TECLA-------*/
document
  .getElementById("searchPokemon")
  .addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      searchPokemon();
    }
  });
