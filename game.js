const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

const speed = 5;
let gameRunning = false; // Game starts only after restart

const player1 = { x: 100, y: -50, width: 40, height: 40, color: "blue", health: 100, shield: 100, shieldActive: false };
const player2 = { x: 600, y: -50, width: 40, height: 40, color: "red", health: 100, shield: 100, shieldActive: false };

let bullets = [];
const keys = {
    w: false, a: false, s: false, d: false, // Player 1
    ArrowUp: false, ArrowLeft: false, ArrowDown: false, ArrowRight: false, // Player 2
    q: false, m: false // Shield controls
};

// 🎮 Event Listeners for Movement & Shooting
document.addEventListener("keydown", (e) => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
    if (e.key === "q") player1.shieldActive = true;
    if (e.key === "m") player2.shieldActive = true;
    if (e.key === " " && gameRunning) shoot(player1); // Spacebar for Player 1
    if (e.key === "Enter" && gameRunning) shoot(player2); // Enter for Player 2
});

document.addEventListener("keyup", (e) => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
    if (e.key === "q") player1.shieldActive = false;
    if (e.key === "m") player2.shieldActive = false;
});

// 🎯 Shooting Function
function shoot(player) {
    bullets.push({
        x: player.x + player.width / 2,
        y: player.y + player.height / 2,
        width: 10,
        height: 5,
        speed: player === player1 ? 7 : -7,
        color: player.color
    });
}

// 🏹 Player Movement Function
function movePlayer(player, up, left, down, right) {
    if (left && player.x > 0) player.x -= speed;
    if (right && player.x + player.width < canvas.width) player.x += speed;
    if (up && player.y > 0) player.y -= speed;
    if (down && player.y + player.height < canvas.height) player.y += speed;
}

// 🕹️ Game Loop
function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    movePlayer(player1, keys.w, keys.a, keys.s, keys.d);
    movePlayer(player2, keys.ArrowUp, keys.ArrowLeft, keys.ArrowDown, keys.ArrowRight);

    bullets.forEach((bullet) => {
        bullet.x += bullet.speed;
        drawBullet(bullet);
    });

    drawPlayer(player1);
    drawPlayer(player2);
    drawShields();

    requestAnimationFrame(gameLoop);
}

// 🏹 Draw Players
function drawPlayer(player) {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// 🎨 Draw Bullet
function drawBullet(bullet) {
    ctx.fillStyle = bullet.color;
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
}

// 🛡️ Draw Shields
function drawShields() {
    if (player1.shieldActive && player1.shield > 0) drawShield(player1, "cyan");
    if (player2.shieldActive && player2.shield > 0) drawShield(player2, "yellow");
}

function drawShield(player, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.strokeRect(player.x - 5, player.y - 5, player.width + 10, player.height + 10);
}

// 🔄 Restart Game
function restartGame() {
    player1.x = 100; player1.y = -50;
    player2.x = 600; player2.y = -50;
    player1.health = 100; player2.health = 100;
    bullets = [];
    gameRunning = false;
    dropPlayers();
}

// 🎬 Drop Players with Animation
function dropPlayers() {
    let dropSpeed = 5;
    function animateDrop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (player1.y < 300) player1.y += dropSpeed;
        if (player2.y < 300) player2.y += dropSpeed;

        drawPlayer(player1);
        drawPlayer(player2);

        if (player1.y >= 300 && player2.y >= 300) {
            showNotification("🟦 Player 1 says: Player 1!", player1);
            showNotification("🟥 Player 2 says: Player 2!", player2);
            gameRunning = true;
            gameLoop();
            return;
        }

        requestAnimationFrame(animateDrop);
    }
    animateDrop();
}

// 🔔 Show Notification Near Players
function showNotification(message, player) {
    const notification = document.createElement("div");
    notification.innerText = message;
    notification.style.position = "absolute";
    notification.style.left = `${player.x + 30}px`;
    notification.style.top = `${player.y}px`;
    notification.style.backgroundColor = "black";
    notification.style.color = "white";
    notification.style.padding = "5px 10px";
    notification.style.borderRadius = "5px";
    notification.style.fontSize = "14px";
    notification.style.fontWeight = "bold";

    document.body.appendChild(notification);
    
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 2000);
}

// 🚀 Start Game
dropPlayers();
