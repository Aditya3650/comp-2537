pokemonGridImages = ''

function processPokeResp(data) {
    console.log(data.id)
    pokemonGridImages += ` <div class="name_image">
      <a class="pokemon_name"> ${data.name} </a>
      <div class="image_container">
      <a href="/profile/${data.id}">  
      <img src="${data.sprites.other["official-artwork"].front_default}">
      </a>
      </div>
      </div>`
}

async function loadPokemonImages() {
    for (i = 1; i <= 9; i++) {
        if (i % 3 == 1) { // only when i = 1, 4, 7
            pokemonGridImages += `<div class="images_group">`
        }

        // 1- generate a random number for Pokemon ID so that images can be loaded
        pokemonRandomID = Math.floor(Math.random() * 150) + 1

        // 2- initialize an AJAX request to pokeapi.co
        await $.ajax({
            type: "GET",
            url: `https://pokeapi.co/api/v2/pokemon/${pokemonRandomID}/`,
            success: processPokeResp
        })

        if (i % 3 == 0) { // only when i = 3, 6, 9
            pokemonGridImages += `</div>`
        }
    }
    $("main").html(pokemonGridImages)
}


function setup() {
    loadPokemonImages();
    // event handlers come here
}

$(document).ready(setup)