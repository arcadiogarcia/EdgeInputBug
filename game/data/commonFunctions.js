var undyne = "undynefined";

function rand(a, b) {
    return a + Math.floor(Math.random() * (b - a + 1));
}

function getCharacterData(id) {
    var characters =
        {
            0: {
                "name": "Essie",
            },
            1: {
                "name": "Keystroke",
            }
        };
    return characters[id];
}

function getCharacterId(name) {
    switch (name) {
        case "Essie":
            return 0;
            break;
        case "Keystroke":
            return 1;
            break;
    }
}


function getZ(name) {
    switch (name) {
        case "interface1": //Interface
            return 80;
            break;
        case "interface2": //Interface
            return 70;
            break;
        case "interface3": //Interface
            return 60;
            break;
        case "fgEffects": //Effects
            return 50;
            break;
        case "fgProps": //FG props
            return 40;
            break;
        case "fgProps2": //FG props
            return 30;
            break;
        case "frontFloor": //Floor above character
            return 20;
            break;
        case "character": //Characters and enemies
            return 10;
            break;
        case "floor": //Floor below character
            return 0;
            break;
        case "bgNearEffects": //Effects
            return -10;
            break;
        case "bgNearProps": //Props
            return -20;
            break;
        case "bgNear1": //Near BG
            return -30;
            break;
        case "bgNear2": //Near BG
            return -40;
            break;
        case "bgFarEffects": //Effects
            return -50;
            break;
        case "bgFarProps": //Props
            return -60;
            break;
        case "skyProps": //Clouds n stuff
            return -70;
            break;
        case "sky": //Sky
            return -80;
            break;
    }
}

function distance(x1, x2, y1, y2) {
    return Math.abs(x1 - x1) + Math.abs(y1 - y2);
    //return Math.abs(Math.sqrt(Math.pow(Math.abs(x1 - x2), 2) + Math.pow(Math.abs(y1 - y2), 2)));
}