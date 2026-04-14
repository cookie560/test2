let deck = [];
let hand = [];
let cardPool = [];

let player = { active: null };
let opponent = { active: null };

let turn = "player";

async function loadCards() {
    const res = await fetch('./cards.json');
    cardPool = await res.json();
}

async function initGame() {
    await loadCards();

    for (let i = 0; i < 60; i++) {
        const c = cardPool[i % cardPool.length];
        deck.push({ ...c, uid: i });
    }

    renderDeck();
}

function renderDeck() {
    document.getElementById("deck-count").innerText = deck.length;
}

function drawCard() {
    if (deck.length === 0) return;

    const card = deck.shift();
    hand.push(card);
    updateHand();
    renderDeck();
}

function updateHand() {
    const handDiv = document.getElementById("hand");
    handDiv.innerHTML = "";

    hand.forEach((card, i) => {
        const c = document.createElement("div");
        c.className = "card";
        c.style.backgroundImage = `url(${card.img})`;

        c.draggable = true;
        c.addEventListener("dragstart", e => {
            e.dataTransfer.setData("index", i);
        });

        handDiv.appendChild(c);
    });
}

document.querySelectorAll(".dropzone").forEach(zone => {
    zone.addEventListener("dragover", e => e.preventDefault());

    zone.addEventListener("drop", e => {
        const index = e.dataTransfer.getData("index");
        const card = hand[index];

        zone.innerHTML = "";
        const c = document.createElement("div");
        c.className = "card";
        c.style.backgroundImage = `url(${card.img})`;

        zone.appendChild(c);

        player.active = { ...card, hp: card.hp };
        hand.splice(index, 1);
        updateHand();
    });
});

function getDamage(card) {
    if (!card) return 0;
    return Math.floor(card.hp / 2);
}

function attack() {
    if (!player.active) return;

    if (!opponent.active) {
        opponent.active = { ...cardPool[0], hp: 300 };
        renderOpponent();
    }

    const dmg = getDamage(player.active);
    opponent.active.hp -= dmg;

    log("你打了 " + dmg);

    if (opponent.active.hp <= 0) {
        log("擊倒對手！");
        opponent.active = null;
        renderOpponent();
    } else {
        setTimeout(opponentTurn, 1000);
    }
}

function opponentTurn() {
    const dmg = getDamage(opponent.active);
    player.active.hp -= dmg;

    log("對手打你 " + dmg);

    if (player.active.hp <= 0) {
        log("你被擊倒！");
        player.active = null;
    }
}

function renderOpponent() {
    const zone = document.getElementById("opponent-active");
    zone.innerHTML = "";

    if (!opponent.active) return;

    const c = document.createElement("div");
    c.className = "card";
    c.style.backgroundImage = `url(${opponent.active.img})`;

    zone.appendChild(c);
}

function log(msg) {
    const box = document.getElementById("log");
    box.innerHTML += `<div>${msg}</div>`;
}

function startShuffle() {
    deck.sort(() => Math.random() - 0.5);
    log("洗牌完成");
}

initGame();
