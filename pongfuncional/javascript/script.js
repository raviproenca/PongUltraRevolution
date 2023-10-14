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

const playSomClique = () => {
    const somClique = document.getElementById("somClique");
    somClique.currentTime = 0;
    somClique.play();
}

const playSomRaquete = () => {
    const somRaquete = document.getElementById("somRaquete");
    somRaquete.currentTime = 0;
    somRaquete.play();
}
const gameData = {
    isRedPaddle: false,
};
const gameDatadireita = {
    isRedPaddledireito: false,
};
const gamedatapad = {
    touchedredpad: false,
};

const progressbardireita = document.querySelector('.progress-bardireita');
const handleKeyPressdireita = (event) => {
    const progressValue = parseInt(progressbardireita.getAttribute('data-progress'))
    if (event.key === 'o' && progressValue === 100) {
        progressbardireita.setAttribute('data-progress', '0'); 
        progressbardireita.style.width = '0%'; 
        progressbardireita.style.backgroundColor = '#4418e4'; 
        rightPaddle.color = 'red'
        gameDatadireita.isRedPaddledireito = true;
        scores.color = "red"
    }
};

const progressbar = document.querySelector('.progress-baresquerda');

const handleKeyPress = (event) => {
    const progressValue = parseInt(progressbar.getAttribute('data-progress'))
    if (event.key === 'x' && progressValue === 100) {
        progressbar.setAttribute('data-progress', '0'); 
        progressbar.style.width = '0%'; 
        progressbar.style.backgroundColor = '#4418e4'; 
        leftPaddle.color = 'red'
        gameData.isRedPaddle = true;
        scores.color = "red"
    }
};

document.addEventListener('keydown', handleKeyPress);
document.addEventListener('keydown', handleKeyPressdireita);

const uploadesquerda = () => {
    const progressValue = parseInt(progressbar.getAttribute('data-progress')) || 0; 
    const newProgressValue = progressValue + 20; 
    if (newProgressValue <= 100) {
        progressbar.style.width = `${newProgressValue}%`;
        progressbar.setAttribute('data-progress', newProgressValue.toString());
    } 
};
const uploaddireita = () => {
    const progressValue = parseInt(progressbardireita.getAttribute('data-progress')) || 0; 
    const newProgressValue = progressValue + 20; 
    if (newProgressValue <= 100) {
        progressbardireita.style.width = `${newProgressValue}%`;
        progressbardireita.setAttribute('data-progress', newProgressValue.toString());
    } 
};
const trailLength = 5;
const trail = [];

const drawBall = () => {
  trail.push({ x: ball.x, y: ball.y });

  if (trail.length > trailLength) {
    trail.shift();
  }

  // Limpe o canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const drawTrail = (point, index) => {
    const alpha = 1 - (index / trail.length);
    
    ctx.beginPath();
    ctx.arc(point.x, point.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
  };

  if (gamedatapad.touchedredpad) {
    trail.forEach(drawTrail);
    ctx.globalAlpha = 1;
  }

  // Desenhe a bola
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
};

const drawPaddles = () => {
    ctx.fillStyle = leftPaddle.color;
    ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    
    ctx.fillStyle = rightPaddle.color;
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

const limiteDePontos = 10

const reiniciarJogoBtn = document.getElementById('reiniciarJogo');

reiniciarJogoBtn.addEventListener('click', () => {
    restartGame();
    playSomClique();
});

const voltarTelaInicialBtn = document.getElementById('voltarTelaInicial');

voltarTelaInicialBtn.addEventListener('click', () => {
    document.getElementById('jogo').style.display = 'none';
    document.getElementById('telainicial').style.display = 'block';
    resetGame();
    playSomClique();
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

    if (
        ball.x - ball.radius < leftPaddle.x + leftPaddle.width &&
        ball.x + ball.radius > leftPaddle.x &&
        ball.y > leftPaddle.y &&
        ball.y < leftPaddle.y + leftPaddle.height
    ) {
        const relativePosition = (ball.y - leftPaddle.y) / leftPaddle.height;
       
        if (relativePosition < 0.30 || relativePosition > 0.70) {
            ball.speedX = 5; // Velocidade normal no canto superior e inferior
        } else if (gameData.isRedPaddle) {
            ball.speedX = 30; // Velocidade aumentada quando a raquete é vermelha
            ball.color = "red"
            gamedatapad.touchedredpad = true;
        } else {
            ball.speedX = 10;
            uploadesquerda();
        }
        
        playSomRaquete();
    }
        

    if (
        ball.x + ball.radius > rightPaddle.x &&
        ball.x - ball.radius < rightPaddle.x + rightPaddle.width &&
        ball.y > rightPaddle.y &&
        ball.y < rightPaddle.y + rightPaddle.height
    ) {
        const relativePosition = (ball.y - rightPaddle.y) / rightPaddle.height;

        if (relativePosition < 0.30 || relativePosition > 0.70) {
            ball.speedX = -5; // Velocidade normal no canto superior e inferior
        } else if (gameDatadireita.isRedPaddledireito) {
            ball.speedX = -30; // Velocidade aumentada quando a raquete é vermelha
            ball.color = "red"
            gamedatapad.touchedredpad = true;
        } else {
            ball.speedX = -10;
            uploaddireita();
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
const resetRedPaddle = () => {
    leftPaddle.color = "white";
    gameData.isRedPaddle = false;
    gamedatapad.touchedredpad = false;
    scores.color = "white"
    ball.color = "white"
};
const resetRedPaddledireito = () => {
    rightPaddle.color = "white";
    gameDatadireita.isRedPaddledireito = false;
    gamedatapad.touchedredpad = false;
    scores.color = "white"
    ball.color = "white"
};


const resetBall = () => {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedY = 5;

    if (scores.left > scores.right) {
        ball.speedX = -5;
        if (gameData.isRedPaddle) {
            resetRedPaddle();
        } else {
            resetRedPaddledireito();
        }
    } else if (scores.left < scores.right) {
        ball.speedX = 5;
        if (gameData.isRedPaddle) {
            resetRedPaddle();
        } else {
            resetRedPaddledireito();
        }
    } else {
    
    }
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
    playSomClique()
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
        playSomClique()
});
    closeModal.addEventListener('click', () => {
         modal.style.display = 'none';
});
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
    }
});

const botaoPause = document.getElementById('button3');
const modal2 = document.getElementById('pausegame');
const closeModal2 = document.getElementById('close-pause');
    botaoPause.addEventListener('click', () => {
        modal2.style.display = 'block';
        playSomClique()
});
    reiniciarJogoBtn.addEventListener('click', () => {
        restartGame();
        playSomClique();
});
    closeModal2.addEventListener('click', () => {
        modal2.style.display = 'none';
});
    window.addEventListener('click', (event) => {
        if (event.target === modal2) {
        modal2.style.display = 'none';
    }

});

const restartGame2 = () => {
    resetGame();
    jogo.classList.remove('fade-in');
    setTimeout(() => {
        gameLoop();
    }, 10);
};

const pauseGameBox = () => {
    document.getElementById('pausegame');
    pauseGameBox.classList.add('modal2');
}

const reiniciarJogoBtn2 = document.getElementById('reiniciarJogo2');
reiniciarJogoBtn2.addEventListener('click', () => {
    restartGame();
    playSomClique();
});

const voltarTelaInicialBtn2 = document.getElementById('voltarTelaInicial2');
voltarTelaInicialBtn.addEventListener('click', () => {
    document.getElementById('jogo').style.display = 'none';
    document.getElementById('telainicial').style.display = 'block';
    resetGame();
    playSomClique();
    const pauseGameBox = document.getElementById('pausegame');
    pauseGameBox.classList.add('modal2');
});
