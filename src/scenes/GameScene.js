import Phaser from 'phaser'

const GROUND_KEY = 'ground'
const DUDE_KEY = 'dude'
const STAR_KEY = 'star'

export default class GameScene extends Phaser.Scene
{
	constructor()
	{
		super('game-scene')
    this.player = undefined
    this.cursors = undefined
    this.platforms = undefined
	}

	preload()
	{
    this.load.image('sky', 'assets/sky.png')
		this.load.image(GROUND_KEY, 'assets/platform.png')
		this.load.image(STAR_KEY, 'assets/star.png')
		this.load.image('bomb', 'assets/bomb.png')

		this.load.spritesheet(DUDE_KEY, 
			'assets/dude.png',
			{ frameWidth: 32, frameHeight: 48 }
		)
	}

	create()
	{
		this.add.image(400, 300, 'sky').setScrollFactor(0, 0)

    this.platforms = this.createPlatforms()
    this.player =  this.createPlayer()
    const stars = this.createStars()

    this.physics.add.collider(this.player, this.platforms)
    this.physics.add.collider(stars, this.platforms)

    this.cursors = this.input.keyboard.createCursorKeys()
    this.physics.add.overlap(this.player, stars, this.collectStar, null, this);

    this.cameras.main.startFollow(this.player)
	}

  collectStar(player, star)
	{
		star.disableBody(true, true)
	}

  update()
	{
		if (this.cursors.left.isDown)
		{
			this.player.setVelocityX(-160)

			this.player.anims.play('left', true)
		}
		else if (this.cursors.right.isDown)
		{
			this.player.setVelocityX(160)

			this.player.anims.play('right', true)
		}
		else
		{
			this.player.setVelocityX(0)

			this.player.anims.play('turn')
		}

		if (this.cursors.up.isDown && this.player.body.touching.down)
		{
			this.player.setVelocityY(-330)
		}

    this.platforms.children.iterate(child => {
      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = child

      const scrollY = this.cameras.main.scrollY
      if (platform.y >= scrollY + 600) {
        console.log('scrollY',scrollY)
        platform.y = scrollY - 150
        platform.body.updateFromGameObject()
      }
    })

    this.player.body.checkCollision.up = false
    this.player.body.checkCollision.left = false
    this.player.body.checkCollision.right = false
	}

  createPlatforms()
	{
		const platforms = this.physics.add.staticGroup()

    // platforms.create(150, 568, GROUND_KEY)
    for (let i = 0; i <= 10; i++) {
      const x = Phaser.Math.Between(70, 600)
      const y = 160 * i

      platforms.create(x, y, GROUND_KEY)
      console.log('platforms', y)
    }

		// platforms.create(50, 568, GROUND_KEY)
		// platforms.create(600, 400, GROUND_KEY)
		// platforms.create(50, 250, GROUND_KEY)
		// platforms.create(650, 100, GROUND_KEY)

    return platforms
	}

  createPlayer()
	{
		const player = this.physics.add.sprite(300, 200, DUDE_KEY)
		player.setBounce(0.2)
		player.setCollideWorldBounds(false)

		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1
		})
		
		this.anims.create({
			key: 'turn',
			frames: [ { key: DUDE_KEY, frame: 4 } ],
			frameRate: 20
		})
		
		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 5, end: 8 }),
			frameRate: 10,
			repeat: -1
		})

    return player
  }

  createStars()
	{
		const stars = this.physics.add.group({
			key: STAR_KEY,
			repeat: 11,
			setXY: { x: 12, y: 0, stepX: 60 }
		})
		
		stars.children.iterate((child) => {
			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
		})

		return stars
	}
}