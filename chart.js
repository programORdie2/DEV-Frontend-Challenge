/***************************************************/
/***************** By programORdie *****************/
/***************************************************/


/**
 * Generates a pie chart with the given data and names.
 *
 * @param {Array} data - An array of numbers representing the data to be displayed in the pie chart.
 * @param {Array} names - An array of strings representing the names of the data elements.
 * @param {Array} [colors=null] - An optional array of strings representing the colors of the data elements. If not provided, default colors will be used.
 * @return {undefined} This function does not return a value.
 */
function makeChart(data, names, element = document.body, colors = null) {
    const dataUnsorted = data;
    const namesUnsorted = names;
    let colorsUnsorted = ['#7f24c9', '#c4217d', '#2126c4', '#3cbec9', '#2180c4'];

    if (colors !== null) {
        colorsUnsorted = colors;
    }

    const combinedArray = dataUnsorted.map((value, index) => ({ index, value, name: namesUnsorted[index], color: colorsUnsorted[index] }));
    combinedArray.sort((a, b) => b.value - a.value);

    data = combinedArray.map(item => item.value);
    names = combinedArray.map(item => item.name);
    colors = combinedArray.map(item => item.color);

    const totalData = data.reduce((a, b) => a + b);

    let partEffects = [];
    for (let i = 0; i < data.length; i++) {
        partEffects.push(0);
    }

    let angles = [];

    let [mouseX, mouseY, smoothX, smoothY] = [-50, -50, -50, -50];

    const borderColor = '#b5b5b5';
    const borderHighlightColor = '#ffffff';
    const textColor = '#ffffff';

    const cornerRadius = 0.1;

    const canvas = document.createElement('canvas');
    canvas.width = 450;
    canvas.height = 460;
    const ctx = canvas.getContext('2d');

    ctx.lineCap = "round";

    const centerX = canvas.width / 2;
    const centerY = canvas.height - centerX + 48;
    const radius = Math.min(centerX, centerY) - 50;

    const dpr = window.devicePixelRatio;
    canvas.width = canvas.width * dpr;
    canvas.height = canvas.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = canvas.width / dpr + 'px';
    canvas.style.height = canvas.height / dpr + 'px';

    ctx.translate(0.5, 0.5);

    let animationTimeout = 0.4 * 60;
    let currentHighlight = null;
    let startEffect = 0;

    let startAngle = -0.5 * Math.PI;
    for (let i = 0; i < data.length; i++) {
        const sliceAngle = (2 * Math.PI * (data[i] / totalData));
        if (angles.length < data.length) {
            angles.push({ start: startAngle + Math.PI / 2, end: startAngle + sliceAngle + Math.PI / 2 });
        }
        startAngle += sliceAngle;
    }

    function shadeColor(color, percent) {
        var R = parseInt(color.substring(1, 3), 16);
        var G = parseInt(color.substring(3, 5), 16);
        var B = parseInt(color.substring(5, 7), 16);

        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);

        R = (R < 255) ? R : 255;
        G = (G < 255) ? G : 255;
        B = (B < 255) ? B : 255;

        R = Math.round(R)
        G = Math.round(G)
        B = Math.round(B)

        var RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
        var GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
        var BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

        return "#" + RR + GG + BB;
    }

    function drawPieChart() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let redrawPart = null;
        let startAngle = -0.5 * Math.PI;
        for (let i = 0; i < data.length; i++) {
            const sliceAngle = (2 * Math.PI * (data[i] / totalData)) * startEffect;

            if (angles.length < data.length) {
                angles.push({ start: startAngle + Math.PI / 2, end: startAngle + sliceAngle + Math.PI / 2 });
            }
            ctx.strokeStyle = shadeColor(borderColor, -9 * partEffects[i]);
            if (i === currentHighlight) {
                redrawPart = { start: startAngle, end: startAngle + sliceAngle, color: colors[i] };
            }
            ctx.lineWidth = 2;
            ctx.lineCap = "round";
            ctx.fillStyle = shadeColor(colors[i], -9 * partEffects[i]);
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);

            ctx.arc(centerX, centerY, cornerRadius, startAngle - Math.PI, startAngle - Math.PI / 2);
            ctx.arc(centerX, centerY, radius * startEffect, startAngle, startAngle + sliceAngle);
            ctx.arc(centerX, centerY, cornerRadius, startAngle + sliceAngle + Math.PI / 2, startAngle + sliceAngle + Math.PI);

            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            startAngle += sliceAngle;
        }
        if (redrawPart !== null) {
            const colorLight = shadeColor(redrawPart.color, -7 * partEffects[currentHighlight]);

            ctx.strokeStyle = borderHighlightColor;
            ctx.lineWidth = 2 * partEffects[currentHighlight];
            ctx.lineCap = "round";
            ctx.fillStyle = colorLight;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius * startEffect, redrawPart.start, redrawPart.end);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    }

    function drawCard(mouseX, mouseY) {
        ctx.fillStyle = '#0000009f';
        let path = new Path2D();
        path.moveTo(mouseX, mouseY);
        path.lineTo(mouseX + 5, mouseY + 5);
        path.lineTo(mouseX + 5, mouseY - 5);
        ctx.fill(path);
        ctx.strokeStyle = '#00000000';
        ctx.beginPath();
        ctx.roundRect(mouseX + 5, mouseY - 20, 100, 35, 6);
        ctx.stroke();
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = '700 12px Arial';
        ctx.fontWeight = 'bold';
        ctx.fillText(names[currentHighlight], mouseX + 10, mouseY - 5);

        const text = Math.round(data[currentHighlight] / totalData * 1000) / 10 + '% - ' + data[currentHighlight] + ' votes';
        ctx.fillStyle = '#ffffff';
        ctx.font = '400 11px Arial';
        ctx.fillText(text, mouseX + 10, mouseY + 10);
    }

    drawPieChart();

    function calculateDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    function handleMouseMove(event) {
        const rect = canvas.getBoundingClientRect();
        mouseX = event.clientX - rect.left;
        mouseY = event.clientY - rect.top;
    }

    function calcMouse() {
        const dx = smoothX - centerX;
        const dy = smoothY - centerY;
        let mouseAngle = Math.atan2(dy, dx) + Math.PI / 2;
        if (mouseAngle < 0) {
            mouseAngle += 2 * Math.PI;
        }
        const distance = calculateDistance(dx, dy, 0, 0);
        currentHighlight = null;
        if (distance < radius) {
            canvas.style.cursor = 'pointer';
            angles.forEach((angle, index) => {
                if (mouseAngle > angle.start && mouseAngle < angle.end) {
                    currentHighlight = index;
                }
            })
        } else {
            canvas.style.cursor = 'default';
        }
    }

    function drawInfo() {
        ctx.fillStyle = textColor;
        ctx.font = '600 ' + 16 * startEffect + 'px Arial';
        ctx.fillText('Total votes: ' + totalData, canvas.width / dpr / 2 - 60, 20);

        let datas = [data];
        if (data.length > 3) {
            datas = [data.slice(0, 3), data.slice(3, data.length)];
        }
        for (let z = 0; z < datas.length; z++) {
            const offsetTop = z * 25 - 12;
            let data = datas[z];
            ctx.font = '500 ' + 12 * startEffect + 'px Arial';
            const start = (canvas.width / dpr / 2 - (data.length * 108) / 2 + 10) * startEffect;
            for (let i = 0; i < data.length; i++) {
                ctx.fillStyle = colors[z * 3 + i];
                ctx.strokeStyle = textColor;
                ctx.lineWidth = 1;
                ctx.fillRect(start + i * 108 * startEffect + 3, (offsetTop + 50) * startEffect, 10 * startEffect, 10 * startEffect);
                ctx.strokeRect(start + i * 108 * startEffect + 3, (offsetTop + 50) * startEffect, 10 * startEffect, 10 * startEffect);
                ctx.fillStyle = textColor;
                ctx.fillText(names[z * 3 + i] + ': ' + Math.round(data[i] / totalData * 1000) / 10 + '%', start + 16 + i * 108 * startEffect, (offsetTop + 60) * startEffect);
            }
        }
    }

    function tick() {
        smoothX += (mouseX - smoothX) * 0.1;
        smoothY += (mouseY - smoothY) * 0.1;

        if (animationTimeout > 0) {
            animationTimeout -= 1;
        }

        if (animationTimeout === 0) {
            if (startEffect < 1) {
                if (startEffect > 0.7) {
                    startEffect += (1 - startEffect) * 0.12;
                } else {
                    startEffect += (1 - startEffect) * 0.08;
                }
            }
        }

        for (let i = 0; i < partEffects.length; i++) {
            if (i === currentHighlight) {
                if (partEffects[i] < 1) {
                    partEffects[i] += 0.06;
                }
            } else {
                if (partEffects[i] > 0) {
                    partEffects[i] -= 0.06;
                }
            }
        }

        calcMouse();
        drawPieChart();
        if (currentHighlight !== null) {
            drawCard(smoothX, smoothY);
        }
        drawInfo();
        requestAnimationFrame(tick);
    }

    tick();
    canvas.addEventListener('mousemove', handleMouseMove);
    element.appendChild(canvas);
}