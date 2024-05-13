const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const window_height = window.innerHeight;
const window_width = window.innerWidth;
canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#ff8";

let mouseX = 0;
let mouseY = 0;

/* Función para obtener la posición del mouse en relación con el canvas */
function xyMouse() {
    let rect = canvas.getBoundingClientRect(); // Obtener el rectángulo del canvas
    mouseX = event.clientX - rect.left; // Restar la posición del canvas en la ventana
    mouseY = event.clientY - rect.top; // Restar la posición del canvas en la ventana
}

/* Función para dibujar las coordenadas del mouse en el canvas */
function drawMousePosition(context) {
    context.font = "20px Arial";
    context.fillStyle = "#000"; // Establecer el color del texto
    context.fillText("x: " + mouseX.toFixed(2) + " y: " + mouseY.toFixed(2), window_width - 200, 20); // Dibujar el texto
}

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.text = text;
        this.speed = speed;
        this.dx = (Math.random() < 0.5 ? -1 : 1) * this.speed;
        this.dy = (Math.random() < 0.5 ? -1 : 1) * this.speed;
    }

    draw(context) {
        context.beginPath();
        context.strokeStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX, this.posY);
        context.lineWidth = 2;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();
    }

    update(context) {
        this.draw(context);

        if ((this.posX + this.radius) > window_width || (this.posX - this.radius) < 0) {
            this.dx = -this.dx;
        }

        if ((this.posY - this.radius) < 0 || (this.posY + this.radius) > window_height) {
            this.dy = -this.dy;
        }

        this.posX += this.dx;
        this.posY += this.dy;
    }
}

function getDistance(x1, x2, y1, y2) {
    let xDistance = x2 - x1;
    let yDistance = y2 - y1;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

let circles = [];
for (let i = 0; i < 10; i++) {
    let randomX = Math.random() * (window_width - 100) + 50;
    let randomY = Math.random() * (window_height - 100) + 50;
    let randomRadius = 25 + Math.random() * 25;
    let randomSpeed = 2 + Math.random() * 2;
    circles.push(new Circle(randomX, randomY, randomRadius, getRandomColor(), (i + 1).toString(), randomSpeed));
}

circles.forEach(circle => circle.draw(ctx));

let updateCircles = function () {
    requestAnimationFrame(updateCircles);
    ctx.clearRect(0, 0, window_width, window_height);
    circles.forEach(circle => circle.update(ctx));
    drawMousePosition(ctx); // Dibujar las coordenadas del mouse
    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            if (getDistance(circles[i].posX, circles[j].posX, circles[i].posY, circles[j].posY) < circles[i].radius + circles[j].radius) {
                let tempDx = circles[i].dx;
                let tempDy = circles[i].dy;
                circles[i].dx = circles[j].dx;
                circles[i].dy = circles[j].dy;
                circles[j].dx = tempDx;
                circles[j].dy = tempDy;

                circles[i].color = getRandomColor();
                circles[j].color = getRandomColor();
            }
        }
    }
};

canvas.addEventListener("mousemove", xyMouse); // Agregar el evento de mouse

canvas.addEventListener("click", function(event) {
    let clickedX = event.clientX - canvas.getBoundingClientRect().left;
    let clickedY = event.clientY - canvas.getBoundingClientRect().top;

    for (let i = 0; i < circles.length; i++) {
        let distanceFromCenter = getDistance(clickedX, circles[i].posX, clickedY, circles[i].posY);
        if (distanceFromCenter <= circles[i].radius) {
            let distanceFromEdge = circles[i].radius - distanceFromCenter;
            if (distanceFromEdge >= 0) { // Si el clic está dentro del círculo
                circles.splice(i, 1);
                break; // Si ya se ha encontrado y eliminado un círculo, salir del bucle
            }
        }
    }
});

updateCircles();
