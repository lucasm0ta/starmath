var Menu = {
	preload: function(){
		this.load.image('botaoIniciar', 'recursos/imagens/botao-jogar.png');
		this.load.image('botaoOptions', 'recursos/imagens/botao-opcoes.png');
		this.load.image('botaoComoJogar', 'recursos/imagens/botao-como-jogar.png');
		this.load.image('botaoRanking', 'recursos/imagens/botao-ranking.png');
		this.load.image('backgroundTelaInicial', 'recursos/imagens/background-tela-inicial.png');

	},

	create: function(){
		
		this.add.sprite(0, 0, 'backgroundTelaInicial');
		this.add.button(this.world.centerX - (245/2), this.world.centerY - 60, 'botaoIniciar', this.startGame, this);
		this.add.button(this.world.centerX - (245/2), this.world.centerY + 20, 'botaoComoJogar', this.startTutorial, this);
		//this.add.button(this.world.centerX - (245/2), this.world.centerY - 50,'botaoOptions', this.startOptions, this);
		//this.add.button(this.world.centerX - (245/2), this.world.centerY + 10, 'botaoComoJogar', this.startRanking, this);
		//this.add.button(this.world.centerX - (245/2), this.world.centerY + 70, 'botaoRanking', this.startRanking, this);
	},

	startGame: function(){
		this.state.start('Niveis');
	},

	startTutorial : function(){
		this.state.start('ComoJogar');
	}

	// startOptions: function(){
	// 	this.state.start('Opcoes');
	// },

	// startRanking: function(){
	// 	//this.state.start('Ranking');
	// }
};