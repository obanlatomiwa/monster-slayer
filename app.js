function getRandomNumbers(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      numOfRounds: 0,
      winner: null,
      logMessages: [],
    };
  },

  computed: {
    attackMonsterStyles() {
      if (this.monsterHealth < 0) {
        return { width: "0%" };
      }
      return { width: this.monsterHealth + "%" };
    },
    attackPlayerStyles() {
      if (this.playerHealth < 0) {
        return { width: "0%" };
      }
      return { width: this.playerHealth + "%" };
    },

    // can only be used after 3 rounds of attacks then its disabled
    useSpecialAttack() {
      return this.numOfRounds % 3 !== 0;
    },
  },
  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        //   a draw
        this.winner = "draw";
      } else if (value <= 0) {
        //   player lost
        this.winner = "monster";
      }
    },
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        //   a draw
        this.winner = "draw";
      } else if (value <= 0) {
        //   player lost
        this.winner = "player";
      }
    },
  },

  methods: {
    startNewGame() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.winner = null;
      this.numOfRounds = 0;
      this.logMessages = [];
    },

    attackMonster() {
      this.numOfRounds++;
      const attackValue = getRandomNumbers(5, 12);
      this.monsterHealth -= attackValue;
      this.addLogMessage("player", "attack", attackValue);
      this.attackPlayer();
    },

    attackPlayer() {
      const attackValue = getRandomNumbers(8, 15);
      this.playerHealth -= attackValue;
      this.addLogMessage("monster", "attack", attackValue);
    },

    specialAttack() {
      this.numOfRounds++;
      const attackValue = getRandomNumbers(20, 30);
      this.monsterHealth -= attackValue;
      this.attackPlayer();
    },

    healPlayer() {
      this.numOfRounds++;
      const healValue = getRandomNumbers(8, 20);
      if (this.playerHealth + healValue > 100) {
        this.playerHealth = 100;
      } else {
        this.playerHealth += healValue;
      }
      this.addLogMessage("player", "heal", healValue);
      this.attackPlayer();
    },
    surrender() {
      this.winner = "monster";
    },

    addLogMessage(who, what, value) {
      this.logMessages.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
    },
  },
});

app.mount("#game");
