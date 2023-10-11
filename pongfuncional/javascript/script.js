const canvas = document.getElementById("pong");

const ctx = canvas.getContext("2d");

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speedX: 5,
    speedY: 5,
};

const leftPaddle = {
    x: 0,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    speed: 5,
};

const rightPaddle = {
    x: canvas.width - 10,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    speed: 5,
};

const scores = {
    left: 0,
    right: 0,
};

const player1PointAnimation = {
    active: false,
    duration: 1000,
    startTime: 0,
    text: "PONTO PARA O JOGADOR 1",
    textColor: "red",
};

const player2PointAnimation = {
    active: false,
    duration: 1000,
    startTime: 0,
    text: "PONTO PARA O JOGADOR 2",
    textColor: "red",
};

const exibirCaixaFimDeJogo = (mensagem) => {
    const gameOverBox = document.getElementById('gameOverBox');
    const gameOverMessage = document.getElementById('gameOverMessage');
    gameOverMessage.textContent = mensagem;
    gameOverBox.classList.remove('hidden');
}

const playSomRaquete = () => {
    const somRaquete = document.getElementById("somRaquete");
    somRaquete.currentTime = 0;
    somRaquete.play();
}

const drawBall = () => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}

const drawPaddles = () => {
    ctx.fillStyle = "white";
    ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
}

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    w: false,
    s: false,
};

document.addEventListener("keydown", function (e) {
    if (e.key in keys) {
        keys[e.key] = true;
    }
});

document.addEventListener("keyup", function (e) {
    if (e.key in keys) {
        keys[e.key] = false;
    }
});

const movePaddles = () => {
    if (keys.ArrowUp && rightPaddle.y > 0) {
        rightPaddle.y -= rightPaddle.speed;
    }
    if (keys.ArrowDown && rightPaddle.y + rightPaddle.height < canvas.height) {
        rightPaddle.y += rightPaddle.speed;
    }
    
    if (keys.w && leftPaddle.y > 0) {
        leftPaddle.y -= leftPaddle.speed;
    }
    if (keys.s && leftPaddle.y + leftPaddle.height < canvas.height) {
        leftPaddle.y += leftPaddle.speed;
    }
};

const restartGame = () => {
    resetGame();
    jogo.classList.remove('fade-in');
    setTimeout(() => {
        gameLoop();
    }, 10);
};

const resetGame = () => {
    scores.left = 0;
    scores.right = 0;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = 5;
    ball.speedY = 5;
    player1PointAnimation.active = false;
    player2PointAnimation.active = false;

    const gameOverBox = document.getElementById('gameOverBox');
    gameOverBox.classList.add('hidden');
}

const limiteDePontos = 11

const reiniciarJogoBtn = document.getElementById('reiniciarJogo');

reiniciarJogoBtn.addEventListener('click', () => {
    restartGame();
});

const voltarTelaInicialBtn = document.getElementById('voltarTelaInicial');

voltarTelaInicialBtn.addEventListener('click', () => {
    document.getElementById('jogo').style.display = 'none';
    document.getElementById('telainicial').style.display = 'block';
    restartGame()
    const gameOverBox = document.getElementById('gameOverBox');
    gameOverBox.classList.add('hidden');
});

const updateBall = () => {
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.speedY *= -1;
        playSomRaquete();
    }

    if (ball.x - ball.radius < leftPaddle.x + leftPaddle.width && ball.y > leftPaddle.y && ball.y < leftPaddle.y + leftPaddle.height) {
        const relativePosition = (ball.y - leftPaddle.y) / leftPaddle.height;

        if (relativePosition < 0.30 || relativePosition > 0.70) {
            ball.speedX = 5;
        }
        else if (relativePosition >= 0.40 && relativePosition <= 0.60) {
            ball.speedX = 10;
        } 
        else if (relativePosition >= 0.45 && relativePosition <= 0.55) {
            ball.speedX = 20;
        }
        else if (relativePosition >= 0.47 && relativePosition <= 0.53) {
            ball.speedX = 40;
        }
        else {
            ball.speedX *= -1;
        }
        playSomRaquete();
    }

    if (ball.x + ball.radius > rightPaddle.x && ball.y > rightPaddle.y && ball.y < rightPaddle.y + rightPaddle.height) {
        const relativePosition = (ball.y - rightPaddle.y) / rightPaddle.height;

        if (relativePosition < 0.30 || relativePosition > 0.70) {
            ball.speedX = -5;
        }
        else if (relativePosition >= 0.40 && relativePosition <= 0.60) {
            ball.speedX = -10;
        } 
        else if (relativePosition >= 0.45 && relativePosition <= 0.55) {
            ball.speedX = -20;
        }
        else if (relativePosition >= 0.47 && relativePosition <= 0.53) {
            ball.speedX = -40;
        }
        else {
            ball.speedX *= -1;
        }
        playSomRaquete();
    }

    if (ball.x + ball.radius > canvas.width) {
        scores.left++;
        if (scores.left >= limiteDePontos) {
            const vencedor = "Jogador 1";
            const mensagem = `Parabéns, ${vencedor} venceu com ${scores.left} pontos!`;
            exibirCaixaFimDeJogo(mensagem);
        } else {
            resetBall();
            activatePointAnimation(1);
        }
    }

    if (ball.x - ball.radius < 0) {
        scores.right++;
        if (scores.right >= limiteDePontos) {
            const vencedor = "Jogador 2";
            const mensagem = `Parabéns, ${vencedor} venceu com ${scores.right} pontos!`;
            exibirCaixaFimDeJogo(mensagem);
        } else {
            resetBall();
            activatePointAnimation(2);
        }
    }
}

const drawPointAnimation = () => {
    if (player1PointAnimation.active) {
        const currentTime = Date.now();
        if (currentTime - player1PointAnimation.startTime < player1PointAnimation.duration) {
            ctx.fillStyle = player1PointAnimation.textColor;
            ctx.font = "20px Arial";
            ctx.fillText(player1PointAnimation.text, canvas.width / 2 - 150, canvas.height / 2);
        } else {
            player1PointAnimation.active = false;
        }
    }

    if (player2PointAnimation.active) {
        const currentTime = Date.now();
        if (currentTime - player2PointAnimation.startTime < player2PointAnimation.duration) {
            ctx.fillStyle = player2PointAnimation.textColor;
            ctx.font = "20px Arial";
            ctx.fillText(player2PointAnimation.text, canvas.width / 2 - 150, canvas.height / 2);
        } else {
            player2PointAnimation.active = false;
        }
    }
}

const activatePointAnimation = (player) => {
    if (player === 1) {
        player1PointAnimation.active = true;
        player1PointAnimation.startTime = Date.now();
    } else if (player === 2) {
        player2PointAnimation.active = true;
        player2PointAnimation.startTime = Date.now();
    }
}

const resetBall = () => {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = 5;
    ball.speedY = 5;
}

const drawScore = () => {
    ctx.font = "30px Arial";
    ctx.fillText(scores.left, canvas.width / 4, 50);
    ctx.fillText(scores.right, (3 * canvas.width) / 4, 50);
}

const gameLoop = () => {
    if (scores.left >= limiteDePontos || scores.right >= limiteDePontos) {return}
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddles();
    movePaddles();
    updateBall();
    drawScore();
    drawPointAnimation();
    requestAnimationFrame(gameLoop);
}

const jogo = document.getElementById('jogo');
const botaoJogar = document.getElementById('button1');
botaoJogar.addEventListener('click', () => {
    document.getElementById('telainicial').style.display = 'none';
    jogo.style.display = 'block';
    setTimeout(() => {
        jogo.classList.add('fade-in');
    }, 10); 
    gameLoop();
});

const botaoTutorial = document.getElementById('button2');
const modal = document.getElementById('tutorial');
const closeModal = document.getElementById('close-tutorial');
    botaoTutorial.addEventListener('click', () => {
        modal.style.display = 'block';
});
    closeModal.addEventListener('click', () => {
         modal.style.display = 'none';
});
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
    }
});
