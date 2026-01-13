const menuIcon = document.getElementById("menuIcon");
const navMenu = document.getElementById("navMenu");

menuIcon.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});


document.querySelectorAll(".cinematic-text").forEach(text => {
  const letters = text.innerText.split("");
  text.innerText = "";

  letters.forEach(letter => {
    const span = document.createElement("span");
    span.innerText = letter === " " ? "\u00A0" : letter;
    text.appendChild(span);
  });
});

const cinematicObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const spans = entry.target.querySelectorAll("span");
      spans.forEach((span, i) => {
        setTimeout(() => {
          span.style.opacity = 1;
          span.style.transform = "translateY(0)";
          span.style.filter = "blur(0)";
        }, i * 35);
      });
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll(".cinematic-text").forEach(el => {
  cinematicObserver.observe(el);
});


const canvas = document.getElementById("ribbon-canvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

let t = 0;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const scroll = window.scrollY * 0.002;

  ctx.beginPath();
  ctx.lineWidth = 80;
  ctx.strokeStyle = "rgba(247, 210, 141, 0.2)";
  ctx.lineCap = "round";
  

  for (let y = -100; y < canvas.height + 100; y += 10) {
    const x =
      canvas.width / 2 +
      Math.sin(y * 0.01 + t + scroll) * 200;

    if (y === -100) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  ctx.stroke();
  t += 0.01;

  requestAnimationFrame(draw);
}

draw();
