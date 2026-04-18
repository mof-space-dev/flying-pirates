let angle = 0;
let swingAmplitude = 70; 
let charGrid = [];
let unitSize = 6; 
let logoScaleMin = 0.5; 
let logoDepth = 250;    

const charData = [
  [[1,1,1,1,1],[1,0,0,0,0],[1,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0]], // F
  [[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,1]], // L
  [[1,0,0,0,1],[0,1,0,1,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]], // Y
  [[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[1,1,1,1,1]], // I
  [[1,0,0,0,1],[1,1,0,0,1],[1,0,1,0,1],[1,0,0,1,1],[1,0,0,0,1]], // N
  [[0,1,1,1,1],[1,0,0,0,0],[1,1,1,1,1],[1,0,0,0,1],[0,1,1,1,0]], // G
  [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]], // Space
  [[1,1,1,1,0],[1,0,0,0,1],[1,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0]], // P
  [[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[1,1,1,1,1]], // I
  [[1,1,1,1,0],[1,0,0,0,1],[1,1,1,1,0],[1,0,1,0,0],[1,0,0,1,0]], // R
  [[0,0,1,0,0],[0,1,0,1,0],[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1]], // A
  [[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]], // T
  [[1,1,1,1,1],[1,0,0,0,0],[1,1,1,1,0],[1,0,0,0,0],[1,1,1,1,1]], // E
  [[0,1,1,1,1],[1,0,0,0,0],[0,1,1,1,0],[0,0,0,0,1],[1,1,1,1,0]], // S
];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  
  // --- 修正：タイトル文字だけを「ボヤけた赤」に ---
  let title = createDiv('FLYING-PIRATES');
  title.style('position', 'absolute');
  title.style('top', '30px');
  title.style('right', '30px');
  title.style('color', 'rgba(180, 20, 20, 0.9)'); // 基本の文字色は暗めの赤
  title.style('font-family', '"Courier New", Courier, monospace'); // 少しレトロな等幅フォント
  title.style('font-size', '20px');
  title.style('font-weight', 'bold');
  title.style('letter-spacing', '2px');
  // 影を重ねてボカす
  title.style('text-shadow', '0 0 8px rgba(255, 0, 0, 0.8), 0 0 15px rgba(255, 50, 50, 0.5)'); 
  title.style('pointer-events', 'none'); 

  for (let i = 0; i < charData.length; i++) {
    let units = [];
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (charData[i][r][c] === 1) units.push({ x: c * 16, y: r * 16 });
      }
    }
    charGrid.push(units);
  }
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); }

function draw() {
  // 背景は闇に戻す
  background(230, 40, 5); 
  
  orbitControl(); 
  let sceneScale = min(width, height) / 1200;
  scale(sceneScale);
  
  push();
  translate(0, -350, -300); 
  rotateX(-0.35); 
  drawMegaStructure();
  drawPerspectiveLogo();
  drawPowerDoubleShips();
  drawMadDreadSkull(); 
  pop();

  drawGrain(1200); 
  angle += 0.018; 
}

function drawGrain(density) {
  push();
  resetMatrix();
  translate(-width / 2, -height / 2); 
  for (let i = 0; i < density; i++) {
    let x = random(width);
    let y = random(height);
    fill(0, 0, random(10, 25), random(5, 12)); 
    rect(x, y, random(1, 2), random(1, 2));
  }
  pop();
}

function drawMadDreadSkull() {
  push();
  let flicker = noise(frameCount * 2.5); 
  let skullAlpha = flicker > 0.35 ? map(flicker, 0.35, 1.0, 40, 95) : random(0, 15); 
  let neonDullBlue = color(230, 60, 90, skullAlpha);
  let neonEvilOrange = color(20, 100, 100, 100); 
  let sSize = 130; 

  for (let a = PI + 0.2; a < TWO_PI - 0.2; a += 0.08) {
    let x = cos(a) * sSize;
    let y = (sin(a) * sSize * 0.7) - sSize * 0.8; 
    drawUnitBlock(x, y, 0, 12, 12, 2, neonDullBlue);
  }
  
  for (let y = -sSize * 0.8; y <= 0; y += 15) {
    let xLimit = map(y, -sSize * 0.8, 0, sSize, sSize * 0.4);
    drawUnitBlock(-xLimit, y, 0, 10, 10, 2, neonDullBlue);
    drawUnitBlock(xLimit, y, 0, 10, 10, 2, neonDullBlue);
    if (y > -15) {
      for (let tx = -xLimit; tx <= xLimit; tx += 20) {
        drawUnitBlock(tx, 0, 0, 10, 14, 2, neonDullBlue);
      }
    }
  }

  for (let side = -1; side <= 1; side += 2) {
    push();
    translate(side * sSize * 0.42, -sSize * 0.78, 20); 
    for(let i=0; i<4; i++) {
      drawUnitBlock(i * 11 * side, -i * 7, 0, 15, 15, 15, neonEvilOrange);
    }
    drawUnitBlock(0, 0, 5, 20, 20, 20, color(20, 100, 100, 100));
    pop();
  }
  pop();
}

function drawPerspectiveLogo() {
  push();
  translate(0, 550, 140); 
  let spacingX = 120; 
  let totalWidth = (charData.length - 1) * spacingX;
  let centerIdx = (charData.length - 1) / 2;
  let activeIdx = floor((frameCount * 0.2) % charData.length);
  for (let i = 0; i < charGrid.length; i++) {
    let distFromCenter = abs(i - centerIdx);
    let scaleVal = map(distFromCenter, 0, centerIdx, logoScaleMin, 1.2); 
    let depthVal = map(distFromCenter, 0, centerIdx, logoDepth, 0);
    push();
    let posX = (i * spacingX) - totalWidth / 2;
    translate(posX, 0, -depthVal);
    scale(scaleVal);
    let isRed = (i === activeIdx);
    let c = isRed ? color(0, 100, 100, 100) : color(0, 0, 40, 25);
    for (let unit of charGrid[i]) {
      drawUnitBlock(unit.x - 35, unit.y - 35, 0, 14, 14, 14, c);
    }
    pop();
  }
  pop();
}

function drawMegaStructure() {
  let h = 1400; let baseWidth = 4000;
  let neonC1 = color(205, 100, 100, 90); 
  let neonC2 = color(340, 100, 100, 90); 
  drawUnitColumn(0, h/2, 0, unitSize * 4, h, neonC1, neonC2);
  let sideLen = sqrt(sq(h) + sq(baseWidth/2));
  let sideAngle = atan2(baseWidth/2, h);
  push();
  translate(-baseWidth/4, h/2, 0); rotateZ(sideAngle);
  drawUnitColumn(0, 0, 0, unitSize * 3, sideLen, neonC1, neonC1);
  pop();
  push();
  translate(baseWidth/4, h/2, 0); rotateZ(-sideAngle);
  drawUnitColumn(0, 0, 0, unitSize * 3, sideLen, neonC2, neonC2);
  pop();
}

function drawPowerDoubleShips() {
  let shipW = 1000; let shipH = 150; let pivotY = 50;
  for (let i = 0; i < 2; i++) {
    push();
    translate(0, pivotY, (i === 0 ? 350 : -350)); 
    let shipAngle = sin(angle + (i * PI)) * swingAmplitude; 
    rotateZ(radians(shipAngle));
    translate(0, 1100, 0); 
    let sColor = (i === 0) ? color(0, 0, 98, 95) : color(0, 0, 45, 80);
    for (let x = -shipW/2; x < shipW/2; x += 40) {
      let bowHeight = map(abs(x), 0, shipW/2, 0, 180); 
      for (let y = 100; y > (-shipH - bowHeight); y -= 40) {
        drawUnitBlock(x, y, 0, 38, 38, 180, sColor);
      }
    }
    pop();
  }
}

function drawUnitColumn(x, y, z, w, h, c1, c2) {
  push(); translate(x, y, z);
  let steps = floor(h / (unitSize*2));
  for (let i = -w/2; i <= w/2; i += unitSize*2) {
    for (let j = -steps/2; j <= steps/2; j++) {
      let yc = j * unitSize * 2;
      let interColor = lerpColor(c1, c2, map(yc, -h/2, h/2, 0, 1));
      if(random() > 0.05) drawUnitBlock(i, yc, 0, unitSize, unitSize, unitSize, interColor);
    }
  }
  pop();
}

function drawUnitBlock(x, y, z, w, h, d, c) {
  push(); translate(x, y, z); fill(c); box(w, h, d); pop();
}
