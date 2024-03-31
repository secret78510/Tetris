

const particleCanvas = document.getElementById('particleWrap');
const particleCtx = particleCanvas.getContext('2d');
const gravity = 0.5;
const particleSize = 5;
let particles = [];
let key = 0;

function particleUpdate() {

    window.requestAnimationFrame(particleUpdate)
    particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    //更新粒子位置
    particles.forEach((particle) => {
        particle.x += particle.vecX;
        particle.y += particle.vecY;
        particle.vecy += gravity;
        particleCtx.fillStyle = particle.color;
        particleCtx.beginPath();
        particleCtx.fillRect(particle.x, particle.y, particleSize, particleSize);
        particleCtx.fill();
        particleCtx.closePath();
    });

    //只要不超出界線的
    particles = particles.filter((particle) => {
        return particle.x > 0 && particle.x < particleCanvas.width && particle.y > 0 && particle.y < particleCanvas.height
    })

}

function buildParticle() {
    const particleCount = 400;
    const r = Math.round(Math.random() * 255);
    const g = Math.round(Math.random() * 255);
    const b = Math.round(Math.random() * 255);

    const x = particleCanvas.width / 2;
    const y = particleCanvas.height / 2;

    for (let i = 0; i < particleCount; i++) {
        const fluctuation = Math.random() * 20;
        const vecX = Math.sin(i) * fluctuation;
        const vecY = Math.cos(i) * fluctuation;
        particles.push({ key, x, y, vecX, vecY, color: `rgb(${r}, ${g}, ${b} )` });
    }


    (function (k) {
        setTimeout(() => {
            particles = particles.filter((particle) => particle.key !== k);
        }, 1000)
    })(key);

    key++;
    window.requestAnimationFrame(particleUpdate);
}

export { buildParticle, particleCanvas }