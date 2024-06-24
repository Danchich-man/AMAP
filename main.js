class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Загрузка ассетов
        this.load.image('towerBase', 'assets/towerBase.png');
        this.load.image('mineButton', 'assets/mineButton.png');
        this.load.image('processButton', 'assets/processButton.png');
        this.load.image('buildButton', 'assets/buildButton.png');
        this.load.image('clay', 'assets/clay.png');
        this.load.image('brick', 'assets/brick.png');
        this.load.image('energy', 'assets/energy.png');
    }

    create() {
        this.scene.start('MainScene');
    }
}

class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    create() {
        this.add.image(400, 300, 'towerBase');

        this.mineButton = this.add.image(200, 500, 'mineButton').setInteractive();
        this.processButton = this.add.image(400, 500, 'processButton').setInteractive();
        this.buildButton = this.add.image(600, 500, 'buildButton').setInteractive();

        this.mineButton.on('pointerdown', () => this.scene.start('MineScene'));
        this.processButton.on('pointerdown', () => this.scene.start('ProcessScene'));
        this.buildButton.on('pointerdown', this.buildTower, this);

        this.clayText = this.add.text(16, 16, 'Clay: 0', { fontSize: '32px', fill: '#fff' });
        this.brickText = this.add.text(16, 48, 'Bricks: 0', { fontSize: '32px', fill: '#fff' });
        this.heightText = this.add.text(16, 80, 'Height: 0m', { fontSize: '32px', fill: '#fff' });

        this.loadProgress();
    }

    buildTower() {
        if (this.bricks >= 100) {
            this.bricks -= 100;
            this.height++;
            this.updateTexts();
        }
    }

    updateTexts() {
        this.clayText.setText('Clay: ' + this.clay);
        this.brickText.setText('Bricks: ' + this.bricks);
        this.heightText.setText('Height: ' + this.height + 'm');
    }

    loadProgress() {
        this.clay = parseInt(localStorage.getItem('clay')) || 0;
        this.bricks = parseInt(localStorage.getItem('bricks')) || 0;
        this.height = parseInt(localStorage.getItem('height')) || 0;
        this.updateTexts();
    }

    saveProgress() {
        localStorage.setItem('clay', this.clay);
        localStorage.setItem('bricks', this.bricks);
        localStorage.setItem('height', this.height);
    }

    update() {
        // Автосохранение прогресса каждую минуту
        if (this.time.now > this.nextSave) {
            this.saveProgress();
            this.nextSave = this.time.now + 60000;
        }
    }
}

class MineScene extends Phaser.Scene {
    constructor() {
        super('MineScene');
    }

    create() {
        this.add.text(400, 16, 'Mine Clay', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5, 0);

        this.energy = 5000;
        this.clay = 0;

        this.energyText = this.add.text(16, 16, 'Energy: ' + this.energy + '/5000', { fontSize: '32px', fill: '#fff' });
        this.clayText = this.add.text(16, 48, 'Clay: ' + this.clay, { fontSize: '32px', fill: '#fff' });

        this.input.on('pointerdown', this.mineClay, this);

        this.backButton = this.add.text(700, 550, 'Back', { fontSize: '32px', fill: '#fff' }).setInteractive();
        this.backButton.on('pointerdown', () => this.scene.start('MainScene'));
    }

    mineClay() {
        if (this.energy >= 20) {
            this.energy -= 20;
            this.clay++;
            this.energyText.setText('Energy: ' + this.energy + '/5000');
            this.clayText.setText('Clay: ' + this.clay);

            const plusOne = this.add.text(400, 300, '+1', { fontSize: '64px', fill: '#0f0' }).setOrigin(0.5, 0.5);
            this.tweens.add({
                targets: plusOne,
                alpha: 0,
                y: 200,
                duration: 1000,
                onComplete: () => plusOne.destroy()
            });
        }
    }

    update() {
        // Восстановление энергии
        if (this.energy < 5000) {
            this.energy += 1;
            this.energyText.setText('Energy: ' + this.energy + '/5000');
        }
    }
}

class ProcessScene extends Phaser.Scene {
    constructor() {
        super('ProcessScene');
    }

    create() {
        this.add.text(400, 16, 'Process Clay into Bricks', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5, 0);

        this.processButton = this.add.text(400, 300, 'Process Clay', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5, 0.5).setInteractive();
        this.processButton.on('pointerdown', this.processClay, this);

        this.clay = parseInt(localStorage.getItem('clay')) || 0;
        this.bricks = parseInt(localStorage.getItem('bricks')) || 0;

        this.clayText = this.add.text(16, 48, 'Clay: ' + this.clay, { fontSize: '32px', fill: '#fff' });
        this.brickText = this.add.text(16, 80, 'Bricks: ' + this.bricks, { fontSize: '32px', fill: '#fff' });
        this.backButton = this.add.text(700, 550, 'Back', { fontSize: '32px', fill: '#fff' }).setInteractive();
        this.backButton.on('pointerdown', () => this.scene.start('MainScene'));
    }
    
    processClay() {
        if (this.clay >= 100) {
            this.clay -= 100;
            this.bricks++;
            this.updateTexts();
        }
    }
    
    updateTexts() {
        this.clayText.setText('Clay: ' + this.clay);
        this.brickText.setText('Bricks: ' + this.bricks);
    }
}

// Инициализация игры после объявления всех классов
const config = {
type: Phaser.AUTO,
width: 800,
height: 600,
physics: {
default: 'arcade',
arcade: {
gravity: { y: 0 },
debug: false
}
},
scene: [BootScene, MainScene, MineScene, ProcessScene]
};

const game = new Phaser.Game(config);

game.scene.start('BootScene');