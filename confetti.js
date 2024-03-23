/***************************************************/
/***************** By programORdie *****************/
/***************************************************/


/**
 * Creates a confetti effect on the screen.
 *
 * @param {number} amount - The number of confetti pieces to create (default: 500)
 * @return {undefined} This function does not return a value
 */
function Confetti(amount = 500) {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = 0;
    canvas.style.left = 0;
    // canvas.style.zIndex = 9999;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const mutiplyerX = canvas.width / 700;
    const mutiplyerY = canvas.height / 60;
    const colors = ['#f00', '#0f0', '#00f', '#ff0', '#0ff'];
    let confetti = [];
    function randomRange(min, max) {return Math.random() * (max - min) + min;}
    function createConfetti() {
        const x = Math.round(Math.random()) * canvas.width;
        const y = canvas.height;
        const speedX = randomRange(-6, 6) * mutiplyerX;
        const speedY = randomRange(-2, 1) * mutiplyerY;
        const rotationSpeed = randomRange(0.02, 0.05);

        return { x, y, radius: randomRange(5, 10), color: colors[Math.floor(Math.random() * colors.length)], speedX, speedY, rotation: randomRange(0, 2 * Math.PI), rotationSpeed };
    }
    function drawConfetti() {
        confetti.forEach(piece => {
            ctx.save();
            ctx.translate(piece.x + piece.radius / 2, piece.y + piece.radius / 2);
            ctx.rotate(piece.rotation);
            ctx.fillStyle = piece.color;
            ctx.fillRect(-piece.radius / 2, -piece.radius / 2, piece.radius, piece.radius);
            ctx.restore();
        });
    }
    function updateConfetti() {
        confetti.forEach(piece => {
            piece.x += piece.speedX;
            piece.y += piece.speedY;
            piece.rotation += piece.rotationSpeed;
            piece.speedY += 0.5;
            if (piece.y > canvas.height + 5) { confetti.splice(confetti.indexOf(piece), 1); }
        });
    }
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawConfetti();
        updateConfetti();
        requestAnimationFrame(animate);
    }
    for (let i = 0; i < amount; i++) { confetti.push(createConfetti()); }
    document.body.appendChild(canvas);
    animate();

    setTimeout(() => {
        canvas.remove();
    }, 5000);
}
