function processPokemonRespByType(data) {
    for (i = 0; i < data.pokemon.length; i++) {
        $("main").append("<div>" + `<a href="/profile/${data.pokemon[i].pokemon.name}">` + data.pokemon[i].pokemon.name + "</a></div>")
    }

}

function processPokemonRespByHabitat(data) {
    // console.log(data)
    for (i = 0; i < data.pokemon_species.length; i++) {
        $("main").append("<div>" + `<a href="/profile/${data.pokemon_species[i].name}">` + data.pokemon_species[i].name + "</a></div>")
    }
}

function processPokemonRespByName(data) {
    $("main").append(`
    <div class="image_container">
    <img src="${data.sprites.other["official-artwork"].front_default}">
    </div><a href="/profile/${data.id}">
    ${data.name} </a>`)
}


function display_by_type(type_num) {
    $("main").empty()
    $.ajax({
        type: "get",
        url: `https://pokeapi.co/api/v2/type/${type_num}/`,
        success: processPokemonRespByType
    })
}

function display_by_habitat(habitat_num) {
    $("main").empty()
    $.ajax({
        type: "get",
        url: `https://pokeapi.co/api/v2/pokemon-habitat/${habitat_num}/`,
        success: processPokemonRespByHabitat
    })
}

function search_by_name() {
    $("main").empty()
    search_term = $("#poke_name").val()
    $.ajax({
        type: "get",
        url: `https://pokeapi.co/api/v2/pokemon/${search_term}/`,
        success: processPokemonRespByName
    })
}


function insertSearchEventToTheTimeLine(search_type){
    let now = new Date(Date.now());
    let formatted = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();

    $.ajax({
        url: "http://localhost:5000/timeline/insert",
        type: "put",
        data: {
            text: ` Client has searched for ${search_type}`,
            time: `at time ${formatted}`,
            hits: 1
        },
        success: function(r){
            console.log(r)
        }
    })
}


function setup() {
    $("#poke_type").change(() => {
        poke_type = $("#poke_type option:selected").val();
        console.log(poke_type);
        display_by_type($("#poke_type option:selected").val());
        value = "Poke type: " + poke_type;
        insertSearchEventToTheTimeLine(value)
    })

    $("#poke_habitat").change(() => {
        poke_habitat = $("#poke_habitat option:selected").val();
        console.log(poke_habitat);
        display_by_habitat($("#poke_habitat option:selected").val());
        value = "Poke habitat: " + poke_habitat;
        insertSearchEventToTheTimeLine(value)
    })

    $("#find_pokemon_by_name").click(search_by_name)

}





$(document).ready(setup)