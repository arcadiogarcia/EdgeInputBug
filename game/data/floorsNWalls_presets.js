var game_presets = game_presets || [];
game_presets = game_presets.concat([
{
    name: "hitbox",
    events: [
        {
            name: "setCollision", code: function (event) {
                this.setCollider("hitbox", { "x": 0, "y": 0, "w": this.getVar("w"), "h": this.getVar("h")});
            }
        },
    ],
    collision: {
        "box": [
            { "x": 0, "y": 0, "w": 0, "h": 0, "#tag": "hitbox" },
        ]
    }
},

{
    name: "floor",
    inherits: "hitbox",
    //sprite: "debugRect",
    vars: [{ name: "isSolid", value: true }],
    events: [
        {
            name: "#setup", code: function (event) {
                this.setVar("$w", this.getVar("w"));
                this.setVar("$h", this.getVar("h"));
                this.execute_event("setCollision");
            }
        }
    ]
},
{
    name: "floorSkin",
    events: [
        {
            name: "#setup", code: function (event) {
                this.setVar("$w", this.getVar("w"));
                this.setVar("$h", this.getVar("h"));
                var tileSize = this.engine.getEngineVar("tileSize");
                this.engine.addObjectLive("pattern", "proceduralPattern", this.getVar("#x"), this.getVar("#y"), 0, false, false, { "$w": this.getVar("w"), "$h": this.getVar("h"), "$img": "game/assets/images/tiles/" + this.getVar("img") + ".png" });
            }
        }
    ]
},
{
    name: "water",
    inherits: "hitbox",
    vars: [{ name: "isSolid", value: false }],
    events: [
        {
            name: "#setup", code: function (event) {
                this.execute_event("setCollision");
            }
        }
    ]
},
{
    name: "waterSkin",
    events: [
        {
            name: "#setup", code: function (event) {
                this.setVar("$w", this.getVar("w"));
                this.setVar("$h", this.getVar("h"));
                this.engine.addObjectLive("pattern", "proceduralPattern", this.getVar("#x"), this.getVar("#y"), getZ("floor"), false, false, { "$w": this.getVar("w"), "$h": this.getVar("h"), "$img": "game/assets/images/tiles/" + this.getVar("img") + ".png" });
                this.engine.addObjectLive("tint", "tint", this.getVar("#x"), this.getVar("#y") + 10, getZ("frontFloor"), false, false, { "$w": this.getVar("w"), "$h": this.getVar("h") - 10, "$color": "#1e96dc", "$opacity": "0.5" });
            }
        }
    ]
},
{
    name: "deepWater",
    inherits: "hitbox",
    vars: [{ name: "isSolid", value: false }],
    events: [
        {
            name: "#setup", code: function (event) {
                this.execute_event("setCollision");
            }
        }
    ]
},
{
    name: "deepWaterSkin",
    events: [
        {
            name: "#setup", code: function (event) {
                this.setVar("$w", this.getVar("w"));
                this.setVar("$h", this.getVar("h"));
                this.engine.addObjectLive("pattern", "proceduralPattern", this.getVar("#x"), this.getVar("#y"), getZ("floor"), false, false, { "$w": this.getVar("w"), "$h": this.getVar("h"), "$img": "game/assets/images/tiles/" + this.getVar("img") + ".png" });
                this.engine.addObjectLive("tint", "tint", this.getVar("#x"), this.getVar("#y"), getZ("frontFloor"), false, false, { "$w": this.getVar("w"), "$h": this.getVar("h"), "$color": "#2850a0", "$opacity": "0.7" });
            }
        }
    ]
},
{
    name: "wall", //Same as floor for now
    inherits: "hitbox",
    //sprite: "debugRect",
    vars: [{ name: "isSolid", value: true }],
    events: [
        {
            name: "#setup", code: function (event) {
                this.execute_event("setCollision");
                this.setVar("$w", this.getVar("w"));
                this.setVar("$h", this.getVar("h"));
                this.engine.addObjectLive("pattern", "proceduralPattern", this.getVar("#x"), this.getVar("#y"), 0, false, false, { "$w": this.getVar("w"), "$h": this.getVar("h"), "$img": "game/assets/images/tiles/" + this.getVar("img") + ".png" });
            }
        }
    ]
},
{
    name: "proceduralPattern",
    sprite: "tiledPattern",
    events: [
        {
            name: "#setup", code: function (event) {
                console.log(this.getVar('$img'),this.getVar('$w'),this.getVar('$h'));
                // var canvas = document.createElement('canvas');
                // var tileSize = this.engine.getEngineVar("tileSize");
                // canvas.width = this.getVar('$w');
                // canvas.height = this.getVar('$w');
                // var context = canvas.getContext('2d');
                // var img = new Image();
                // img.src = this.getVar('$img');
                // //var variations = this.getVar("variations").map(function (x) { var i = new Image(); i.src = x; return i; });
                // for (var i = 0; this.getVar('$w') >= i; i += tileSize) {
                //     for (var j = 0; this.getVar('$h') >= j; j += img.height) {
                //         context.drawImage(img, i, j);
                //         //variations.forEach(function (v) {
                //         //    if (Math.random() > 0.7) {
                //         //        context.globalAlpha = Math.random();
                //         //        context.drawImage(v, i, j);
                //         //    }
                //         //});
                //         //context.globalAlpha = 1;
                //     }
                // };
                var pattern = new Image();
                pattern.src = this.getVar('$img');
                this.setVar('$pattern', pattern);
                // this.setVar('canvas', canvas);
                // this.setVar('context', context);
            }
        }
    ]
}
]);

