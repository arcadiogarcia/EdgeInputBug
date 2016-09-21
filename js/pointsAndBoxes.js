// Basic collisions for the Clockwork engine
// Arcadio Garcia Salvadores

var ClockworkCollisions = ClockworkCollisions || {};

ClockworkCollisions.pointsAndBoxes = {
    shapes: ["point", "box"],
    detectors: [
        {
            shape1: "point",
            shape2: "box",
            detector: function (p, b, data) {
                if (p.x >= b.x && p.y >= b.y && p.x <= b.x + b.w && p.y <= b.y + b.h) {
                    data.x = (p.x - b.x) / b.w;
                    data.y = (p.y - b.y) / b.h;
                    return true;
                } else {
                    return false;
                }
            }
        },
        {
            shape1: "box",
            shape2: "box",
            detector: function (b1, b2, data) {
                if ((b1.x + b1.w) <= b2.x || (b2.x + b2.w) <= b1.x || (b1.y + b1.h) <= b2.y || (b2.y + b2.h) <= b1.y) {
                    return false;
                } else {
                    return true;
                }
            }
        }
    ]
};
