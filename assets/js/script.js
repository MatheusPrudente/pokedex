class Filter {
  constructor(minAmount, maximumAmount) {
    this.minAmount = minAmount;
    this.maximumAmount = maximumAmount;
    this.number = null;
    this.name = null;
  }

  clean() {
    this.number = null;
    this.name = null;
  }
}

const divPokemon = document.querySelector('#pokemons');
const cardPokemon = document.querySelector('#pokemon-link');
const searchPokemon = document.querySelector("#search-pokemon");
const pokeball = document.querySelector("#pokeball");
const urlBase = 'https://pokeapi.co/api/v2';
const filter = new Filter(1, 100);

searchPokemon.addEventListener("keyup", () => {
  const search = searchPokemon.value;

  if (!search) {
    filter.clean();
    renderPokemons();
    return;
  }

  const isNumber = isNumeric(search);

  if (isNumber) {
    filter.number = search;
  }

  if (!isNumber) {
    filter.name = encodeURIComponent(search).toLowerCase();
  }

  renderPokemons(filter);
})

const isNumeric = (value) => {
  return /^-?\d+$/.test(value);
}

const searchPokemonByFilter = (filter) => {
  const url = `${urlBase}/pokemon/${filter}`;
  const data = fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error("HTTP status " + response.status);
    }
    return response.json();
  }).catch((err) => {
    return null;
  });
  return data;
}

const createCardPokemon = (currentPokemon) => {
  let cardClone = cardPokemon.cloneNode(true);
  cardClone.style.display = "block";
  cardClone.href = `${urlBase}/pokemon/${currentPokemon.name}`;
  cardClone.querySelector("#pokemon-image").src = currentPokemon.image;
  cardClone.querySelector("#pokemon-name").innerHTML = currentPokemon.name;
  cardClone.querySelector("#pokemon-id").innerHTML = currentPokemon.id;
  cardClone.classList.add(currentPokemon.type.split(',')[0]);
  divPokemon.append(cardClone);
}

const fetchPokemon = () => {
  const promises = [];
  const isSearch = filter.number || filter.name;

  if (isSearch) {
    promises.push(searchPokemonByFilter(isSearch));
  }

  if (!isSearch) {
    for (let i = filter.minAmount; i <= filter.maximumAmount; i++) {
      promises.push(searchPokemonByFilter(i));
    }
  }

  return Promise.all(promises).then((results) => {
    return results.map((data) => {
      if (data) {
        return {
          name: data.name,
          id: data.id,
          image: data['sprites']['front_default'],
          type: data.types.map((type) => type.type.name).join(", "),
        }
      }
    });
  });
};

async function renderPokemons() {
  const allPokemon = await fetchPokemon();
  divPokemon.innerHTML = "";
  pokeball.style.display = "none";

  if (allPokemon) {
    divPokemon.innerHTML = "";
    allPokemon.forEach((data) => {
      if(data){
        createCardPokemon(data);
      }
    });
  }
}

renderPokemons();