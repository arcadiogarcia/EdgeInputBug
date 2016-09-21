var game_presets = game_presets || [];
game_presets = game_presets.concat([
{
    name: "cam",
    events: [
        {
            name: "#setup", code: function (event) {
                this.setVar("player", this.engine.find(this.getVar("player")));
                this.setVar("i", 0);
                this.setVar("j", 0);
                this.setVar("timer", 0);
                this.setVar("restoring", false);
                this.setVar("movingCamera", false);

            }
        },
        {
            name: "#loop", code: function (event) {
                if (this.getVar("movingCamera")) {
                    if (this.getVar("i") < this.getVar("moveY")) {
                        this.engine.getAnimationEngine().moveCameraY(5);
                        this.setVar("i", this.getVar("i") + 5);
                    } else if (this.getVar("i") > this.getVar("moveY")) {
                        this.engine.getAnimationEngine().moveCameraY(-5);
                        this.setVar("i", this.getVar("i") - 5);
                    }
                    if (this.getVar("j") < this.getVar("moveX")) {
                        this.engine.getAnimationEngine().moveCameraX(5);
                        this.setVar("j", this.getVar("j") + 5);
                    } else if (this.getVar("j") > this.getVar("moveX")) {
                        this.engine.getAnimationEngine().moveCameraX(-5);
                        this.setVar("j", this.getVar("j") - 5);
                    }
                    if (this.getVar("i") == this.getVar("moveY") && this.getVar("j") == this.getVar("moveX")) {
                        this.setVar("timer", this.getVar("timer") - 1);
                        if (this.getVar("timer") == 0) {
                            this.setVar("movingCamera", false);
                            this.setVar("restoring", true);
                        }
                    }
                } else if (this.getVar("restoring")) {
                    if (this.getVar("i") != 0 || this.getVar("j") != 0) {
                        if (this.getVar("i") > 0) {
                            this.engine.getAnimationEngine().moveCameraY(-10);
                            this.setVar("i", this.getVar("i") - 10);
                        } else {
                            this.engine.getAnimationEngine().moveCameraY(10);
                            this.setVar("i", this.getVar("i") + 10);
                        }
                        if (this.getVar("j") > 0) {
                            this.engine.getAnimationEngine().moveCameraY(-10);
                            this.setVar("j", this.getVar("j") - 10);
                        } else {
                            this.engine.getAnimationEngine().moveCameraY(10);
                            this.setVar("j", this.getVar("j") + 10);
                        }
                    } else {
                        this.setVar("restoring", false);
                        this.engine.find("player").setVar("moving", true);
                    }
                } else if (this.getVar("player").getVar("reading") != true && this.getVar("restoring") == false) {
                    this.engine.getAnimationEngine().setCamera(this.getVar("player").getVar("#x") + this.getVar("player").getVar("w") / 2 - 960, this.getVar("player").getVar("#y") + this.getVar("player").getVar("h") / 2 - 540);
                } else {
                    if (this.getVar("i") < 200) {
                        this.engine.getAnimationEngine().moveCameraY(5);
                        this.setVar("i", this.getVar("i") + 5);
                    }
                }
            }
        },
        {
            name: "moveCamera", code: function (event) {
                this.setVar("timer", event.time);
                this.setVar("moveX", event.moveX);
                this.setVar("moveY", event.moveY);
                this.setVar("movingCamera", true);
                this.engine.find("player").setVar("moving", false);
            }
        }
    ]
},
{
    name: "tint",
    sprite: "tint" //Needs color, opacity, w and h
},
{
    name: "healthBar",
    sprite: "bar",
    events: [
        {
            name: "#setup", code: function (event) {
                this.setVar("#z", getZ("interface2"));
                this.setVar("character", this.engine.find(this.getVar("chara")));
                this.setVar("$name", this.getVar("name"));
                this.setVar("$filled", this.getVar("character").getVar("currentLife")*10);
                this.setVar("$maxFill", this.getVar("character").getVar("life")*10);
                this.setVar("$color", "rgb(0,255,0)");
                this.setVar("$h", 30);
            }
        },
        {
            name: "decreaseHealthBar", code: function (event) {
                this.setVar("$filled", this.getVar("$filled") - event.hp);
                if (this.getVar("$filled") < this.getVar("$maxFill") * 0.4) {
                    var green = Math.floor((this.getVar("$filled") * 255) / (this.getVar("$maxFill")*0.4));
                    var red = 255 - green;
                    var color = "rgb(" + red + "," + green + ", 0)";
                    this.setVar("$color", color);
                }
            }
        },
        {
            name: "increaseHealthBar", code: function (event) {
                if (this.getVar("$filled") != this.getVar("character").getVar("life")) {
                    this.setVar("$filled", this.getVar("$filled") + event.hp);
                }
                if (this.getVar("$filled") < this.getVar("$maxFill") * 0.4) {
                    var green = Math.floor((this.getVar("$filled") * 255) / (this.getVar("$maxFill") * 0.4));
                    var red = 255 - green;
                    var color = "rgb(" + red + "," + green + ", 0)";
                    this.setVar("$color", color);
                } else {
                    this.setVar("$color", "rgb(0,255,0)");
                }
            }
        }
    ]
},
{
    name: "O2Orb",
    sprite: "O2orb",
    events: [
        {
            name: "#setup", code: function (event) {
                this.setVar("#z", getZ("interface2"));
                this.setVar("character", this.engine.find(this.getVar("chara")));
                this.setVar("$name", this.getVar("name"));
                this.setVar("$filled", 25);
            }
        },
        {
            name: "#loop", code: function (event) {
                var chara = this.getVar("character");
                this.setVar("#x", chara.getVar("#x") + chara.getVar("w") / 2 -25);
                this.setVar("#y", this.getVar("character").getVar("#y") -30);
            }
        },
        {
            name: "decreaseO2", code: function (event) {
                if (event.fill > 0) {
                    this.setVar("$filled", event.fill);
                }
                //if (this.getVar("$filled") < this.getVar("$maxFill") * 0.2) {
                //    //pi pi, pi pi, you're drowning!
                //}
            }
        },
        {
            name: "increaseO2B", code: function (event) {
                this.setVar("$filled", event.fill);
            }
        }
    ]
},

//Character Icons
{
    name: "charaIconFactory",
    events: [
        {
            name: "#setup", code: function () {
                //this.setVar("$y", getCharacterData(getCharacterId(this.getVar("name"))));
                var that = this;
                var i = 0;
                var character, name;
                this.getVar("names").forEach(function (x) {
                    name = x.replace(/\s/, '');
                    that.engine.addObjectLive("healthBar" + name, "healthBar", that.getVar("#x") + 97, that.getVar("#y") + i + 40, 0, true, false, {"name":x, "chara": name});
                    that.engine.addObjectLive("charaIcon" + name, "charaIcon" + name, that.getVar("#x"), that.getVar("#y") + i, getZ("interface3"), true);
                    i += 105;
                });
                this.engine.deleteObjectLive(this);
            }
        }
    ]
},
{
    name: "charaIconEssie",
    sprite: "charaIconEssie",
},
{
    name: "charaIconEssieDummy",
    sprite: "charaIconEssie",
},
{
    name: "charaIconKeystroke",
    sprite: "charaIconKey",
},


{
    name: "hpText",
    sprite: "flyingText",
    events: [
       {
           name: "#setup", code: function () {
               this.setVar("$timer", 100);
               this.setVar("#z", getZ("interface3"));
           }
       },
       {
           name: "#loop", code: function () {
               this.setVar("$timer", this.getVar("$timer") - 2);
               if (this.getVar("$timer") == 0) {
                   this.engine.deleteObjectLive(this);
               }
           }
       }
    ]
},
{
    name: "bloodDrop",
    sprite: "blood",
    inherits: "physics",
    events: [
       {
           name: "#setup", code: function (event) {
               this.setVar("$timer", 100);
               this.setVar("$x", this.getVar("#x"));
               this.setVar("$y", this.getVar("#y"));
               this.setVar("#z", getZ("character") - 1);
               this.setVar("moving", true);
               this.setVar("updateState", false);
               this.setVar("margin", 0);
               this.setVar("w", 0);
               this.setVar("h", 0);
               this.setVar("jumping", rand(0,20));
               var random=Math.random();
               if (random < 0.4) {
                   this.setVar("left", true);
                   this.setVar("right", false);
               } else if (random < 0.8) {
                   this.setVar("left", false);
                   this.setVar("right", true);
               } else {
                   this.setVar("left", false);
                   this.setVar("right", false);
               }
               this.setVar("dir", "right");
               this.setVar("speed", rand(2,10));
               this.setVar("gravity", 10);
               this.setVar("grounded", false);
           }
       },
       {
           name: "#loop", code: function () {
               this.execute_event("updatePosition");
               if (this.getVar("speed") != 0) {
                   this.setVar("speed", this.getVar("speed") - 1);
               }
               this.setVar("$x", this.getVar("#x"));
               this.setVar("$y", this.getVar("#y"));
               this.setVar("$timer", this.getVar("$timer") - 2);
               if (this.getVar("$timer") == 0) {
                   this.engine.deleteObjectLive(this);
               }
           }
       }
    ]
},
{
    name: "bubble",
    sprite: "bubble",
    inherits: "physics",
    events: [
       {
           name: "#setup", code: function (event) {
               this.setVar("$timer", 100);
               this.setVar("$x", this.getVar("#x"));
               this.setVar("$y", this.getVar("#y"));
               this.setVar("#z", getZ("character")-1);
               this.setVar("moving", true);
               this.setVar("updateState", false);
               this.setVar("margin", 0);
               this.setVar("w", 0);
               this.setVar("h", 0);
               this.setVar("gravity", -10);
               var random = Math.random();
               if (random < 0.4) {
                   this.setVar("left", true);
                   this.setVar("right", false);
               } else if (random < 0.8) {
                   this.setVar("left", false);
                   this.setVar("right", true);
               } else {
                   this.setVar("left", false);
                   this.setVar("right", false);
               }
               this.setVar("dir", "right");
               this.setVar("speed", rand(2, 10));
               this.setVar("grounded", false);
           }
       },
       {
           name: "#loop", code: function () {
               this.execute_event("updatePosition");
               if (this.getVar("speed") != 0) {
                   this.setVar("speed", this.getVar("speed") - 1);
               }
               this.setVar("$x", this.getVar("#x"));
               this.setVar("$y", this.getVar("#y"));
               this.setVar("$timer", this.getVar("$timer") - 2);
               if (this.getVar("$timer") == 0) {
                   this.engine.deleteObjectLive(this);
               }
           }
       }
    ]
},
{
    name: "splash",
    sprite: "splash",
    events: [
       {
           name: "#setup", code: function (event) {
               this.setVar("timer", 50);
           }
       },
       {
           name: "#loop", code: function () {
               this.setVar("timer", this.getVar("timer") - 1);
               if (this.getVar("timer") == 0) {
                   this.engine.deleteObjectLive(this);
               }
           }
       }
    ]
},

{
    name: "dayNightCycle",
    events: [
        {
            name: "#setup", code: function () {
                this.setVar("timer", 501);
                this.setVar("time", "Day");
                if(!this.getVar("dayTime")){
                    this.setVar("dayTime", 1000);
                }
                if(!this.getVar("nightTime")){
                    this.setVar("nightTime", 1000);
                }
                if(!this.getVar("stars")){
                    this.setVar("stars", false);
                }
                this.engine.addObjectLive("timeTint1", "tint", 0, 0, getZ("fgEffects"), true, false, { "$w": 1920, "$h": 1080, "$color": "#080932", "$opacity": "0" });
                this.engine.addObjectLive("timeTint2", "tint", 0, 0, getZ("bgNearEffects"), true, false, { "$w": 1920, "$h": 1080, "$color": "#080932", "$opacity": "0" });
                this.engine.addObjectLive("timeTint3", "tint", 0, 0, getZ("bgFarEffects"), true, false, { "$w": 1920, "$h": 1080, "$color": "black", "$opacity": "0" });
            }
        },
        {
            name: "#loop", code: function () {
                if (this.getVar("time") == "Day" && this.getVar("timer") == this.getVar("dayTime")) {
                    this.setVar("time", "Night");
                    this.engine.execute_event("nighttime");
                    this.setVar("timer", 0);
                }
                tint1 = this.engine.find("timeTint1");
                tint2 = this.engine.find("timeTint2");
                tint3 = this.engine.find("timeTint3");
                if (this.getVar("time") == "Night" && this.getVar("timer") <= 500) {
                    tint1.setVar("$opacity", this.getVar("timer") / 1000);
                    tint2.setVar("$opacity", this.getVar("timer") / 1000);
                    tint3.setVar("$opacity", this.getVar("timer") / 1000);
                }
                if (this.getVar("time") == "Day" && this.getVar("timer") <= 500) {
                    tint1.setVar("$opacity", 0.5 - (this.getVar("timer") / 1000));
                    tint2.setVar("$opacity", 0.5 - (this.getVar("timer") / 1000));
                    tint3.setVar("$opacity", 0.5 - (this.getVar("timer") / 1000));
                }
                if (this.getVar("stars") && this.getVar("timer") == 500 && this.getVar("time") == "Night") {
                    this.engine.addObjectLive("stars", this.getVar("starsImg"), 0, 0, getZ("skyProps")); //Would include opacity anim
                }
                if (this.getVar("time") == "Night" && this.getVar("timer") == this.getVar("nightTime")) {
                    this.setVar("time", "Day");
                    this.engine.execute_event("daytime");
                    this.setVar("timer", 0);
                }
                if (this.getVar("stars") && this.getVar("timer") == 0 && this.getVar("time") == "Day") {
                    //Start star fading anim
                }
                if (this.getVar("stars") && this.getVar("timer") == 100 && this.getVar("time") == "Day") {
                    this.engine.deleteObjectLive(this.engine.find("stars"));
                }
                this.setVar("timer", this.getVar("timer") + 1);
            }
        }
    ]
},
{
    name: "weather",
    events: [
        {
            name: "#setup", code: function () {
                this.setVar("timer", rand(2400, 240000));
                this.setVar("weather", "none");

                //var weatherCanvas = document.createElement('canvas');
                //weatherCanvas.width = 1920;
                //weatherCanvas.height = 1080;
                //var weatherCtx = weatherCanvas.getContext('2d');
                //weatherCtx.globalCompositionOperation = "overlay";
                //var img = new Image();
                //img.src = 'game/assets/images/fx/sunrays.png';
                //weatherCtx.drawImage(img, 0, 0);
            }
        },
        {
            name: "#loop", code: function () {
                this.setVar("timer", this.getVar("timer") - 1);
                if (this.getVar("timer") == 0) {
                    tint = this.engine.find("weatherTint");
                    if (tint) { this.engine.deleteObjectLive(tint);}
                    this.setVar("timer", rand(200, 1000));
                    p = Math.random();
                    if (p > 0.5) {
                        this.setVar("weather", "none");
                    } else if (p > 0.3) {
                        time=this.engine.find("dayNightCycle");
                        if (time && time.getVar("time") == "Day") {
                            this.setVar("weather", "cloudy");
                            this.engine.addObjectLive("weatherTint", "tint", 0, 0, getZ("fgEffects"), true, false, { "$w": 1920, "$h": 1080, "$color": "#080932", "$opacity": "0.2" });
                        }
                    }
                }
            }
        },
        {
            name: "nighttime", code: function () {
                tint = this.engine.find("weatherTint");
                if (tint) { this.engine.deleteObjectLive(tint); }
            }
        }
    ]
}
]);