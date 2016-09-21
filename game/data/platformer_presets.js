var game_presets = game_presets || [];
game_presets = game_presets.concat([
    {
        name: "physics",
        events: [
            {
                name: "updatePosition", code: function () {
                    var vx = 0;
                    if (this.getVar("jumping") > 0) {
                        this.setVar("jumping", this.getVar("jumping") - 1);
                    }
                    if (this.getVar("moving") == true) {
                        if (this.getVar("right")) {
                            vx = 1;
                        } else if (this.getVar("left")) {
                            vx = -1;
                        }
                        v = Math.sqrt(vx * vx + 1);
                        vx = (vx / v) * this.getVar("currentSpeed");

                        vy = (1 / v) * (this.getVar("currentGravity") - this.getVar("jumping"));

                        if (vx > 0) {
                            this.setVar("dir", "right");
                        } else if (vx < 0) {
                            this.setVar("dir", "left");
                        }
                    } else {
                        if (this.getVar("right")) {
                            this.setVar("dir", "right");
                        } else if (this.getVar("left")) {
                            this.setVar("dir", "left");
                        }
                    }

                    var margin = this.getVar("margin");
                    //Update x
                    if (this.getVar("sliding") == false) {
                        var collisions = this.engine.collisionQuery("box", { "x": this.getVar("#x") + vx + margin, "y": this.getVar("#y"), "w": this.getVar("w") - margin * 2, "h": this.getVar("h") });
                    } else {
                        var collisions = this.engine.collisionQuery("box", { "x": this.getVar("#x") + vx + margin, "y": this.getVar("#y") + margin + this.getVar("h") / 2, "w": this.getVar("w") - margin * 2, "h": this.getVar("h") / 2 - margin * 2 });
                    }
                    var engine = this.engine;
                    if (collisions.filter(function (x) { return engine.getObject(x).getVar("isSolid"); }).length == 0) {
                        this.setVar("#x", this.getVar("#x") + vx);
                    }
                    //Update y
                    var collisions = this.engine.collisionQuery("box", { "x": this.getVar("#x")+margin, "y": this.getVar("#y") + vy, "w": this.getVar("w") - margin *2, "h": this.getVar("h") });
                    if (collisions.filter(function (x) { return engine.getObject(x).getVar("isSolid"); }).length == 0) {
                        this.setVar("#y", this.getVar("#y") + vy);
                        this.setVar("grounded", false);
                    } else {
                        if (vy > 0) {
                            this.setVar("grounded", true);
                            this.setVar("jumpsLeft", this.getVar("totalJumps"));
                            if (this.engine.getEngineVar("fallDamage") && !this.getVar("swimming")) {
                                if (this.getVar("fallTimer") > 100) {
                                    if (this.execute_event("hurt", { "damage": Math.floor(this.getVar("fallTimer") / 10)*this.getVar("fallDamageMultiplier"), "dir": "none" }) == "#exit") {
                                        return "#exit";
                                    }
                                }
                            }
                            this.setVar("fallTimer", 0);
                            this.setVar("currentGravity", this.getVar("gravity"));

                        } else {
                            this.setVar("ceiling", true);
                            this.setVar("jumping", 0);
                            this.setVar("grounded", false);
                        }
                    }
                    //Check if swimming
                    var collisions = this.engine.collisionQuery("box", { "x": this.getVar("#x"), "y": this.getVar("#y"), "w": this.getVar("w"), "h": this.getVar("h") });
                    if (collisions.filter(function (x) { return engine.getObject(x).instanceOf("deepWater"); }).length != 0) {
                        this.setVar("currentGravity", this.getVar("gravity") / 3.5);
                        this.setVar("currentSpeed", this.getVar("speed") / 3);
                        //if (!this.getVar("swimming")) {
                        //    this.engine.addObjectLive("splash", "splash", this.getVar("#x") + this.getVar("w") / 2, this.getVar("#y") + this.getVar("h") / 2, this.getVar("#y"), false, false);
                        //}
                        this.setVar("swimming", true);
                        if (this.getVar("swimmingTimer") > 0) {
                            this.setVar("swimmingTimer", this.getVar("swimmingTimer") - 1);
                            orb = this.engine.find("O2Orb" + this.getVar("name"));
                            if (orb) { orb.execute_event("decreaseO2", { "fill": 25 * (this.getVar("swimmingTimer")) / this.getVar("air") }); }
                        }
                        if (this.getVar("swimmingTimer") == 0) {
                            if (this.execute_event("hurt", { "damage": this.getVar("defense") * 2, "dir": "none" }) == "#exit") {
                                return "#exit";
                            }
                            this.setVar("swimmingTimer", 50);
                        }
                        if (this.getVar("swimmingTimer")%5==0) {
                            this.engine.addObjectLive("bubble", "bubble", this.getVar("#x") + this.getVar("w") / 2, this.getVar("#y") + this.getVar("h") / 2, this.getVar("#y"), false, false);
                        }
                    } else {
                        this.setVar("currentSpeed", this.getVar("speed"));
                        if (this.getVar("swimming")) {
                            //this.engine.addObjectLive("splash", "splash", this.getVar("#x") + this.getVar("w") / 2, this.getVar("#y") + this.getVar("h") / 2, this.getVar("#y"), false, false);
                            this.setVar("currentGravity", this.getVar("gravity"));
                            this.setVar("jumpsLeft", this.getVar("totalJumps"));
                            this.setVar("swimmingTimer", this.getVar("air"));
                            orb = this.engine.find("O2Orb" + this.getVar("name"));
                            if (orb) { this.engine.deleteObjectLive(orb);}
                        }
                        this.setVar("swimming", false);

                    }

                    if (this.getVar("updateState")) {
                        if (this.getVar("grounded")) {
                            if (vx != 0 && this.getVar(this.getVar("dir") + "RunState")) {
                                this.setVar("#state", this.getVar(this.getVar("dir") + "RunState")); //This way I can change the anim easily or have no special anim
                            } else if (this.getVar(this.getVar("dir") + "IdleState")) {
                                this.setVar("#state", this.getVar(this.getVar("dir") + "IdleState"));
                            }
                        } else {
                            if (this.getVar("jumping") <= 0) {
                                if (this.getVar(this.getVar("dir") + "FallState")) {
                                    this.setVar("#state", this.getVar(this.getVar("dir") + "FallState"));
                                }
                            } else {
                                if (this.getVar(this.getVar("dir") + "JumpState")) {
                                    this.setVar("#state", this.getVar(this.getVar("dir") + "JumpState"));
                                }
                            }
                        }
                    }
                }
            }
        ]
    },
{
    name: "character",
    inherits: "physics",
    events: [
        {
            name: "#setup", code: function () {
                //Default values that can be overwitten in childSetup
                this.setVar("w", 100);
                this.setVar("h", 100);
                this.setVar("margin", 50);
                this.setVar("grounded", false);

                this.setVar("uppercutTime", 30);
                this.setVar("slideTime", 30);
                this.setVar("lightTime", 10);

                this.setVar("speed", 20);
                this.setVar("gravity", 10);
                this.setVar("jumpForce", 40);
                this.setVar("totalJumps", 1);
                this.setVar("totalAttacks", 3)
                this.setVar("air", 500);
                this.setVar("fallDamageMultiplier", 10);

                this.setVar("attack", 5);
                this.setVar("attackRange", this.getVar("w"));
                this.setVar("defense", 1);
                this.setVar("life", 20);

                this.setVar("rightIdleState", "IdleR");
                this.setVar("leftIdleState", "IdleL");
                this.setVar("rightRunState", "RunR");
                this.setVar("leftRunState", "RunL");
                this.setVar("rightHurtState", "HurtR");
                this.setVar("leftHurtState", "HurtL");
                this.setVar("rightJumpState", "JumpR");
                this.setVar("leftJumpState", "JumpL");
                this.setVar("rightFallState", "FallR");
                this.setVar("leftFallState", "FallL");
                this.setVar("rightCrouchState", "CrouchR");
                this.setVar("leftCrouchState", "CrouchL");
                this.setVar("rightUppercutState", "UppercutR");
                this.setVar("leftUppercutState", "UppercutL");
                this.setVar("rightSlideState", "SlideR");
                this.setVar("leftSlideState", "SlideL");
                this.setVar("rightAirKickState", "SlideR");
                this.setVar("leftAirKickState", "SlideL");
                this.setVar("rightLightState1", "Light1R");
                this.setVar("leftLightState1", "Light1L");
                this.setVar("rightLightState2", "Light2R");
                this.setVar("leftLightState2", "Light2L");
                this.setVar("rightLightState3", "Light3R");
                this.setVar("leftLightState3", "Light3L");

                this.setVar("isAlly", false);

                this.execute_event("childSetup");

                this.setVar("#state", "RunR");
                this.setVar("#z", getZ("character"));
                this.setVar("alive", true);
                this.setVar("moving", true);
                this.setVar("jumping", 0);
                this.setVar("left", false);
                this.setVar("right", false);
                this.setVar("dir", "right");
                this.setVar("attackDir", "right");
                this.setVar("jumpsLeft", 0);
                this.setVar("attackN", 1);
                this.setVar("attackTimer", 0);
                this.setVar("postAttackTimer", 0);
                this.setVar("lightAttackTimer", 0);
                this.setVar("hurtTimer", 0);
                this.setVar("changeTimer", 0);
                this.setVar("fallTimer", 0);
                this.setVar("swimmingTimer", this.getVar("air"));
                this.setVar("currentLife", this.getVar("life"));
                this.setVar("currentAttack", this.getVar("attack"));
                this.setVar("currentDefense", this.getVar("defense"));
                this.setVar("currentGravity", this.getVar("gravity"));
                this.setVar("currentSpeed", this.getVar("speed"));
                this.setVar("updateState", true);
                this.setVar("attacking", false);
                this.setVar("sliding", false);
                this.setVar("held", "none");
                this.setVar("holding", false);
                this.setVar("swimming", false);


                var margin = this.getVar("margin");
                this.setCollider("character", { "x": margin, "y": margin, "w": this.getVar("w")-margin*2, "h": this.getVar("h")-margin*2 });

            }
        },
        {
            name: "#collide", code: function (event) {
                if (this.getVar("alive") == true &&  this.engine.getObject(event.object) != undefined) {
                    //Ally touches enemy
                    if (!this.getVar("attacking") && this.engine.getEngineVar("touchDamage") && this.getVar("isAlly") && !this.engine.getObject(event.object).getVar("isAlly")) {
                        var dir = this.getVar("dir") == "right" ? "left" : "right";
                        if (this.execute_event("hurt", {"damage": this.getVar("defense")+1, "dir": dir}) == "#exit") {
                            return "#exit";
                        }
                    }
                    //Attacks
                    if (this.getVar("attacking") && event.shape1tag == "attack" && event.shape2tag=="character") {
                        if (this.getVar("isAlly") == this.engine.getObject(event.object).getVar("isAlly")) { //Ally vs ally or enemy vs enemy
                            if (this.engine.getEngineVar("allyDamage")) {
                                if (this.engine.getObject(event.object).execute_event("hurt", { "damage": this.getVar("currentAttack"), "dir": this.getVar("attackDir") }) == "#exit") {
                                    return "#exit";
                                }
                            }
                        } else {
                            if (this.engine.getObject(event.object).execute_event("hurt", { "damage": this.getVar("currentAttack"), "dir": this.getVar("attackDir") }) == "#exit") {
                                return "#exit";
                            }
                        }
                        
                    }
                }
            }
        },
		{
		    name: "#loop", code: function () {
		        this.execute_event("updatePosition");
		        if (this.getVar("attackTimer") > 0) {
		            this.setVar("attackTimer", this.getVar("attackTimer")-1);
		            if (this.getVar("attackTimer") == 0) {
		                this.setVar("left", false);
		                this.setVar("right", false);
		                this.setVar("updateState", true);
		                this.setCollider("attack", { "x": 0, "y": 0, "w": 0, "h": 0 });
		                this.setVar("attacking", false);
		            }
		        }
		        if (this.getVar("attackTimer") == 0 && this.getVar("postAttackTimer") > 0) {
		            this.setVar("postAttackTimer", this.getVar("postAttackTimer") - 1);
		            this.setVar("currentAttack", this.getVar("attack"));
		            if (this.getVar("sliding") == true) {
		                this.setCollider("character", { "x": 0, "y": 0, "w": this.getVar("w"), "h": this.getVar("h") });
		                this.setVar("sliding", false);
		                this.setVar("currentGravity", this.getVar("gravity"));
		            }
		        }
		        if (this.getVar("hurtTimer") > 0) {
		            this.setVar("hurtTimer", this.getVar("hurtTimer") - 1);
		            if (this.getVar("hurtTimer") == 0) {
		                this.setVar("left", false);
		                this.setVar("right", false);
		                this.setVar("updateState", true);
		            }
		        }
		        if (this.getVar("changeTimer") > 0) {
		            this.setVar("changeTimer", this.getVar("changeTimer") - 1);
		        }
		        if (this.getVar("held") != "none") {
		            var holder = this.getVar("held");
		            this.setVar("#x", holder.getVar("#x"));
		            this.setVar("#y", holder.getVar("#y"));
		        }
		        if (!this.getVar("grounded")) {
		            this.setVar("fallTimer", this.getVar("fallTimer") + 1);
		            //if (this.getVar("gravity") < 50) { //I don't like this anymore
		            //    this.setVar("currentGravity", this.getVar("currentGravity") + Math.floor(this.getVar("fallTimer") / 100));
		            //}
		        }
		        if (this.getVar("swimmingTimer") == this.getVar("air")-1) {
		            this.engine.addObjectLive("O2Orb" + this.getVar("name"), "O2Orb", this.getVar("#x") + this.getVar("w") / 2 -this.getVar("margin"), this.getVar("#y") - 20, 0, false, false, {"chara": "Essie"}); //TODO: ZINDEX
		        }
		    }
		},

        //Common behaviors
        {
            name: "hurt", code: function (event) { //Needs: damage, dir
                if (this.engine.getEngineVar("bloodshed")) {
                    this.engine.addObjectLive("bloodDrop", "bloodDrop", this.getVar("#x") + this.getVar("w") / 2, this.getVar("#y") + this.getVar("h") / 2, this.getVar("#y"), false, false);
                }
                if (this.getVar("hurtTimer") == 0 && event.damage!=0) {
                    this.setVar("hurtTimer", 10);
                    this.setVar("updateState", false);
                    this.setVar("left", false);
                    this.setVar("right", false);
                    if (event.dir == "up") {
                        this.execute_event("lilJump", { "factor": 2 });
                    }
                    //else if (event.dir == "down") {
                    //    this.setVar("currentGravity", this.getVar("gravity") + 10);
                    //}
                    else if (event.dir != "none") {
                        var dir = event.dir;
                        this.setVar(dir, true);
                    }
                    this.setVar("#state", this.getVar(this.getVar("dir") + "HurtState"));
                    var hp = event.damage - this.getVar("currentDefense");
                    this.setVar("currentLife", this.getVar("currentLife" - hp));
                    var name = this.getVar("name");
                    name = name.replace(/\s/, '');
                    this.engine.find("healthBar" + name).execute_event("decreaseHealthBar", { "hp": hp }); //TODO Carefuuuul, more than one health bar?
                    this.engine.addObjectLive("hpText", "hpText", this.getVar("#x") + this.getVar("w") / 2, this.getVar("#y"), this.getVar("#y"), false, false, { "$text": "-" + hp, "$color": "red" });
                    if (this.getVar("currentLife") <= 0) {
                        if (this.execute_event("death") == "#exit") {
                            return "#exit";
                        }
                    }
                }
            }
        },
        {
            name: "death", code: function () {
                this.setVar("updateState", false);
                this.setVar("#state", this.getVar(this.getVar("dir") + "HurtState"));
                return "#exit";
            }
        },
        {
            name: "jump", code: function () {
                if (this.getVar("grounded")) {
                    this.setVar("up", true);
                    this.setVar("jumping", this.getVar("jumpForce"));
                    this.setVar("down", false);
                    this.setVar("grounded", false);
                    this.setVar("fallTimer", 0);
                    this.setVar("currentGravity", this.getVar("gravity"));
                }else if (this.getVar("jumpsLeft") > 1) {
                    this.setVar("jumping", this.getVar("jumpForce"));
                    this.setVar("jumpsLeft", this.getVar("jumpsLeft") - 1);
                    this.setVar("fallTimer", 0);
                    this.setVar("currentGravity", this.getVar("gravity"));
                }


            }
        },
        {
            name: "lilJump", code: function (event) {
                    this.setVar("up", true);
                    this.setVar("jumping", this.getVar("jumpForce")/event.factor);
                    this.setVar("down", false);
                    this.setVar("grounded", false);
                    this.setVar("fallTimer", 0);
                    this.setVar("currentGravity", this.getVar("gravity"));

            }
        },
        {
            name: "lightAttack", code: function () {
                if ((this.getVar("attackN") <= this.getVar("totalAttacks")) && this.getVar("attackTimer") == 0 && this.getVar("postAttackTimer")==0) {
                    this.setVar("updateState", false);
                    this.setVar("attacking", true);
                    //this.engine.setEngineVar("touchDamage", false);
                    this.setVar("left", false);
                    this.setVar("right", false);
                    if (this.getVar("attackN") == 1) {
                        this.setVar(this.getVar("dir"), true);
                        this.setVar("attackDir", "none");
                    } else if (this.getVar("attackN") == 2) {
                        this.execute_event("lilJump", {"factor": 1.2});
                        this.setVar("attackDir", "up");
                    } else if (this.getVar("attackN") == 3) {
                        this.setVar("currentGravity", this.getVar("gravity") + 10);
                        this.setVar("attackDir", "down");
                    }
                    if (this.getVar("dir") == "right") {
                        var range = 1;
                    }
                    var range = this.getVar("dir") == "right" ? 1 : -1;
                    this.setCollider("attack", { "x": range*this.getVar("attackRange"), "y": 0, "w": this.getVar("w"), "h": this.getVar("h") });

                    this.setVar("attackTimer", this.getVar("lightTime") + 2 * this.getVar("attackN") * this.getVar("attackN"));
                    this.setVar("#state", this.getVar(this.getVar("dir") + "LightState" + this.getVar("attackN")));
                    this.setVar("currentAttack", Math.floor(this.getVar("currentAttack") + this.getVar("currentAttack") * 0.1));
                    this.setVar("attackN", this.getVar("attackN") + 1);
                }
            }
        },
        {
            name: "uppercut", code: function () {
                if (this.getVar("postAttackTimer") == 0) {
                    this.setVar("updateState", false);
                    this.setVar("attacking", true);
                    this.setVar("left", false);
                    this.setVar("right", false);
                    this.setVar("attackDir", "up");

                    this.execute_event("lilJump", { "factor": 1.2 });

                    this.setCollider("attack", { "x": 0, "y": -this.getVar("attackRange"), "w": this.getVar("w"), "h": this.getVar("h") * 2 });
                    this.setVar("attackTimer", this.getVar("uppercutTime"));
                    this.setVar("postAttackTimer", this.getVar("uppercutTime")*2);
                    this.setVar("#state", this.getVar(this.getVar("dir") + "UppercutState"));
                }
            }
        },
        {
            name: "slide", code: function () { //Autocrouch if stuck
                if (this.getVar("postAttackTimer") == 0) {
                    this.setVar("updateState", false);
                    this.setVar("attacking", true);
                    this.setVar("sliding", true);
                    this.setVar("left", false);
                    this.setVar("right", false);
                    this.setVar(this.getVar("dir"), true);
                    this.setVar("attackDir", this.getVar("dir"));
                    this.setCollider("attack", { "x": 0, "y": 0, "w": this.getVar("w"), "h": this.getVar("h") });
                    this.setCollider("character", { "x": 0, "y": this.getVar("h") / 2, "w": this.getVar("w"), "h": this.getVar("h") / 2 });
                    this.setVar("attackTimer", this.getVar("slideTime"));
                    this.setVar("postAttackTimer", this.getVar("slideTime")*0.2);
                    if (this.getVar("grounded")) {
                        this.setVar("#state", this.getVar(this.getVar("dir") + "SlideState"));
                    } else {
                        this.setVar("#state", this.getVar(this.getVar("dir") + "AirKickState"));
                    }
                }
            }
        },
        {
            name: "heavyAttack", code: function () {

            }
        },
        {
            name: "auraAttack", code: function () {

            }
        },
        {
            name: "crouch", code: function () {
                if (this.getVar("grounded")) {
                    this.setVar("updateState", false);
                    this.setVar("moving", false);
                    this.setCollider("character", { "x": 0, "y": this.getVar("h") / 2, "w": this.getVar("w"), "h": this.getVar("h") / 2 });
                    this.setVar("#state", this.getVar(this.getVar("dir") + "CrouchState"));
                } else {
                    if (this.getVar("currentGravity") < 50) {
                        //this.setVar("currentGravity", this.getVar("gravity") + Math.floor(this.getVar("fallTimer") / 9) + 10);
                        this.setVar("currentGravity", this.getVar("currentGravity") + 10);
                    }
                }
            }
        },
        {
            name: "uncrouch", code: function () {
                if (this.getVar("grounded")) {
                    this.setCollider("character", { "x": 0, "y": 0, "w": this.getVar("w"), "h": this.getVar("h") });
                    this.setVar("updateState", true);
                    this.setVar("moving", true);
                } else {
                    //if (this.getVar("currentGravity") > this.getVar("gravity")) {
                        //this.setVar("currentGravity", this.getVar("gravity") + Math.floor(this.getVar("fallTimer") / 9) - 10);
                        this.setVar("currentGravity", this.getVar("gravity"));
                    //}
                }
            }
        },
        {
            name: "changeAlly", code: function () {
                if (this.getVar("nextAlly") && this.getVar("changeTimer") == 0) {
                    var ally = this.engine.find(this.getVar("nextAlly"));
                    this.setVar("changeTimer", 40);
                    ally.setVar("changeTimer", 40);
                    this.engine.find("camera").setVar("player", ally);
                    ally.setVar("focus", true);
                    this.setVar("focus", false);
                }
            }
        }
    ],
    collision: {
        "box": [
            { "x": 0, "y": 0, "w": 0, "h": 0, "#tag": "character" },
            { "x": 0, "y": 0, "w": 0, "h": 0, "#tag": "attack" }
        ]
    }
},
{
    name: "Essie",
    sprite: "mockupEssie",
    inherits: "character",
    events: [
        {
            name: "childSetup", code: function () {
                this.setVar("name","Essie");
                this.setVar("isAlly", true);
                this.setVar("w", 200);
                this.setVar("h", 175);

                //this.setVar("totalJumps", Infinity);

                this.setVar("attack", 20);
                this.setVar("attackRange", this.getVar("w"));
                this.setVar("defense", 5);
                this.setVar("life", 50);

                this.setVar("speed", 40);
                this.setVar("gravity", 15);
                this.setVar("jumpForce", 40);
                this.setVar("air", 500);
            }
        },
        {
            name: "keyboard_down", code: function (event) {
                if (this.getVar("focus")) {
                    if (event.key == 32) { //SPACE

                    } else if (event.key == 38) { //UP
                        if (this.getVar("swimming")) {
                            this.execute_event("lilJump", {"factor": 2});
                        } else {
                            this.execute_event("jump");
                        }
                    } else if (event.key == 37) { //LEFT
                        if (this.getVar("attackTimer") == 0) {
                            this.setVar("right", false);
                            this.setVar("left", true);
                        }
                    } else if (event.key == 40) { //DOWN
                        if (!this.getVar("swimming")) { //Since crouching underwater is buggy and im not sure about the best way to fix it
                            this.execute_event("crouch");
                        }
                    } else if (event.key == 39) { //RIGHT
                        if (this.getVar("attackTimer") == 0) {
                            this.setVar("left", false);
                            this.setVar("right", true);
                        }
                    } else if (event.key == 87) { //W
                        if (!this.getVar("holding")) {
                            this.execute_event("uppercut");
                        }
                    } else if (event.key == 65) { //A
                        //Heavy
                        this.engine.execute_event("hurt", { "damage": 50, "dir": "right" })

                    } else if (event.key == 83) { //S
                            this.execute_event("slide");
                    } else if (event.key == 68) { //D
                        if (!this.getVar("holding")) {
                            this.execute_event("lightAttack");
                        }
                    } else if (event.key == 69) {
                        if (this.getVar("held") == "none") {
                            if (this.getVar("holding")) {
                                var keystroke = this.engine.find("Keystroke");
                                keystroke.setVar("moving", true);
                                keystroke.setVar("updateState", true);
                                keystroke.setVar("held", "none");
                                keystroke.setVar("hurtTimer", 0);
                                keystroke.setVar("fallTimer", 0);
                                this.setVar("holding", false);
                                this.setVar("currentGravity", this.getVar("gravity"));
                                this.setVar("totalJumps", 1);
                            } else {
                                var keystroke = this.engine.find("Keystroke");
                                if (distance(this.getVar("#x"), keystroke.getVar("#x"), this.getVar("#y"), keystroke.getVar("#y")) < 100) {
                                    keystroke.setVar("#state", this.getVar(this.getVar("dir") + "FallState"));
                                    keystroke.setVar("#x", this.getVar("#x"));
                                    keystroke.setVar("#y", this.getVar("#y"));
                                    keystroke.setVar("moving", false);
                                    keystroke.setVar("updateState", false);
                                    keystroke.setVar("held", this);
                                    keystroke.setVar("hurtTimer", -1);
                                    keystroke.setVar("right", false);
                                    keystroke.setVar("left", false);
                                    this.setVar("holding", true);
                                    this.setVar("currentGravity", this.getVar("gravity") * 2);
                                    this.setVar("totalJumps", 2);
                                }
                            }
                        }
                    }
                }
            }
        },
        {
            name: "keyboard_up", code: function (event) {
                if (this.getVar("focus")) {
                    if (event.key == 32) { //SPACE

                    } else if (event.key == 38) { //UP
                        this.setVar("up", false);
                    } else if (event.key == 37) { //LEFT
                        this.setVar("left", false);
                    } else if (event.key == 40) { //DOWN
                        this.execute_event("uncrouch");
                    } else if (event.key == 39) { //RIGHT
                        this.setVar("right", false);
                    } else if (event.key == 87) { //W
                    } else if (event.key == 65) { //A
                    } else if (event.key == 83) { //S
                    } else if (event.key == 68) { //D
                        this.setVar("attackN", 1);
                        this.setVar("postAttackTimer", this.getVar("attackN") * 8);
                        //this.engine.setEngineVar("touchDamage", true);
                    } else if (event.key == 81) {
                        this.execute_event("changeAlly");
                    }
                }
            }
        }
    ]
},
{
    name: "dummy",
    sprite: "mockupEssie",
    inherits: "character",
    events: [
        {
            name: "childSetup", code: function () {
                this.setVar("name", "Essie Dummy");
                this.setVar("isAlly", false);
                this.setVar("w", 200);
                this.setVar("h", 175);

                this.setVar("life", 20);
            }
        },       
    ]
},
{
    name: "Key",
    sprite: "mockupKey",
    inherits: "character",
    events: [
        {
            name: "childSetup", code: function () {
                this.setVar("name", "Keystroke");
                this.setVar("isAlly", true);
                this.setVar("w", 200);
                this.setVar("h", 175);

                this.setVar("totalJumps", Infinity);

                this.setVar("attack", 10);
                this.setVar("attackRange", this.getVar("w")*2);
                this.setVar("defense", 10);
                this.setVar("life", 50);

                this.setVar("speed", 20);
                this.setVar("gravity", 10);
                this.setVar("jumpForce", 40);
                this.setVar("air", 300);
                this.setVar("fallDamageMultiplier", 0);
            }
        },
        {
            name: "keyboard_down", code: function (event) {
                if (this.getVar("focus")) {
                    if (event.key == 32) { //SPACE

                    } else if (event.key == 38) { //UP
                        this.execute_event("jump");
                    } else if (event.key == 37) { //LEFT
                        if (this.getVar("attackTimer") == 0) {
                            this.setVar("right", false);
                            this.setVar("left", true);
                        }
                    } else if (event.key == 40) { //DOWN
                        this.execute_event("crouch");
                    } else if (event.key == 39) { //RIGHT
                        if (this.getVar("attackTimer") == 0) {
                            this.setVar("left", false);
                            this.setVar("right", true);
                        }
                    } else if (event.key == 87) { //W
                        //this.execute_event("uppercut");
                    } else if (event.key == 65) { //A
                        //Heavy
                        this.engine.execute_event("hurt", { "damage": 50, "dir": "right" })

                    } else if (event.key == 83 || event.key == 40) { //S
                        //this.execute_event("slide");
                    } else if ((event.key == 68) || (event.key == 39)) { //D
                        //this.execute_event("lightAttack");
                    } else if (event.key == 69) { //TODO: Make other things holdable!!! :D
                        if (this.getVar("held") == "none") {
                            if (this.getVar("holding")) {
                                var essie = this.engine.find("Essie");
                                essie.setVar("moving", true);
                                essie.setVar("updateState", true);
                                essie.setVar("held", "none");
                                this.setVar("holding", false);
                                this.setVar("currentGravity", this.getVar("gravity"));
                                essie.setVar("hurtTimer", 0);
                                essie.setVar("fallTimer", 0);
                            } else {
                                var essie = this.engine.find("Essie");
                                if (distance(this.getVar("#x"), essie.getVar("#x"), this.getVar("#y"), essie.getVar("#y")) < 100) {
                                    essie.setVar("#state", this.getVar(this.getVar("dir") + "FallState"));
                                    essie.setVar("#x", this.getVar("#x"));
                                    essie.setVar("#y", this.getVar("#y"));
                                    essie.setVar("moving", false);
                                    essie.setVar("updateState", false);
                                    essie.setVar("held", this);
                                    essie.setVar("hurtTimer", -1);
                                    essie.setVar("right", false);
                                    essie.setVar("left", false);
                                    this.setVar("holding", true);
                                    this.setVar("currentGravity", this.getVar("gravity") * 2);
                                }
                            }
                        }
                    }
                }
            }
        },
        {
            name: "keyboard_up", code: function (event) {
                if (this.getVar("focus")) {
                    if (event.key == 32) { //SPACE

                    } else if (event.key == 38) { //UP
                        this.setVar("up", false);
                    } else if (event.key == 37) { //LEFT
                        this.setVar("left", false);
                    } else if (event.key == 40) { //DOWN
                        this.execute_event("uncrouch");
                    } else if (event.key == 39) { //RIGHT
                        this.setVar("right", false);
                    } else if (event.key == 87) { //W
                    } else if (event.key == 65) { //A
                    } else if (event.key == 83 || event.key == 40) { //S
                    } else if ((event.key == 68) || (event.key == 39)) { //D
                        this.setVar("attackN", 1);
                        this.setVar("postAttackTimer", this.getVar("attackN") * 8);
                        //this.engine.setEngineVar("touchDamage", true);
                    } else if (event.key == 81) {
                        this.execute_event("changeAlly");
                    }
                }
            }
        }
    ]
},
]);


