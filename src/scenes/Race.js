import Phaser from "phaser";

const PLAYER_KEY = 'player'
const ENEMY_KEY = 'enemycar'

export default class Race extends Phaser.Scene {
  constructor() {
    super('race-scene')
    this.player = undefined
    this.cursors = undefined
    this.enemys = undefined
  }

  preload() {
    this.load.image('road', 'assets/road.png')
    this.load.image(PLAYER_KEY, 'assets/player.png')
    this.load.image(ENEMY_KEY, 'assets/enemycar.png')

  }

  create() {
    this.add.image(240, 400, 'road')

    this.enemys = this.createEnemy()
    this.player = this.createPlayer()

    this.physics.add.collider(this.player, this.enemys)

    this.cursors = this.input.keyboard.createCursorKeys()
  }

  update() {
    if (this.cursors.left.isDown) {
			this.player.setVelocityX(-300)
		} else if (this.cursors.right.isDown) {
			this.player.setVelocityX(300)
		} else if (this.cursors.up.isDown) {
			this.player.setVelocityY(-300)
		} else if (this.cursors.down.isDown) {
      this.player.setVelocityY(300)
    } else {
      this.player.setVelocity(0, 0)
    }
  }

  createEnemy() {
    const enemys = this.physics.add.staticGroup()

    for (let i = 0; i < 10; i++) {
      const x = Phaser.Math.Between(30, 440)
      const y = 360 * i

      // enemys.create(x, y, ENEMY_KEY)
      enemys.create(x, y, ENEMY_KEY)
    }

    return enemys
  }

  createPlayer() {
    const player = this.physics.add.image(240, 700, PLAYER_KEY).setScale(0.9)
    // player.setCollideWorldBounds(false)
    player.setCollideWorldBounds(true)
    

    return player
  }
}