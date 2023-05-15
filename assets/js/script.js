const divPokemon = document.querySelector('#pokemons');
const cardPokemon = document.querySelector('#pokemon-link');
const maximumAmount = 60;
const urlBase = 'https://pokeapi.co/api/v2/';

window.addEventListener("scroll", (event) => {
  console.log("aaaa");
});

const fetchPokemon = (currentPokemon) => {
  const promises = [];

  for (let i = currentPokemon; i <= maximumAmount; i++) {
    const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    promises.push(fetch(url).then((res) => res.json()));
  }

  return Promise.all(promises).then((results) => {
    return results.map((data) => ({
      name: data.name,
      id: data.id,
      image: data['sprites']['front_default'],
      type: data.types.map((type) => type.type.name).join(", "),
    }));
  });
};

async function renderPokemons(currentPokemon) {
  const allPokemon = await fetchPokemon(currentPokemon);

  if (allPokemon) {
    allPokemon.forEach((data) => {
      let cardClone = cardPokemon.cloneNode(true);

      cardClone.href = `${urlBase}/pokemon/${data.name}`;
      cardClone.querySelector("#pokemon-image").src = data.image;
      cardClone.querySelector("#pokemon-name").innerHTML = data.name;
      cardClone.querySelector("#pokemon-id").innerHTML = data.id;
      cardClone.classList.add(data.type.split(',')[0]);
      divPokemon.append(cardClone);
    });

    cardPokemon.remove();
  }
}

renderPokemons(1);