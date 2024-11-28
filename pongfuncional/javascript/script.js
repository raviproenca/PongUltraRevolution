//Referência do elemento HTML com o ID "pong"
const canvas = document.getElementById("pong");

// Pega o contexto 2D do elemento 'canvas' para criar formas
const ctx = canvas.getContext("2d");

//Dá as características a um objeto 'ball' que representa uma bola no jogo
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  speedX: 3,
  speedY: 3,
  color: "white",
};

// Define as raquetes e suas características
const leftPaddle = {
  x: 0,
  y: canvas.height / 2 - 50,
  width: 10,
  height: 100,
  speed: 5,
  color: "white",
};

const rightPaddle = {
  x: canvas.width - 10,
  y: canvas.height / 2 - 50,
  width: 10,
  height: 100,
  speed: 5,
  color: "white",
};

// Placar
const scores = {
  left: 0,
  right: 0,
};

// Animação da exibição dos pontos dos players
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

const isGamePausedState = false;
const gameState = {
  isGamePaused: false,
};

//Caixa de end game com mensagem personalizada
const exibirCaixaFimDeJogo = (mensagem) => {
  const gameOverBox = document.getElementById("gameOverBox");
  const gameOverMessage = document.getElementById("gameOverMessage");
  gameOverMessage.textContent = mensagem;
  gameOverBox.classList.remove("hidden");
};

//Função pra funcionar o som do clique em botões
const playSomClique = () => {
  const somClique = document.getElementById("somClique");
  somClique.currentTime = 0;
  somClique.play();
};

//Função que faz o som da raquete funcionar
const playSomRaquete = () => {
  const somRaquete = document.getElementById("somRaquete");
  somRaquete.currentTime = 0;
  somRaquete.play();
};

//Função que faz o som da pontuação
const playSomPonto = () => {
  const somPonto = document.getElementById("somPonto");
  somPonto.currentTime = 0;
  somPonto.play();
};

//Função pra o som da barra completamente cheia
const playSomBarra = () => {
  const somBarra = document.getElementById("somBarra");
  somBarra.currentTime = 0;
  somBarra.play();
};

//Função que faz o som da vitória de um dos players funcionar
const playSomVitoria = () => {
  const somVitoria = document.getElementById("somVitoria");
  somVitoria.currentTime = 0;
  somVitoria.play();
};

//Guarda a informação sobre a habilidade estar ativa em uma das raquetes ou se a bola entrou em contato com alguma
const gameData = {
  isRedPaddle: false,
};
const gameDatadireita = {
  isRedPaddledireito: false,
};
const gamedatapad = {
  touchedredpad: false,
};

//Funcionalidade do enchimento da barra de habilidade das raquetes e também seu estilo
const progressbardireita = document.querySelector(".progress-bardireita");
const handleKeyPressdireita = (event) => {
  const progressValue = parseInt(
    progressbardireita.getAttribute("data-progress")
  );
  if (event.key === "o" && progressValue === 100) {
    progressbardireita.setAttribute("data-progress", "0");
    progressbardireita.style.width = "0%";
    progressbardireita.style.backgroundColor = "#4418e4";
    rightPaddle.color = "red";
    gameDatadireita.isRedPaddledireito = true;
    scores.color = "red";
  }
};

const progressbar = document.querySelector(".progress-baresquerda");

// Verifica o progresso da barra de habilidade e a partir disso o funcionamento dos botôes X e O
const handleKeyPress = (event) => {
  const progressValue = parseInt(progressbar.getAttribute("data-progress"));
  if (event.key === "x" && progressValue === 100) {
    progressbar.setAttribute("data-progress", "0");
    progressbar.style.width = "0%";
    progressbar.style.backgroundColor = "#4418e4";
    leftPaddle.color = "red";
    gameData.isRedPaddle = true;
    scores.color = "red";
  }
};

document.addEventListener("keydown", handleKeyPress);
document.addEventListener("keydown", handleKeyPressdireita);

//Faz com que as barras de habilidade encham 20% até atingir o valor máximo de 100%
const uploadesquerda = () => {
  const progressValue =
    parseInt(progressbar.getAttribute("data-progress")) || 0;
  const newProgressValue = progressValue + 20;
  if (newProgressValue <= 100) {
    progressbar.style.width = `${newProgressValue}%`;
    progressbar.setAttribute("data-progress", newProgressValue.toString());
  }
};
const uploaddireita = () => {
  const progressValue =
    parseInt(progressbardireita.getAttribute("data-progress")) || 0;
  const newProgressValue = progressValue + 20;
  if (newProgressValue <= 100) {
    progressbardireita.style.width = `${newProgressValue}%`;
    progressbardireita.setAttribute(
      "data-progress",
      newProgressValue.toString()
    );
  }
};

// Comprimento da barra em relação a possibilidade de porcentagem para encher
const trailLength = 5;
const trail = [];

//Desenho da bola
const drawBall = () => {
  trail.push({ x: ball.x, y: ball.y });

  if (trail.length > trailLength) {
    trail.shift();
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //Desenha o rastro da bola após ser usada a habilidade
  const drawTrail = (point, index) => {
    const alpha = 1 - index / trail.length;

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

  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
};

//Desenho das raquetes
const drawPaddles = () => {
  ctx.fillStyle = leftPaddle.color;
  ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);

  ctx.fillStyle = rightPaddle.color;
  ctx.fillRect(
    rightPaddle.x,
    rightPaddle.y,
    rightPaddle.width,
    rightPaddle.height
  );
};

//Funcionamento das teclas de movimento
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

//Movimento da raquetae a ter a tecla pressionada, eixo Y
const movePaddles = () => {
  if (gameState.isGamePaused) {
    return;
  }
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

//Função pra reiniciar o jogo
const restartGame = () => {
  resetGame();
  gameState.isGamePaused = false;
  jogo.classList.remove("fade-in");
  setTimeout(() => {
    gameLoop();
  }, 10);
};

// Definição do estado inicial ao qual a partida vai retornar após ser reiniciada
const resetGame = () => {
  // Reset dos scores
  scores.left = 0;
  scores.right = 0;

  // Reset da bola
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.speedX = 3;
  ball.speedY = 3;

  // Reset das animações de ponto
  player1PointAnimation.active = false;
  player2PointAnimation.active = false;

  // Reset das raquetes
  resetRedPaddle();
  resetRedPaddledireito();

  // Reset das barras de progresso
  progressbar.setAttribute("data-progress", "0");
  progressbar.style.width = "0%";
  progressbar.style.backgroundColor = "#4418e4";

  progressbardireita.setAttribute("data-progress", "0");
  progressbardireita.style.width = "0%";
  progressbardireita.style.backgroundColor = "#4418e4";

  // Oculta a caixa de fim de jogo
  const gameOverBox = document.getElementById("gameOverBox");
  gameOverBox.classList.add("hidden");
};

//Limite da pontuação
const limiteDePontos = 10;

//Funcionamento de botão que reinicia a partida
const reiniciarJogoBtn = document.getElementById("reiniciarJogo");

reiniciarJogoBtn.addEventListener("click", () => {
  if (!gameState.isGamePaused) {
    restartGame();
    playSomClique();
    updateGame();
  }
});

//Botão para retornar a tela inicial após o fim da partida
const voltarTelaInicialBtn = document.getElementById("voltarTelaInicial");

voltarTelaInicialBtn.addEventListener("click", () => {
  document.getElementById("jogo").style.display = "none";
  document.getElementById("telainicial").style.display = "block";
  restartGame();
  playSomClique();
  const gameOverBox = document.getElementById("gameOverBox");
  gameOverBox.classList.add("hidden");
});

//Ajuste da nova velocidade da bola após o uso da habilidade
const updateBall = () => {
  ball.x += ball.speedX;
  ball.y += ball.speedY;

  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.speedY *= -1;
    playSomRaquete();
  }

  // Colisão com a raquete esquerda
  if (
    ball.x - ball.radius < leftPaddle.x + leftPaddle.width &&
    ball.x + ball.radius > leftPaddle.x &&
    ball.y > leftPaddle.y &&
    ball.y < leftPaddle.y + leftPaddle.height
  ) {
    if (gameData.isRedPaddle) {
      // Aumenta a velocidade independente da posição
      ball.speedX = 10;
      ball.color = "red";
      gamedatapad.touchedredpad = true;
    } else {
      const relativePosition = (ball.y - leftPaddle.y) / leftPaddle.height;
      if (relativePosition < 0.3 || relativePosition > 0.7) {
        ball.speedX = 3; // Velocidade normal no canto superior e inferior
      } else {
        uploadesquerda();
        ball.speedX = 6; // Velocidade intermediária no centro
      }
    }
    playSomRaquete();
  }

  // Colisão com a raquete direita
  if (
    ball.x + ball.radius > rightPaddle.x &&
    ball.x - ball.radius < rightPaddle.x + rightPaddle.width &&
    ball.y > rightPaddle.y &&
    ball.y < rightPaddle.y + rightPaddle.height
  ) {
    if (gameDatadireita.isRedPaddledireito) {
      // Aumenta a velocidade independente da posição
      ball.speedX = -10;
      ball.color = "red";
      gamedatapad.touchedredpad = true;
    } else {
      const relativePosition = (ball.y - rightPaddle.y) / rightPaddle.height;
      if (relativePosition < 0.3 || relativePosition > 0.7) {
        ball.speedX = -3; // Velocidade normal no canto superior e inferior
      } else {
        uploaddireita();
        ball.speedX = -6; // Velocidade intermediária no centro
      }
    }
    playSomRaquete();
  }

  //Após atingir o limite de pontos, aparece a notificação do player vencedor
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
};

//Desenha a animaão dos pontos na tela
const drawPointAnimation = () => {
  if (player1PointAnimation.active) {
    const currentTime = Date.now();
    if (
      currentTime - player1PointAnimation.startTime <
      player1PointAnimation.duration
    ) {
      ctx.fillStyle = player1PointAnimation.textColor;
      ctx.font = "20px Arial";
      ctx.fillText(
        player1PointAnimation.text,
        canvas.width / 2 - 150,
        canvas.height / 2
      );
    } else {
      player1PointAnimation.active = false;
    }
  }

  if (player2PointAnimation.active) {
    const currentTime = Date.now();
    if (
      currentTime - player2PointAnimation.startTime <
      player2PointAnimation.duration
    ) {
      ctx.fillStyle = player2PointAnimation.textColor;
      ctx.font = "20px Arial";
      ctx.fillText(
        player2PointAnimation.text,
        canvas.width / 2 - 150,
        canvas.height / 2
      );
    } else {
      player2PointAnimation.active = false;
    }
  }
};

// Animação para a pontuação de um dos players
const activatePointAnimation = (player) => {
  if (player === 1) {
    player1PointAnimation.active = true;
    player1PointAnimation.startTime = Date.now();
  } else if (player === 2) {
    player2PointAnimation.active = true;
    player2PointAnimation.startTime = Date.now();
  }
};

//Retorna as raquetes ao seu estado normal após o uso da habilidade
const resetRedPaddle = () => {
  leftPaddle.color = "white";
  gameData.isRedPaddle = false;
  gamedatapad.touchedredpad = false;
  scores.color = "white";
  ball.color = "white";
};
const resetRedPaddledireito = () => {
  rightPaddle.color = "white";
  gameDatadireita.isRedPaddledireito = false;
  gamedatapad.touchedredpad = false;
  scores.color = "white";
  ball.color = "white";
};

// Reajusta a posição e velocidade da bola após um ponto marcado
const resetBall = () => {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.speedY = 3;

  if (scores.left > scores.right) {
    ball.speedX = -3;
    if (gameData.isRedPaddle) {
      resetRedPaddle();
    } else {
      resetRedPaddledireito();
    }
  } else if (scores.left < scores.right) {
    ball.speedX = 3;
    if (gameData.isRedPaddle) {
      resetRedPaddle();
    } else {
      resetRedPaddledireito();
    }
  }
};

// Design do placar
const drawScore = () => {
  ctx.font = "30px Arial";
  ctx.fillText(scores.left, canvas.width / 4, 50);
  ctx.fillText(scores.right, (3 * canvas.width) / 4, 50);
};

const frameDuration = 16;

// Controla o ciclo de atualização e renderização do jogo
const gameLoop = (timestamp) => {
  if (!gameState.isGamePaused) {
    const deltaTime = timestamp - (gameLoop.lastTimestamp || timestamp);
    gameLoop.lastTimestamp = timestamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateBall();
    movePaddles();
    drawBall();
    drawPaddles();
    drawScore();
    drawPointAnimation();
    if (scores.left >= limiteDePontos || scores.right >= limiteDePontos) {
    } else {
      requestAnimationFrame(gameLoop);
    }
  }
};

//Definindo cada elemento
const pauseButton = document.getElementById("button3");
const pauseDialog = document.getElementById("pauseDialog");
const resumeButton = document.getElementById("resumeButton");
const goToMainMenuButton = document.getElementById("goToMainMenuButton");

//Verifica se o jogo está pausado e retorna o estado de pause
const isGamePaused = () => {
  return isGamePausedState;
};

//Alterna o estado de pause do jogo entre pausado e execução e chama a função "updateGame" pra atualização do jogo
const toggleGamePause = () => {
  gameState.isGamePaused = !gameState.isGamePaused;
  if (!gameState.isGamePaused) {
    updateGame();
  }
};

//Evento do potão pause
pauseButton.addEventListener("click", () => {
  pauseButtonHandler();
  playSomClique();
});

//Evento para continuar a execução do jogo
resumeButton.addEventListener("click", () => {
  if (gameState.isGamePaused) {
    playSomClique();
    pauseDialog.style.display = "none";
    gameState.isGamePaused = false;
    requestAnimationFrame(gameLoop);
  }
});

//Opção de retorno ao menu principal/tela inicial, "toggleGamePause" garante que o jogo continue pausado
goToMainMenuButton.addEventListener("click", () => {
  playSomClique();
  pauseDialog.style.display = "none";
  document.getElementById("jogo").style.display = "none";
  document.getElementById("telainicial").style.display = "block";
  toggleGamePause();
});

//Funcionamento do botão para que ele efetue a ação de pausar
const pauseButtonHandler = () => {
  playSomClique();
  gameState.isGamePaused = !gameState.isGamePaused;
  if (!gameState.isGamePaused) {
    pauseDialog.style.display = "none";
    requestAnimationFrame(gameLoop);
  } else {
    pauseDialog.style.display = "block";
  }
};

//Inicia o jogo e retira o estado de pause
const startGame = () => {
  gameState.isGamePaused = false;
  restartGame();
  playSomClique();
  document.getElementById("telainicial").style.display = "none";
  jogo.style.display = "block";
  setTimeout(() => {
    jogo.classList.add("fade-in");
  }, 10);
  updateGame();
};

// Botão jogar puxa a tela de jogo, saindo da tela inicial
const jogo = document.getElementById("jogo");
const botaoJogar = document.getElementById("button1");
botaoJogar.addEventListener("click", () => {
  document.getElementById("telainicial").style.display = "none";
  jogo.style.display = "block";
  playSomClique();
  setTimeout(() => {
    jogo.classList.add("fade-in");
  }, 10);
  startGame();
});

// Funcionamento do botão tutorial
const botaoTutorial = document.getElementById("button2");
const modal = document.getElementById("tutorial");
const closeModal = document.getElementById("close-tutorial");
botaoTutorial.addEventListener("click", () => {
  modal.style.display = "block";
  playSomClique();
});
closeModal.addEventListener("click", () => {
  playSomClique();
  modal.style.display = "none";
});
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    playSomClique();
    modal.style.display = "none";
  }
});
