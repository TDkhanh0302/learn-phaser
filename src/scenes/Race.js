import Phaser from 'phaser'

const PLAYER_KEY = 'player'
const ENEMY_KEY = 'enemycar'
const STAR_KEY = 'star'

export default class Race extends Phaser.Scene {
  starsCollected = 0

  constructor() {
    super('race-scene')
    this.player = undefined
    this.cursors = undefined
    this.enemys = undefined
    this.stars = undefined
    this.starsCollectedText = undefined
  }

  preload() {
    this.load.image('road', 'assets/road.png')
    this.load.image(PLAYER_KEY, 'assets/player.png')
    this.load.image(ENEMY_KEY, 'assets/enemycar.png')
    this.load.image(STAR_KEY, 'assets/star.png')
  }

  create() {
    this.add.image(240, 400, 'road').setScrollFactor(1, 0)

    this.enemys = this.createEnemy()
    this.player = this.createPlayer()
    this.stars = this.createStars()

    this.physics.add.collider(this.player, this.enemys)
    
    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this)
    this.physics.add.overlap(this.player, this.enemys, this.checkCollisions, null, this)
    this.cursors = this.input.keyboard.createCursorKeys()

    const style = { color: '#fff', fontSize: 24 }
    this.starsCollectedText = this.add.text(240, 10, 'Stars: 0', style)
      .setScrollFactor(0)
      .setOrigin(0.5, 0)
  }

  collectStar(player, star)
	{
      // star.disableBody(false, true)
      this.stars.killAndHide(star)
      this.physics.world.disableBody(star.body)
      this.starsCollected++

      const value = `Stars: ${this.starsCollected}`
      this.starsCollectedText.text = value
	}

  checkCollisions() {
    console.log('game over')
    this.scene.start('game-over')
  }

  update() {
    const cam  = this.cameras.main
    const speed = 2
    cam.scrollY -= speed

    this.player.setY(cam.scrollY + 700)
    // const positionX = this.player.x
    // const positionY = this.player.y
    // console.log('position X',positionX)
    // console.log('position Y',positionY)
    if (this.cursors.left.isDown) {
			// this.player.setX(positionX - 60)
      this.player.setVelocityX(-160)
		} else if (this.cursors.right.isDown) {
			// this.player.setX(positionX + 60)
      this.player.setVelocityX(160)
		} else {
      this.player.setVelocity(0, 0)
    }

    this.enemys.children.iterate(child => {
      /** @type {Phaser.Physics.Arcade.Sprite} */
      const enemy = child
      const scrollY = cam.scrollY
      if (enemy.y >= scrollY + 950) {
        enemy.y = scrollY
        enemy.body.updateFromGameObject()
      }
    })

    this.stars.children.iterate(item => {
      /** @type {Phaser.Physics.Arcade.Sprite} */
      const star = item
      const scrollY = cam.scrollY
      if (star.y >= scrollY + 800) {
        star.y = scrollY
        star.x = Phaser.Math.RND.pick([67, 186, 306, 423])
        star.body.updateFromGameObject()
      }
    })

  }

  createEnemy() {
    const enemys = this.physics.add.staticGroup()
    for (let i = 0; i < 3; i++) {
      const x = Phaser.Math.RND.pick([67, 186, 306, 423])
      const y = 370 * i
      enemys.create(x, y, ENEMY_KEY)
    }
    return enemys
  }

  createPlayer() {
    const player = this.physics.add.image(240, 700, PLAYER_KEY)
    player.setCollideWorldBounds(false)
    return player
  }

  createStars() {
    const randomX = Phaser.Math.RND.pick([67, 186, 306, 423])
		const stars = this.physics.add.staticGroup({
			key: STAR_KEY,
			repeat: 4,
			setXY: { x: randomX, y: 0, stepY: 35 }
		})

    stars.setActive(true)
    stars.setVisible(true)
    this.add.existing(stars)
    this.physics.world.enable(stars)

		return stars
	}
}