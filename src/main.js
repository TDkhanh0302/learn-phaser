import Phaser from 'phaser'
import Race from './scenes/Race'
import GameOver from './scenes/GameOver'

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
	scene: [Race, GameOver]
}

export default new Phaser.Game(config)
