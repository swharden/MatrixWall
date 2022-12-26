/* The Matrix Wall
 *
 * Original Author: 
 *   Erdoğan Bavaş
 *   http://erdoganb.com/
 *   https://github.com/erdoganbavas/web-practices/tree/master/matrix
 *   https://www.youtube.com/watch?v=1d7TzlsOHsI
 *   https://erdoganbavas.medium.com/creating-matrix-wall-with-html-css-and-javascript-dc4ea5e23fe7
 * 
 * Modified by:
 *   Scott Harden
 *   https://swharden.com/
 *   https://github.com/swharden/MatrixWall
 */

// set default values for items not defined in matrix settings object
if (typeof matrixSettings == "undefined") matrixSettings = {};
matrixSettings.background = matrixSettings.background ?? "#24292f";
matrixSettings.foreground = matrixSettings.foreground ?? "#39b34d";
matrixSettings.highlight = matrixSettings.highlight ?? "#c3ebc9";
matrixSettings.characterSize = matrixSettings.characterSize ?? 28;
matrixSettings.target = matrixSettings.target ?? document.body;
console.log({ matrixSettings });

styleTargetElement();
createLetters();

function getRowCount() {
    let height = matrixSettings.target == document.body
        ? window.innerHeight
        : matrixSettings.target.getBoundingClientRect().height;
    return Math.floor(height / matrixSettings.characterSize) + 1;
}

function getColumnCount() {
    const width = matrixSettings.target == document.body
        ? window.innerWidth
        : matrixSettings.target.getBoundingClientRect().width;
    return Math.floor(width / matrixSettings.characterSize);
}

function createLetters() {
    for (let i = 0; i < getColumnCount(); i++) {
        const p = document.createElement('p');
        p.style.lineHeight = 1;
        p.style.widows = "30px";
        setupColumn(p);
        matrixSettings.target.prepend(p);
    }
}

function styleTargetElement() {
    matrixSettings.target.style.display = "flex";
    matrixSettings.target.style.overflow = "hidden";
    matrixSettings.target.style.setProperty("background-color", matrixSettings.background, "important");
    matrixSettings.target.style.setProperty("color", matrixSettings.foreground, "important");
    matrixSettings.target.style.padding = "0px";
    matrixSettings.target.style.margin = "0px";
    if (matrixSettings.target == document.body) {
        document.body.style.height = "100%";
        document.body.style.height = "100%";
    }
}

function createColumnElement() {
    const el = document.createElement('span');
    el.style.display = "block";
    el.style.fontSize = matrixSettings.characterSize + "px";
    el.style.textAlign = "center";
    el.style.width = matrixSettings.characterSize + "px";
    el.style.height = matrixSettings.characterSize + "px";
    el.style.opacity = 0;
    el.style.fontFamily = "Consolas, Helvetica, sans-serif";
    return el;
}

function setupColumn(p) {

    const columnResetDelay = random(100, 500);
    const tailLength = random(500, 2000);
    const fallDelay = random(30, 200);
    const rowCount = getRowCount();
    const isFirstTimeFalling = p.children.length == 0;
    const firstTimeDelay = isFirstTimeFalling ? fallDelay * 10 : 0; // helps randomize initial state

    for (let j = 0; j < rowCount; j++) {
        const span = isFirstTimeFalling
            ? createColumnElement()
            : p.children.item(j);

        span.innerText = getRandomChar();
        const animation = span.animate(
            [
                { opacity: '0', color: matrixSettings.highlight, offset: 0 }, // start transparent
                { opacity: '1', color: matrixSettings.highlight, offset: .05 }, // fade-in using the highlight color
                { opacity: '1', color: matrixSettings.foreground, offset: .2 }, // fade to standard color
                { opacity: '0.03', color: matrixSettings.foreground, offset: 1 }, // take extra time on that last bit
            ],
            {
                duration: tailLength,
                delay: columnResetDelay + (j * fallDelay) + firstTimeDelay,
                fill: 'forwards'
            }
        );

        const isBottomRow = j === rowCount - 1;
        if (isBottomRow) {
            animation.onfinish = () => {
                setupColumn(p);
            };
        }

        if (isFirstTimeFalling) {
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
        [0x0030, 0x0031], // 0s and 1s (extra weight)
        [0x0030, 0x0031], // 0s and 1s (extra weight)

        [0x0030, 0x0039], // English numbers
        [0x0041, 0x005A], // English uppercase letters
        [0x00bc, 0x02af] // Latin characters
    ];
    const i = random(0, charRanges.length - 1);
    return String.fromCharCode(random(charRanges[i][0], charRanges[i][1]));
}