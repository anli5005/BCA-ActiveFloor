function drawPoint (id, xPos, yPos) {
    context2D.fillStyle = zones[id].color;
    context2D.beginPath();
    context2D.arc(xPos, yPos, 8, 0, Math.PI * 2);
    context2D.closePath();
    context2D.fill();
}

function drawZones() {
    for (let i = 0; i < zones.length; i++) {
        if (zones[i].type === "line") {
            drawLine(i);
        }
        else if (zones[i].type === "tri") {
            drawTri(i);
        }
        else if (zones[i].type === "quad") {
            drawQuad(i);
        }
    }
    drawApproach();
}

function transition(id) {
    for (let i = 0; i < zones[id].current.length; i++) {
        for (let j = 0; j < 2; j++) {
            zones[id].current[i][j] = interpolationArray[zones[id].transition](
                zones[id].original[i][j],
                zones[id].destination[i][j],
                (time - zones[id].transStart) / transTime);
        }
  }
}

function drawLine(id) {
    drawPoint(id, ...zones[id].current[0]);
    drawPoint(id, ...zones[id].current[1]);

    context2D.beginPath();
    context2D.moveTo(...zones[id].current[0]);
    context2D.lineTo(...zones[id].current[1]);
    context2D.closePath();
    context2D.strokeStyle = zones[id].color;
    context2D.lineCap = "round";
    context2D.lineWidth = (zones[id].activated) ? 16 : 2;
    context2D.stroke();
}

function drawTri(id) {
    drawPoint(id, ...zones[id].current[0]);
    drawPoint(id, ...zones[id].current[1]);
    drawPoint(id, ...zones[id].current[2]);

    context2D.beginPath();
    context2D.moveTo(...zones[id].current[0]);
    context2D.lineTo(...zones[id].current[1]);
    context2D.lineTo(...zones[id].current[2]);
    context2D.lineTo(...zones[id].current[0]);
    context2D.closePath();
    context2D.strokeStyle = zones[id].color;
    context2D.lineJoin = "round";
    context2D.lineWidth = (zones[id].activated) ? 16 : 2;
    context2D.stroke();
    if (zones[id].activated)
        context2D.fill();
}

function drawQuad(id) {
    drawPoint(id, ...zones[id].current[0]);
    drawPoint(id, ...zones[id].current[1]);
    drawPoint(id, ...zones[id].current[2]);
    drawPoint(id, ...zones[id].current[3]);

    context2D.beginPath();
    context2D.moveTo(...zones[id].current[0]);
    context2D.lineTo(...zones[id].current[1]);
    context2D.lineTo(...zones[id].current[2]);
    context2D.lineTo(...zones[id].current[3]);
    context2D.lineTo(...zones[id].current[0]);
    context2D.closePath();
    context2D.strokeStyle = zones[id].color;
    context2D.lineJoin = "round";
    context2D.lineWidth = (zones[id].activated) ? 16 : 2;
    context2D.stroke();
    if (zones[id].activated)
        context2D.fill();
}

function drawApproach() {
    for (let i = 0; i < zones.length; i++) {
        if (!zones[i].activated) {
            for (let j = 0; j < zones[i].current.length; j++) {
                context2D.beginPath();
                context2D.arc(zones[i].current[j][0], zones[i].current[j][1],
                    lerp(32, 8, Math.min((time - zones[i].lastSpawned) / (lifespan -  1), 1)),
                    0, Math.PI * 2);
                context2D.closePath();
                context2D.lineWidth = 4;
                context2D.strokeStyle = zones[i].color;
                context2D.stroke();
            }
        }
    }
}

function drawScore () {
    context2D.font = "12px Arial";
    context2D.fillStyle = "white";
    context2D.textAlign = "left";
    context2D.textBaseline = "top";
    context2D.fillText("Score: " + score, 5, 5);
}

function drawMode () {
    context2D.font = "12px Arial";
    context2D.fillStyle = "white";
    context2D.textAlign = "right";
    context2D.textBaseline = "top";
    context2D.fillText("Mode: " + mode, 192 - 5, 5);
}

function createButton(name, text, font, textColor, borderColor, xPos, yPos, width, height) {
    buttons[name] = {
        text: text,
        font: font,
        textColor: textColor,
        borderColor: borderColor,
        xPos: xPos,
        yPos: yPos,
        width: width,
        height: height
    };

    // Form Rectangle
    context2D.beginPath();
    context2D.lineWidth = "4";
    context2D.strokeStyle = borderColor;
    context2D.rect(xPos - width / 2, yPos - height / 2, width, height);
    context2D.stroke();

    context2D.font = font;
    context2D.fillStyle = textColor;
    context2D.textAlign = "center";
    context2D.textBaseline = "middle";
    context2D.fillText(text, xPos, yPos);
}

function drawMainMenu () {
    context2D.font = "32px Arial";
    context2D.fillStyle = "white";
    context2D.textAlign = "center";
    context2D.textBaseline = "middle";
    context2D.fillText("DangerZone", canvas.width / 2, canvas.height / 2);

    createButton("line", "Line", "18px Arial", "white", "white",
        canvas.width / 6, canvas.height / 6, canvas.width / 3, canvas.height / 3);
    createButton("tri", "Tri", "18px Arial", "white", "white",
        5 * canvas.width / 6, canvas.height / 6, canvas.width / 3, canvas.height / 3);
    createButton("quad", "Quad", "18px Arial", "white", "white",
        canvas.width / 6, 5 * canvas.height / 6, canvas.width / 3, canvas.height / 3);
    createButton("random", "Random", "14px Arial", "white", "white",
        5 * canvas.width / 6, 5 * canvas.height / 6, canvas.width / 3, canvas.height / 3);
}

function drawOverMenu() {
    context2D.font = "32px Arial";
    context2D.fillStyle = "white";
    context2D.textAlign = "center";
    context2D.textBaseline = "middle";
    context2D.fillText("Game Over!", canvas.width / 2, canvas.height / 6 + 20);

    context2D.font = "18px Arial";
    context2D.fillStyle = "white";
    context2D.textAlign = "center";
    context2D.textBaseline = "middle";
    context2D.fillText("Score: " + score, canvas.width / 2, 5 * canvas.height / 6 - 20);

    createButton("main", "Menu", "24px Arial", "white", "white",
        canvas.width / 2, canvas.height / 2,  canvas.width / 2, canvas.height / 6);
}