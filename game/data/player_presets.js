var game_presets = game_presets || [];
game_presets = game_presets.concat([
{
    name: "pipe",
    sprite: "pipe",
    events: [
        {
            name: "#setup", code: function (event) {
                this.setVar("#x", 830);
                this.setVar("moving", true);
            }
        },
        {
            name: "#collide", code: function (event) {
                if (this.getVar("moving") == true && event.shape2kind == "point" && this.engine.getObject(event.object).instanceOf("dog")) {
                    this.engine.execute_event("gameover");
                }
            }
        },
        {
            name: "gameover", code: function (event) {
                this.setVar("moving", false);
            }
        },
		{
		    name: "#loop", code: function (event) {
		        if (this.getVar("moving") == true) {
		            this.setVar("#x", this.getVar("#x") - 10);
		            if (this.getVar("#x") < -100) {
		                this.setVar("#x", 830);
		                var y = 195 + Math.random() * 150;
		                this.setVar("#y", y);
		                this.engine.execute_event("movepipe", { "y": y });
		                this.engine.execute_event("addpoints", { "points": 1 });
		            }
		        }
		    }
		}
    ],
    collision: {
        "box": [
            { "x": 0, "y": 0, "w": 100, "h": 300 },
        ]
    }
},
{
    name: "pipe_reverse",
    inherits: "pipe",
    events: [
        {
            name: "#setup", code: function (event) {
                this.setVar("moving", true);
                this.setVar("#state", "reverse");
                this.setVar("#x", 830);
            }
        },
         {
             name: "movepipe", code: function (event) {
                 this.setVar("#y", event.y - 430);
                 this.setVar("#x", 830);
             }
         },
         {
             name: "#loop", code: function (event) {
                 if (this.getVar("moving") == true) {
                     this.setVar("#x", this.getVar("#x") - 10);
                 }
             }
         }
    ],
    collision: {
        "box": [
            { "x": 0, "y": 0, "w": 100, "h": 300 },
        ]
    }
},
{
    name: "background",
    sprite: "background"
},
{
    name: "static_background",
    inherits: "background",
    events: [
       {
           name: "#setup", code: function (event) {
               this.setVar("#state", "idle");
           }
       }
    ],
},
{
    name: "bg1",
    sprite: "bg1",
    events: [
   {
       name: "#setup", code: function (event) {
           this.setVar("#z", getZ("bgNear1"));
       }
   }
    ],
},
{
    name: "bg1sky",
    sprite: "bg1sky",
    events: [
   {
       name: "#setup", code: function (event) {
           this.setVar("#z", getZ("sky"));
       }
   }
    ],
},
{
    name: "bg1stars",
    sprite: "bg1stars",
    events: [
   {
       name: "#setup", code: function (event) {
           this.setVar("#z", getZ("sky"));
       }
   }
    ],
},
{
    name: "button",
    sprite: "button",
    events: [
       {
           name: "#collide", code: function (event) {
               if (event.shape2kind == "point" && this.engine.getObject(event.object).instanceOf("basicMouse")) {
                   if (event.shape2id == 1) {
                       this.engine.loadLevelByID("game");
                   }
               }
           }
       }
    ],
    collision: {
        "box": [
            { "x": 0, "y": 0, "w": 200, "h": 100 },
        ]
    }
},
{
    name: "score",
    sprite: "text",
    events: [
       {
           name: "#setup", code: function (event) {
               this.setVar("points", 0);
               this.setVar("$text", "Score: " + this.getVar("points"));
               this.setVar("$color", "#F00");
           }
       },
        {
            name: "addpoints", code: function (event) {
                this.setVar("points", this.getVar("points") + event.points);
                this.setVar("$text", "Score: " + this.getVar("points"));
                if (this.getVar("points") > +(this.engine.find("mystorage").execute_event("getStorage", { "property": "maxscore" }) || 0)) {
                    this.setVar("HighScore", true);
                    this.engine.find("mystorage").execute_event("putStorage", { "property": "maxscore", "value": this.getVar("points") });
                    this.setVar("$color", "#0F0");
                }
            }
        },
        {
            name: "gameover", code: function (event) {
                if(this.getVar("HighScore")){
                    this.engine.execute_event("notificationToast", { message: this.getVar("points"), title: "New high score", color: "cyan" });
                }
            }
        }
    ]
},
{
    name: "maxscore",
    sprite: "text",
    events: [
       {
           name: "#setup", code: function (event) {
               this.setVar("$text", "High score: " + (this.engine.find("mystorage").execute_event("getStorage", { "property": "maxscore" }) || 0));
               this.setVar("$color", "#FF0");
           }
       }
    ]
},

]);


