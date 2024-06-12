const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const $sprite = document.querySelector('#sprite');
const $bricks = document.querySelector('#bricks');

canvas.width = 448;
canvas.height = 400;


//                          VARIABLES PELOTA
const ballRadius = 3;

// posicion de la pelota
let x = canvas.width / 2;
let y = canvas.height - 30;

// velocidad de la pelota
let dx = -2;
let dy = -2;


//                         VARIABLES PALETA
const paddleHeight = 13;
const paddleWidth = 111;

let paddleX = (canvas.width - paddleWidth) / 2;
let paddleY = canvas.height - paddleHeight - 5;

let rightPressed = false;
let leftPressed = false;

const PADDLE_SENSITIVITY = 6;


//                            VARIABLES LADRILLOS
const brickRowCount = 6;
const brickColumnCount = 13;
const brickWidth = 32;
const brickHeight = 18;
const brickPadding = 2;
const brickOffSetTop = 40;
const brickOffSetLeft = 4;
const bricks = [];
const BRICK_STATUS = {
    ACTIVE: 1,
    DESTROYED: 0,
}

for (let c = 0;c < brickColumnCount; c++){
    bricks[c] = [] // inicializamos con un array vacio
    for (let r = 0;r < brickRowCount; r++){ //calculamos la posicion del ladrillo
        const brickX = c * (brickWidth + brickPadding) + brickOffSetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffSetTop;
        const random = Math.floor(Math.random() * 8) + 1;
        bricks[c][r] = {
            x:brickX, 
            y:brickY, 
            status: BRICK_STATUS.ACTIVE, 
            color: random}
    }
}




function drawBall(){
    ctx.beginPath(); //inicia el trazado
    ctx.arc(x,y,ballRadius,0,Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill()
    ctx.closePath(); //termina el trazado
};

function drawPaddle(){

    ctx.drawImage(
        $sprite, //imagen
        120,  //coordenada x
        118,  // coordenada y
        paddleWidth, // tamaño del recorte
        paddleHeight, //tamaño del recorte
        paddleX, //posicion x del dibujo
        paddleY, //posicion y del dibujo
        paddleWidth, //ancho del dibujo
        paddleHeight, //alto del dibujo
    )
};

function drawBricks(){
    for (let c = 0;c < brickColumnCount; c++){
    for (let r = 0;r < brickRowCount; r++){
        const currentBrick = bricks[c][r];
        if(currentBrick.status === BRICK_STATUS.DESTROYED)
        continue;
        
        const clipX = currentBrick.color * 50

        ctx.drawImage(
            $bricks,
            clipX,
            10,
            180,
            120,
            currentBrick.x,
            currentBrick.y,
            brickWidth,
            brickHeight
        )
        }
    }
}

function collisionDetection(){
    for (let c = 0;c < brickColumnCount; c++){
        for (let r = 0;r < brickRowCount; r++){
            const currentBrick = bricks[c][r];
            if(currentBrick.status === BRICK_STATUS.DESTROYED) continue;
            const isBallSameXAsBrick = x > currentBrick.x && x < currentBrick.x + brickWidth;
            const isBallSameYAsBrick = y > currentBrick.y && y < currentBrick.y + brickHeight;
            if(isBallSameXAsBrick && isBallSameYAsBrick){
                dy = -dy
                currentBrick.status = BRICK_STATUS.DESTROYED
            }
        }
    }
};

function ballMovement(){
    // rebotar las pelotas en los laterales
    if (
        x + dx > canvas.width - ballRadius || //pared derecha
        x + dx < ballRadius //pared izquierda
    ){
        dx = -dx;
    }


    // rebotar en la parte de arriba
    if (y + dy < ballRadius){
        dy = -dy;
    }


    // si la pelota toca la pala
    const isBallSameXAsPaddle = x > paddleX && x < paddleX + paddleWidth;
    const isBallTouchingPaddle = y + dy > paddleY;

    if(isBallSameXAsPaddle && isBallTouchingPaddle){
        dy = -dy //cambiamos la direccion de la pelota
    } else if(y + dy > canvas.height - ballRadius ){ //si toca el suelo
        console.log('GAME OVER');
        document.location.reload();
    }


    x += dx;
    y += dy;
};

function paddleMovement(){
    if(rightPressed && paddleX < canvas.width - paddleWidth){
        paddleX += PADDLE_SENSITIVITY;
    } else if (leftPressed && paddleX > 0){
        paddleX -= PADDLE_SENSITIVITY;
    }
};

function cleanCanvas(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
};

function initEvents(){
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);

    function keyDownHandler(event){
        const { key } = event;
        if(key === 'Right' || key === 'ArrowRight'){
            rightPressed = true;
        } else if (key === 'Left' || key === 'ArrowLeft'){
            leftPressed = true;
        }
    }

    function keyUpHandler(event){
        const { key } = event;
        if(key === 'Right' || key === 'ArrowRight'){
            rightPressed = false;
        } else if (key === 'Left' || key === 'ArrowLeft'){
            leftPressed = false;
        }
    }
}




function draw (){
    cleanCanvas()
    // hay que dibujar los elementos
    drawBall();
    drawPaddle();
    drawBricks();
    // drawScore();

    // colisiones y movimientos
    collisionDetection();
    ballMovement();
    paddleMovement();

    window.requestAnimationFrame(draw);
}

draw();
initEvents();
