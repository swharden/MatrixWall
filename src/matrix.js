let background = "#24292f";
let foreground = "#39b34d";

let matrixTarget = document.body;
if (typeof matrixSettings != "undefined") {
    console.log("matrix: loading custom settings from matrixSettings");
    console.log({ matrixSettings });
    if (matrixSettings.target)
        matrixTarget = matrixSettings.target;
    if (matrixSettings.background)
        background = matrixSettings.background;
    if (matrixSettings.foreground)
        foreground = matrixSettings.foreground;
} else {
    console.log("matrix: matrixSettings object not found, using default settings");
}

// setup target style
matrixTarget.innerHTML = "";
matrixTarget.style.display = "flex";
matrixTarget.style.alignItems = "center";
matrixTarget.style.justifyContent = "center";
matrixTarget.style.overflow = "hidden";
matrixTarget.style.setProperty("background-color", background, "important");
matrixTarget.style.setProperty("color", foreground, "important");
matrixTarget.style.padding = "0px";
matrixTarget.style.margin = "0px";

// get dimensions
let width = matrixTarget.getBoundingClientRect().width;
let height = matrixTarget.getBoundingClientRect().height;

// change some things if we are drawing in the body
if (matrixTarget == document.body) {
    document.body.style.height = "100%";
    width = window.innerWidth;
    height = window.innerHeight;
}

const characterSize = 28;
const columnCount = Math.floor(width / characterSize);
const rowCount = Math.floor(height / characterSize);
console.log({ columnCount })
console.log({ rowCount })

function createColumnElement() {
    const el = document.createElement('span');
    el.style.display = "block";
    el.style.fontSize = characterSize + "px";
    el.style.textAlign = "center";
    el.style.width = characterSize + "px";
    el.style.height = characterSize + "px";
    el.style.opacity = 0;
    el.style.fontFamily = "Consolas, Helvetica, sans-serif";
    return el;
}

for (let i = 0; i < columnCount; i++) {
    const p = document.createElement('p');
    p.style.lineHeight = 1;
    p.style.widows = "30px";
    setupColumn(p);
    matrixTarget.append(p);
}

function setupColumn(p) {
    const delay = random(100, 300);
    const duration = random(100, 2000);
    const hasChildren = p.children.length > 0;

    for (let j = 0; j < rowCount; j++) {
        const span = hasChildren
            ? p.children.item(j)
            : createColumnElement();

        span.innerText = getRandomChar();
        const animation = span.animate([
            { opacity: '1' },
            { opacity: '0.05' }
        ], {
            duration: duration,
            delay: delay + (j * 75), // add delay for every char
            fill: 'forwards' // keep element with the last state of anim
        });

        // rebuild column after last char disappear
        if (j === rowCount - 1) {
            animation.onfinish = () => {
                setupColumn(p);
            };
        }

        if (!hasChildren) {
            p.appendChild(span);
        }
    }
}

function random(from, to) {
    return Math.trunc(Math.random() * (to - from + 1) + from);
}

function getRandomChar() {
    const charRanges = [
        [0x3041, 0x30ff], // Japanese
        [0x3041, 0x30ff], // Japanese (extra weight)
        [0x3041, 0x30ff], // Japanese (extra weight)
        [0x3041, 0x30ff], // Japanese (extra weight)

        [0x0030, 0x0031], // 0s and 1s

        [0x0030, 0x0039], // English numbers
        [0x0041, 0x005A], // English uppercase letters
        [0x00bc, 0x02af] // Latin characters
    ];
    const i = random(0, charRanges.length - 1);
    return String.fromCharCode(random(charRanges[i][0], charRanges[i][1]));
}