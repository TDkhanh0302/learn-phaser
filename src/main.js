import Phaser from 'phaser'
// import GameScene from './scenes/GameScene'
import Race from './scenes/Race'

const config = {
	type: Phaser.AUTO,
	width: 480,
	height: 800,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 }
		},
		debug: true
	},
	scene: [Race]
}

export default new Phaser.Game(config)
