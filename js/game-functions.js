function carregaRecursos(){
	jogo.load.image('cenario', 'recursos/imagens/cenario.png');
	jogo.load.image('navinha', 'recursos/imagens/navinha.png');
	jogo.load.image('umTiro', 'recursos/imagens/tiro.png');
	jogo.load.audio('somTiro', ['recursos/audio/somTiro.mp3', 'recursos/audio/somTiro.ogg']);
	jogo.load.audio('somRespostaCerta', ['recursos/audio/somRespostaCerta.mp3', 'recursos/audio/somRespostaCerta.ogg']);
	jogo.load.audio('somRespostaErrada', ['recursos/audio/somRespostaErrada.mp3', 'recursos/audio/somRespostaErrada.ogg']);
	jogo.load.audio('somGameOver', ['recursos/audio/somGameOver.mp3', 'recursos/audio/somGameOver.ogg']);
	jogo.load.audio('somTema', ['recursos/audio/somTema.mp3', 'recursos/audio/somTema.ogg']);
	jogo.load.image('meteoro', 'recursos/imagens/meteoro.png');
	jogo.load.image('explosao', 'recursos/imagens/explosao.png');
	jogo.load.image('coracao', 'recursos/imagens/coracao.png');
}

function criaCenarioEBackground(){
	cenario = jogo.add.tileSprite(0, 60, 800, 600, 'cenario'); // x, y, width, heigth, key
	coracao = jogo.add.sprite(jogo.world.centerX - 385, jogo.world.centerY - 295, 'coracao');
	//parametro 0.3 refere-se ao volume, true é para que a musica reproduza em loop
	somTema.play(null, null, 0.3, true, null);
	velocidadeScrollCenario = 2;
}

//Função para evitar que algum audio seja executado antes de ser carregado na variável respectiva.
function carregaAudios(){
	somTema = jogo.add.audio('somTema');
	somTiro = jogo.add.audio('somTiro');
	somRespostaCerta = jogo.add.audio('somRespostaCerta');
	somRespostaErrada = jogo.add.audio('somRespostaErrada');
	somGameOver = jogo.add.audio('somGameOver');
}

function criaNave(){
	navinha = jogo.add.sprite(jogo.world.centerX, jogo.world.centerY + 175, 'navinha');
	jogo.physics.enable(navinha, Phaser.Physics.ARCADE); // aplicar físicas (object, system)
	controles = jogo.input.keyboard.createCursorKeys(); // retorna um objeto -> up, down, left, right
}

function criaTiros(){
	tiroVelocidade = 0;

	tiro = jogo.add.group();
	// Faz com que os objetos do grupo tenham um 'corpo' e em seguida seta o sistema de fisica aplicado a esses corpos
	tiro.enableBody = true;
	tiro.physicsBodyType = Phaser.Physics.ARCADE;
	// Cria um grupo de 30 sprites usando a imagem da key fornecida
	tiro.createMultiple(30, 'umTiro');
	// Posiçao do tiro no bico da nave   ---- Altura em que o tiro sai, pra sair da boca da nave e não do meio da tela
	tiro.setAll('anchor.x', -0.9);
	tiro.setAll('anchor.y', 0.8);
	// Faz o objeto ser killado após sair da tela chamando automaticamente a função inWorld que retorna false	
	tiro.setAll('outOfBoundsKill', true);
	tiro.setAll('checkWorldBounds', true);

	botaoAtirar = jogo.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function criaMeteoros(){
	// reseta posição do gurpo no eixo y
	meteoros.y = 0;

	let posicoes = getPosicaoMeteoros();

	meteoroCerto = meteoros.create(posicoes[0], 76,'meteoro');
	meteoroCerto.anchor.setTo(0.5,0.5);		
	textCorreto = jogo.add.text(meteoroCerto.x, meteoroCerto.y, respostaCorreta, { 
		font: "20px Arial",
		fill: "#ffffff",
		wordWrap: true,
		wordWrapWidth: meteoroCerto.width,
		align: "center" });
	textCorreto.anchor.set(0.5, 0.5);


	meteoroErrado1 = meteoros.create(posicoes[1], 76, 'meteoro');
	meteoroErrado1.anchor.setTo(0.5, 0.5);
	textErrado1 = jogo.add.text(meteoroErrado1.x, meteoroErrado1.y, respostaCorreta - getRandomInt(1,7), { 
		font: "20px Arial",
		fill: "#ffffff",
		wordWrap: true,
		wordWrapWidth: meteoroErrado1.width,
		align: "center" });	
	textErrado1.anchor.set(0.5, 0.5);


	meteoroErrado2 = meteoros.create(posicoes[2], 76, 'meteoro');
	meteoroErrado2.anchor.setTo(0.5, 0.5);
	textErrado2 = jogo.add.text(meteoroErrado2.x, meteoroErrado2.y, respostaCorreta - getRandomInt(1,3), { 
		font: "20px Arial",
		fill: "#ffffff",
		wordWrap: true,
		wordWrapWidth: meteoroErrado2.width,
		align: "center" });
	textErrado2.anchor.set(0.5, 0.5);
}

function quandoAconteceColisaoCorreta(tiroQueAcertou, meteoro){
	tiroQueAcertou.kill();
	meteoro.kill();	
	meteoroErrado1.kill();
	meteoroErrado2.kill();
	textCorreto.kill();
	textErrado1.kill();
	textErrado2.kill();
	pontuacao += 20;
	textoPontuacao.text = pontuacao;
	somRespostaCerta.play();
	alteraPergunta();
	criaMeteoros();
	
	/*Implementar lógica de atualização progressiva da dificuldade*/
	if(pontuacao > 40){
		velocidadeMovimentacaoMeteoros = 1;
	}
	if(pontuacao > 100){
		velocidadeMovimentacaoMeteoros = 2;
	}

	// O código abaixo faz com que o grupo de tiros seja destruido e em seguida criado novamente, 
	//para evitar de acertar meteoros errados
	/*
	tiro.removeAll(true, true, true);
		tiro = jogo.add.group();
	// Faz com que os objetos do grupo tenham um 'corpo' e em seguida seta o sistema de fisica aplicado a esses corpos
	tiro.enableBody = true;
	tiro.physicsBodyType = Phaser.Physics.ARCADE;
	// Cria um grupo de 30 sprites usando a imagem da key fornecida
	tiro.createMultiple(30, 'umTiro');
	// Posiçao do tiro no bico da nave   ---- Altura em que o tiro sai, pra sair da boca da nave e não do meio da tela
	tiro.setAll('anchor.x', -0.9);
	tiro.setAll('anchor.y', 0.8);
	// Faz o objeto ser killado após sair da tela chamando automaticamente a função inWorld que retorna false	
	tiro.setAll('outOfBoundsKill', true);
	tiro.setAll('checkWorldBounds', true);
	*/

}

function alteraPergunta(){
	var op = getRandomInt(1, 4);
	var a = getRandomInt(1, 9);
	var b = getRandomInt(1, 9);

	if (op == 1) {
		respostaCorreta = a + b;
		textoPergunta.text = a + '+' + b + " = ?"
	}

	if (op == 2) {

		//Evita respostas das operações com negativos
		if (a < b) {
			temp = a;
			a = b;
			b = temp;
		}

		respostaCorreta = a - b;
		textoPergunta.text = a + '-' + b + " = ?"
	}

	if (op == 3) {
		respostaCorreta = a * b;
		textoPergunta.text = a + '*' + b + " = ?"
	}

	if (op == 4) {

		//Evita respostas das operações com valores irracionais
		while(a%b != 0) {
			var a = getRandomInt(1, 9);
			var b = getRandomInt(1, 9);
		}
		respostaCorreta = a / b;
		textoPergunta.text = a + '/' + b + " = ?"
	}
}

function quandoAconteceColisaoErrada(tiroQueAcertou, meteoro){
	tiroQueAcertou.kill();
	meteoroCerto.kill();
	meteoro.kill();	
	meteoroErrado1.kill();
	meteoroErrado2.kill();
	textCorreto.kill();
	textErrado1.kill();
	textErrado2.kill();
	alteraPergunta();
	criaMeteoros();
	// verifica vidas e chama game-over
	vidas--;
	textoVidas.text = vidas;
	somRespostaErrada.play();
	checkGameOver();
	//jogo.state.start('Game-over');

}

function atualizoes(){

	cenario.tilePosition.y += velocidadeScrollCenario;
	
	//resetando para 0
	navinha.body.velocity.x = 0;

	
	if(botaoAtirar.isDown){
		atira();	
	}

	if(controles.left.isDown && navinha.body.x > 0){
		navinha.body.velocity.x = -500;
	}

	if(controles.right.isDown && navinha.body.x < 737){
		navinha.body.velocity.x = 500;
	}
}

function atira(){
	
	umTiro = tiro.getFirstExists(false);
	somTiro.play();

	if(jogo.time.now > tiroVelocidade){
		//console.log('entrou no primeiro if');
		if(umTiro){
			
			//console.log('entrou no segundo if')
			umTiro.reset(navinha.x,navinha.y);
			// Quão rápido sobe a bala
			umTiro.body.velocity.y = -300; //pixels por segundo - rate / velocidade
			// De quanto em quanto tempo sai uma bala
			tiroVelocidade = jogo.time.now + 200;
			
		}
	}
}

function getPosicaoMeteoros(){
	let posicoes = [
	getRandomInt(10, 710),
	getRandomInt(10, 710),
	getRandomInt(10, 710)
	];

	//adiciona lógica para controlar a posição dos meteoros
	return posicoes;
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

//detecta quando os meteoros não são atingidos
function checkGameOver(){
	if (meteoros.y > 550 && vidas > 0) {
		vidas--;
		textoVidas.text = vidas;
		meteoroErrado1.kill();
		meteoroErrado2.kill();
		meteoroCerto.kill();
		somRespostaErrada.play();
		criaMeteoros();
	} else if(meteoros.y > 600 && vidas <= 0) {
		//O parametro 0.2 na função .play é o volume do audio
		somTema.stop();
		somGameOver.play(null, null, 0.2, null, null);
		gameOver();
	} else if(vidas <= 0){
		somTema.stop();
		somGameOver.play(null, null, 0.2, null, null);
		gameOver();
	}
}

//chama a tela de game over quando acabam as vidas
function gameOver() {
	if(!setouVelocidade){
		velocidadeMovimentacaoMeteoros = 0.5;
	}
	jogo.state.start('Game-over');
}

function movimentaMeteoros(){
	meteoros.y += velocidadeMovimentacaoMeteoros;
	textCorreto.y +=  velocidadeMovimentacaoMeteoros;
	textErrado1.y += velocidadeMovimentacaoMeteoros;
	textErrado2.y += velocidadeMovimentacaoMeteoros;
}