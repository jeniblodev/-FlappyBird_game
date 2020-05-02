console.log('[DevSoutinho] Flappy Bird');
console.log('Inscreva-se no canal :D https://www.youtube.com/channel/UCzR2u5RWXWjUh7CwLSvbitA');

let frames = 0;
const somHit = new Audio();
somHit.src = './efeitos/hit.wav';

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

const planoDeFundo = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 246,
    x: 0,
    y: canvas.height - 204,
    desenha() {
        contexto.fillStyle = '#70c5ce';
        contexto.fillRect(0,0, canvas.width, canvas.height);
        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            planoDeFundo.x, planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        );

        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        );
    },
};

function criaChao() {
    const chao = {
        spriteX: 0,
        spriteY: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height - 112,
        atualiza() {
            const movimentoChao = 1;
            const repeteEm = chao.largura / 2;
            const movimentacao = chao.x - movimentoChao;
           
            chao.x = movimentacao % repeteEm;
        },
        desenha() {
            contexto.drawImage(
                sprites,
                chao.spriteX, chao.spriteY,
                chao.largura, chao.altura,
                chao.x, chao.y,
                chao.largura, chao.altura,
            );
    
            contexto.drawImage(
                sprites,
                chao.spriteX, chao.spriteY,
                chao.largura, chao.altura,
                (chao.x + chao.largura), chao.y,
                chao.largura, chao.altura,
            );
        },
    }
return chao;
};


function fazColizao(flappyBird, chao) {
    const flappyBirdY = flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;

    if(flappyBirdY >= chaoY) {
        return true;
    }

    return false;
}

function criaFlappyBird() {
    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
        largura: 34,
        altura: 24,
        x: 10,
        y: 50,
        gravidade: 0.25,
        velocidade: 0,
        pulo: 4.6,
        pula() {
            flappyBird.velocidade = - flappyBird.pulo;
        },
        atualiza() {
            if(fazColizao(flappyBird, globais.chao)) {
                somHit.play();

                setTimeout(() => {
    
                    mudaTela(telas.gameOver);
                    
                }, 500);  
                      
                return;
            }

            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
        },
        movimentos: [
            { spriteX: 0, spriteY: 0, }, // asa pra cima
            { spriteX: 0, spriteY: 26, }, // asa no meio 
            { spriteX: 0, spriteY: 52, }, // asa pra baixo
            { spriteX: 0, spriteY: 26, }, // asa no meio 
          ],
        frameAtual: 0,
        atualizaFrameAtual() {
            const intervaloFrames = 10;
            const passouIntervalo = frames % intervaloFrames === 0;

            if(passouIntervalo) {
                const baseIncremento = 1;
                const incremento = baseIncremento + flappyBird.frameAtual;
                const baseRepeticao = flappyBird.movimentos.length;
                flappyBird.frameAtual = incremento % baseRepeticao
            }
        },
        desenha()  {
            flappyBird.atualizaFrameAtual();
            const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];

            contexto.drawImage(
                sprites,
                spriteX, spriteY, 
                flappyBird.largura, flappyBird.altura, 
                flappyBird.x, flappyBird.y, 
                flappyBird.largura, flappyBird.altura, 
            );
        }
    }
return flappyBird;
};

const telaInicial = {
    spriteX: 134,
    spriteY: 0,
    largura: 174,
    altura: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,
    desenha()  {
        contexto.drawImage(
            sprites,
            telaInicial.spriteX, telaInicial.spriteY,
            telaInicial.largura, telaInicial.altura,
            telaInicial.x, telaInicial.y,
            telaInicial.largura, telaInicial.altura, 
        );
    }
};

const gameOver = {
    spriteX: 153,
    spriteY: 153,
    largura: 188,
    altura: 38,
    x: (canvas.width / 2) - 188 / 2,
    y: 50,
    desenha() {
        contexto.drawImage(
            sprites,
            gameOver.spriteX, gameOver.spriteY,
            gameOver.largura, gameOver.altura,
            gameOver.x, gameOver.y,
            gameOver.largura, gameOver.altura,
        );
    }
};

// TELAS

const globais = {};
let telaAtiva = {};
function mudaTela(novaTela) {
    telaAtiva = novaTela;

    if(telaAtiva.inicializa) {
        telaAtiva.inicializa();
    }
}

const telas = {
    inicio: {
        inicializa() {
            globais.flappyBird = criaFlappyBird();
            globais.chao = criaChao();
        },
        desenha() {
            planoDeFundo.desenha();
            globais.chao.desenha();
            globais.flappyBird.desenha();
            telaInicial.desenha();
            
        },
        click() {
            mudaTela(telas.jogo);
        },
        atualiza() {
            globais.chao.atualiza();
        }
    }
};

telas.jogo = {
    desenha() {
        planoDeFundo.desenha();
        globais.chao.desenha();
        globais.flappyBird.desenha();
    },
    click() {
        globais.flappyBird.pula();
    },
    atualiza() {
        globais.flappyBird.atualiza();
        globais.chao.atualiza();
    }
};

telas.gameOver = {
    desenha() {
        gameOver.desenha();
    },
    click() {
        mudaTela(telas.inicio);
    }

}




function loop() {
    telaAtiva.desenha();
    telaAtiva.atualiza();
    frames = frames + 1;
    requestAnimationFrame(loop);
}

window.addEventListener('click', function() {
    if(telaAtiva.click) {
        telaAtiva.click();
    }
});

mudaTela(telas.inicio);
loop();