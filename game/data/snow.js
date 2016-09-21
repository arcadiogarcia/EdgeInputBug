var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var width = window.innerWidth;
var height = window.innerHeight;

canvas.width = width;
canvas.height = height;

var radius = canvas.width / 1000;

var xsquares = 10;
var ysquares = 10;
var nstars = 200;
var squaresizex = width / xsquares;
var squaresizey = height / ysquares;

var flakes = [];

for (var i = 0; i < nstars; i++) {
    var square = Math.floor(i / (nstars / (xsquares * ysquares)));
    var squarex = square % xsquares;
    var squarey = Math.floor(square / xsquares);


    var x = squarex * squaresizex + Math.random() * squaresizex;
    var y = squarey * squaresizey + Math.random() * squaresizey;
    var z = 1 + Math.random();
    var r = (Math.random() * 255) | 0;
    var g = (Math.random() * 255) | 0;
    var t = 50 + Math.random() * 50;

    flakes.push({ x: x, y: y, z: z, r: r, g: g, t: t });
}

var t = 0;

function draw() {
    context.fillStyle = "#030303";
    if (exit == true) {
        context.globalAlpha = 0.1;
    }
    context.fillRect(0, 0, width, height);
    context.globalAlpha = 1;
    var base_radius;
    flakes.forEach(function (s) {
        var x = s.x, y = s.y;
        base_radius = 2 + Math.floor(radius * s.z * (0.5 + Math.sin(2 * Math.PI * (t % s.t) / s.t)));
        if (exit === true) {
            var cx = width * 0.63, cy = height * 0.7;
            var scale = Math.pow(1.05, exittimer) / 20 + 1;
            x = (x - cx) * scale + cx;
            y = (y - cy) * scale + cy;
            base_radius *= scale;
        }

        context.globalAlpha = 1 - Math.sin(2 * Math.PI * (t % s.t) / s.t);
        context.beginPath();
        context.arc(x, y, base_radius * 2, 0, 2 * Math.PI, false);
        context.fill();

        context.beginPath();
        context.arc(x, y, base_radius, 0, 2 * Math.PI, false);
        context.fill();

        context.globalAlpha = 1;
        context.fillStyle = "#FFF";
        context.beginPath();
        context.arc(x, y, base_radius / 2, 0, 2 * Math.PI, false);
        context.fill();

        s.y += s.z;
        if (s.y > height) {
            s.y -= height;
        }
    });
    t += 1;

    exittimer++;
    requestAnimationFrame(draw);
}
draw();