/**
 * 运行时引擎 - 飞机主题
 * 包含飞机绘制、飞行动画、特效系统
 */

// ==================== 飞机类 ====================
class Airplane {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        // 位置和方向
        this.x = 0;
        this.y = 0;
        this.z = 0; // 高度（用缩放模拟）
        this.direction = 90; // 90=右，0=上，180=下，270=左
        this.size = 100;

        // 飞行状态
        this.speed = 5;
        this.maxSpeed = 15;
        this.minSpeed = 2;
        this.isAccelerating = false;
        this.isDecelerating = false;

        // 动作状态
        this.isRolling = false;
        this.rollAngle = 0;
        this.isFlipping = false;
        this.flipAngle = 0;
        this.flipDirection = 0;

        // 外观
        this.visible = true;
        this.colorIndex = 0;
        this.colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'];
        this.currentColor = this.colors[0];

        // 特效
        this.effects = {
            smoke: false,
            fire: false,
            rainbow: false
        };
        this.particles = [];

        // 说话气泡
        this.sayMessage = null;
        this.sayTimer = 0;

        // 尾迹
        this.trail = [];
    }

    // 转换为 Scratch 坐标
    toCanvasX(x) {
        return this.canvas.width / 2 + x;
    }

    toCanvasY(y) {
        return this.canvas.height / 2 - y;
    }

    // 向前飞行
    moveForward(distance) {
        const rad = (this.direction - 90) * Math.PI / 180;
        const steps = distance / 10;
        for (let i = 0; i < steps; i++) {
            this.x += Math.cos(rad) * 2;
            this.y += Math.sin(rad) * 2;
            this.addTrail();
        }
        this.boundCheck();
    }

    // 向左转弯
    turnLeft(degrees) {
        this.direction = (this.direction - degrees) % 360;
        if (this.direction < 0) this.direction += 360;
    }

    // 向右转弯
    turnRight(degrees) {
        this.direction = (this.direction + degrees) % 360;
        if (this.direction < 0) this.direction += 360;
    }

    // 爬升
    climb(height) {
        this.z = Math.min(100, this.z + height / 10);
        this.y += height / 5;
        this.boundCheck();
    }

    // 俯冲
    dive(height) {
        this.z = Math.max(-50, this.z - height / 10);
        this.y -= height / 5;
        this.boundCheck();
    }

    // 设置位置
    goto(x, y) {
        this.x = x;
        this.y = y;
    }

    // 边界检测
    boundCheck() {
        this.x = Math.max(-240, Math.min(240, this.x));
        this.y = Math.max(-180, Math.min(180, this.y));
    }

    // 加速
    speedUp() {
        this.speed = Math.min(this.maxSpeed, this.speed + 1);
    }

    // 减速
    slowDown() {
        this.speed = Math.max(this.minSpeed, this.speed - 1);
    }

    // 桶滚
    async barrelRoll() {
        this.isRolling = true;
        for (let i = 0; i <= 360; i += 30) {
            this.rollAngle = i;
            await this.wait(50);
        }
        this.isRolling = false;
        this.rollAngle = 0;
    }

    // 后空翻
    async backLoop() {
        this.isFlipping = true;
        this.flipDirection = 1;
        for (let i = 0; i <= 360; i += 30) {
            this.flipAngle = i;
            await this.wait(50);
        }
        this.isFlipping = false;
        this.flipAngle = 0;
    }

    // 前空翻
    async frontFlip() {
        this.isFlipping = true;
        this.flipDirection = -1;
        for (let i = 0; i <= 360; i += 30) {
            this.flipAngle = i;
            await this.wait(50);
        }
        this.isFlipping = false;
        this.flipAngle = 0;
    }

    // 悬停
    async hover(duration) {
        const startTime = Date.now();
        while (Date.now() - startTime < duration * 1000) {
            // 上下轻微浮动
            this.y += Math.sin(Date.now() / 200) * 0.5;
            await this.wait(50);
        }
    }

    // 添加尾迹
    addTrail() {
        this.trail.push({
            x: this.x,
            y: this.y,
            direction: this.direction,
            z: this.z,
            life: 20,
            color: this.effects.rainbow ?
                `hsl(${Date.now() / 10 % 360}, 100%, 50%)` :
                this.currentColor
        });
        if (this.trail.length > 50) {
            this.trail.shift();
        }
    }

    // 添加粒子特效
    addParticle(type) {
        this.particles.push({
            type: type,
            x: this.x,
            y: this.y,
            vx: (Math.random() - 0.5) * 2 - Math.cos((this.direction - 90) * Math.PI / 180) * 3,
            vy: (Math.random() - 0.5) * 2 - Math.sin((this.direction - 90) * Math.PI / 180) * 3,
            life: 30 + Math.random() * 20,
            maxLife: 50
        });
    }

    // 等待
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 显示气泡
    say(message, duration = 2000) {
        this.sayMessage = message;
        this.sayTimer = Date.now() + duration;
    }

    // 改变颜色
    changeColor() {
        this.colorIndex = (this.colorIndex + 1) % this.colors.length;
        this.currentColor = this.colors[this.colorIndex];
    }

    // 绘制飞机
    draw() {
        if (!this.visible) return;

        const ctx = this.ctx;
        const cx = this.toCanvasX(this.x);
        const cy = this.toCanvasY(this.y);
        const scale = this.size / 100 * (1 + this.z / 200);

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((this.direction - 90) * Math.PI / 180);

        // 桶滚旋转
        if (this.isRolling) {
            ctx.rotate(this.rollAngle * Math.PI / 180);
        }

        // 空翻旋转
        if (this.isFlipping) {
            ctx.scale(Math.cos(this.flipAngle * Math.PI / 180), 1);
        }

        ctx.scale(scale, scale);

        // 飞机阴影（模拟 3D 效果）
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(5, 15, 40, 15, 0, 0, Math.PI * 2);
        ctx.fill();

        // 机翼阴影
        ctx.beginPath();
        ctx.moveTo(-10, 10);
        ctx.lineTo(-35, 25);
        ctx.lineTo(5, 25);
        ctx.lineTo(15, 10);
        ctx.fill();

        // 机身主体
        ctx.fillStyle = this.currentColor;
        ctx.beginPath();
        ctx.ellipse(0, 0, 35, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        // 机身渐变高光
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.ellipse(-5, -3, 25, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // 主机翼
        ctx.fillStyle = this.currentColor;
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(-20, 35);
        ctx.lineTo(0, 35);
        ctx.lineTo(10, 0);
        ctx.fill();

        // 左机翼
        ctx.beginPath();
        ctx.moveTo(-5, 0);
        ctx.lineTo(-35, 30);
        ctx.lineTo(-20, 30);
        ctx.lineTo(0, 0);
        ctx.fill();

        // 右机翼
        ctx.beginPath();
        ctx.moveTo(5, 0);
        ctx.lineTo(20, 30);
        ctx.lineTo(35, 30);
        ctx.lineTo(10, 0);
        ctx.fill();

        // 机翼边缘
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-20, 35);
        ctx.lineTo(20, 35);
        ctx.stroke();

        // 驾驶舱
        ctx.fillStyle = '#87CEEB';
        ctx.beginPath();
        ctx.ellipse(5, -5, 12, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // 驾驶舱边框
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(5, -5, 12, 6, 0, 0, Math.PI * 2);
        ctx.stroke();

        // 座舱盖高光
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.ellipse(3, -6, 6, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // 机头
        ctx.fillStyle = this.currentColor;
        ctx.beginPath();
        ctx.moveTo(25, 0);
        ctx.lineTo(45, 0);
        ctx.quadraticCurveTo(40, -5, 35, 0);
        ctx.quadraticCurveTo(40, 5, 25, 0);
        ctx.fill();

        // 机头尖端（雷达罩）
        ctx.fillStyle = '#ff4444';
        ctx.beginPath();
        ctx.moveTo(35, 0);
        ctx.lineTo(45, 0);
        ctx.quadraticCurveTo(42, -3, 38, 0);
        ctx.quadraticCurveTo(42, 3, 35, 0);
        ctx.fill();

        // 尾翼
        ctx.fillStyle = this.currentColor;
        ctx.beginPath();
        ctx.moveTo(-30, 0);
        ctx.lineTo(-45, 0);
        ctx.lineTo(-40, 15);
        ctx.fill();

        // 垂直尾翼
        ctx.beginPath();
        ctx.moveTo(-35, -5);
        ctx.lineTo(-42, -15);
        ctx.lineTo(-38, -5);
        ctx.fill();

        // 引擎喷口
        ctx.fillStyle = '#666';
        ctx.beginPath();
        ctx.ellipse(-32, 8, 5, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#444';
        ctx.beginPath();
        ctx.ellipse(-32, -8, 5, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // 引擎火焰（如果加速）
        if (this.isAccelerating || this.effects.fire) {
            const flameLength = 15 + Math.random() * 10;
            ctx.fillStyle = '#ff6600';
            ctx.beginPath();
            ctx.moveTo(-35, 5);
            ctx.lineTo(-35 - flameLength, 0);
            ctx.lineTo(-35, -5);
            ctx.fill();

            ctx.fillStyle = '#ffcc00';
            ctx.beginPath();
            ctx.moveTo(-35, 3);
            ctx.lineTo(-35 - flameLength / 2, 0);
            ctx.lineTo(-35, -3);
            ctx.fill();
        }

        ctx.restore();

        // 绘制尾迹
        this.drawTrail();

        // 绘制粒子特效
        this.drawParticles();

        // 绘制说话气泡
        if (this.sayMessage && Date.now() < this.sayTimer) {
            this.drawSpeechBubble(cx, cy - 50 * scale, this.sayMessage);
        } else {
            this.sayMessage = null;
        }
    }

    // 绘制尾迹
    drawTrail() {
        for (let i = this.trail.length - 1; i >= 0; i--) {
            const point = this.trail[i];
            point.life--;

            const ctx = this.ctx;
            const cx = this.toCanvasX(point.x);
            const cy = this.toCanvasY(point.y);
            const scale = this.size / 100 * (1 + point.z / 200) * 0.3;

            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate((point.direction - 90) * Math.PI / 180);
            ctx.scale(scale, scale);
            ctx.globalAlpha = point.life / 20;

            ctx.fillStyle = point.color;
            ctx.beginPath();
            ctx.arc(0, 0, 5, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();

            if (point.life <= 0) {
                this.trail.splice(i, 1);
            }
        }
    }

    // 绘制粒子
    drawParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.life--;
            p.x += p.vx;
            p.y += p.vy;

            const ctx = this.ctx;
            const cx = this.toCanvasX(p.x);
            const cy = this.toCanvasY(p.y);

            ctx.save();
            ctx.globalAlpha = p.life / p.maxLife;

            if (p.type === 'smoke') {
                ctx.fillStyle = '#888';
                ctx.beginPath();
                ctx.arc(cx, cy, 8 * (1 - p.life / p.maxLife) + 5, 0, Math.PI * 2);
                ctx.fill();
            } else if (p.type === 'fire') {
                const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 15);
                gradient.addColorStop(0, '#ffcc00');
                gradient.addColorStop(0.5, '#ff6600');
                gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(cx, cy, 15, 0, Math.PI * 2);
                ctx.fill();
            } else if (p.type === 'rainbow') {
                const hue = (Date.now() / 10 + i * 10) % 360;
                ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
                ctx.beginPath();
                ctx.arc(cx, cy, 6, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();

            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    // 绘制说话气泡
    drawSpeechBubble(x, y, text) {
        const ctx = this.ctx;
        ctx.font = '14px Arial';
        const metrics = ctx.measureText(text);
        const padding = 10;
        const bubbleWidth = metrics.width + padding * 2;
        const bubbleHeight = 30;

        ctx.save();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.roundRect(x - bubbleWidth / 2, y - bubbleHeight, bubbleWidth, bubbleHeight, 10);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x - 5, y);
        ctx.lineTo(x + 5, y);
        ctx.lineTo(x, y + 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = 'black';
        ctx.font = '14px Arial';
        ctx.fillText(text, x - metrics.width / 2, y - 10);
        ctx.restore();
    }

    // 更新状态
    update() {
        // 更新尾迹
        if (this.speed > 3) {
            this.addTrail();
        }

        // 添加特效粒子
        if (this.effects.smoke) {
            for (let i = 0; i < 2; i++) {
                this.addParticle('smoke');
            }
        }
        if (this.effects.fire) {
            this.addParticle('fire');
        }
        if (this.effects.rainbow) {
            this.addParticle('rainbow');
        }
    }

    // 更新位置显示
    updatePositionDisplay() {
        const display = document.getElementById('positionDisplay');
        if (display) {
            display.textContent = `位置：(${Math.round(this.x)}, ${Math.round(this.y)}) 高度：${Math.round(this.z)}m 速度：${this.speed}马赫 方向：${Math.round(this.direction)}°`;
        }
    }
}

// ==================== 运行时引擎 ====================
class RuntimeEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.airplane = new Airplane(canvas, this.ctx);
        this.isRunning = false;
        this.shouldStop = false;

        // 双缓冲
        this.backBuffer = document.createElement('canvas');
        this.backBuffer.width = canvas.width;
        this.backBuffer.height = canvas.height;
        this.backCtx = this.backBuffer.getContext('2d');

        // 云层
        this.clouds = [];
        this.initClouds();

        this.bindControls();
    }

    // 初始化云层
    initClouds() {
        for (let i = 0; i < 10; i++) {
            this.clouds.push({
                x: Math.random() * 480 - 240,
                y: Math.random() * 360 - 180,
                size: 30 + Math.random() * 30,
                speed: 0.2 + Math.random() * 0.3
            });
        }
    }

    // 绑定控制事件
    bindControls() {
        const sizeSlider = document.getElementById('sizeSlider');
        const sizeValue = document.getElementById('sizeValue');

        sizeSlider?.addEventListener('input', (e) => {
            if (this.airplane) {
                this.airplane.size = parseInt(e.target.value);
                sizeValue.textContent = this.airplane.size;
            }
        });

        const showHide = document.getElementById('showHide');
        showHide?.addEventListener('change', (e) => {
            if (this.airplane) {
                this.airplane.visible = e.target.checked;
            }
        });

        // 点击飞机
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left - this.canvas.width / 2;
            const y = this.canvas.height / 2 - (e.clientY - rect.top);

            const dx = x - this.airplane.x;
            const dy = y - this.airplane.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 50 * this.airplane.size / 100) {
                this.triggerEvent('clicked');
            }
        });

        // 键盘事件
        document.addEventListener('keydown', (e) => {
            const keyMap = {
                'ArrowUp': 'up',
                'ArrowDown': 'down',
                'ArrowLeft': 'left',
                'ArrowRight': 'right',
                ' ': 'space',
                'f': 'f',
                's': 's'
            };
            const key = keyMap[e.key];
            if (key) {
                this.triggerEvent('keyPressed', key);
            }
        });
    }

    // 清除画布
    clear() {
        this.backCtx.fillStyle = '#87CEEB';
        this.backCtx.fillRect(0, 0, this.backBuffer.width, this.backBuffer.height);

        // 绘制天空渐变
        const gradient = this.backCtx.createLinearGradient(0, 0, 0, this.backBuffer.height);
        gradient.addColorStop(0, '#1E90FF');
        gradient.addColorStop(0.5, '#87CEEB');
        gradient.addColorStop(1, '#E0F6FF');
        this.backCtx.fillStyle = gradient;
        this.backCtx.fillRect(0, 0, this.backBuffer.width, this.backBuffer.height);

        // 绘制云层
        this.drawClouds();

        // 绘制网格（淡色）
        this.drawGrid();
    }

    // 绘制云层
    drawClouds() {
        const ctx = this.backCtx;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';

        this.clouds.forEach(cloud => {
            // 云层移动
            cloud.x += cloud.speed;
            if (cloud.x > 240) cloud.x = -240;

            const cx = this.canvas.width / 2 + cloud.x;
            const cy = this.canvas.height / 2 - cloud.y;

            ctx.beginPath();
            ctx.arc(cx, cy, cloud.size, 0, Math.PI * 2);
            ctx.arc(cx + cloud.size * 0.8, cy - cloud.size * 0.3, cloud.size * 0.7, 0, Math.PI * 2);
            ctx.arc(cx - cloud.size * 0.8, cy - cloud.size * 0.3, cloud.size * 0.7, 0, Math.PI * 2);
            ctx.arc(cx + cloud.size * 0.3, cy + cloud.size * 0.2, cloud.size * 0.5, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    // 绘制网格
    drawGrid() {
        const ctx = this.backCtx;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;

        for (let x = 0; x <= this.backBuffer.width; x += 48) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.backBuffer.height);
            ctx.stroke();
        }

        for (let y = 0; y <= this.backBuffer.height; y += 36) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.backBuffer.width, y);
            ctx.stroke();
        }

        // 中心线
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(this.backBuffer.width / 2, 0);
        ctx.lineTo(this.backBuffer.width / 2, this.backBuffer.height);
        ctx.moveTo(0, this.backBuffer.height / 2);
        ctx.lineTo(this.backBuffer.width, this.backBuffer.height / 2);
        ctx.stroke();
    }

    // 渲染
    render() {
        this.ctx.drawImage(this.backBuffer, 0, 0);
        this.airplane.update();
        this.airplane.draw();
        this.airplane.updatePositionDisplay();
    }

    // 更新循环
    update() {
        this.clear();
        this.render();
        requestAnimationFrame(() => this.update());
    }

    // 等待
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 停止
    stop() {
        this.shouldStop = true;
    }

    // 重置
    reset() {
        this.stop();
        setTimeout(() => {
            this.airplane.x = 0;
            this.airplane.y = 0;
            this.airplane.z = 0;
            this.airplane.direction = 90;
            this.airplane.speed = 5;
            this.airplane.size = 100;
            this.airplane.visible = true;
            this.airplane.effects = { smoke: false, fire: false, rainbow: false };
            this.airplane.particles = [];
            this.airplane.trail = [];
            this.airplane.sayMessage = null;
            this.shouldStop = false;
            this.isRunning = false;
        }, 100);
    }

    // 事件系统
    events = {
        'greenFlag': [],
        'clicked': [],
        'keyPressed': {}
    };

    registerEvent(name, callback) {
        if (name === 'keyPressed') {
            this.events.keyPressed = this.events.keyPressed || {};
        } else {
            this.events[name] = this.events[name] || [];
            this.events[name].push(callback);
        }
    }

    triggerEvent(name, key = null) {
        if (name === 'keyPressed' && key) {
            if (this.events.keyPressed[key]) {
                this.events.keyPressed[key].forEach(cb => cb());
            }
        } else if (this.events[name]) {
            this.events[name].forEach(cb => cb());
        }
    }

    // 执行积木链
    async executeBlockChain(block) {
        if (!block || this.shouldStop) return;
        this.isRunning = true;
        await this.executeBlock(block);
        this.isRunning = false;
    }

    // 执行单个积木
    async executeBlock(block) {
        if (!block || this.shouldStop) return;

        const type = block.type;
        const airplane = this.airplane;

        const getVal = (inputName, defaultValue) => {
            try {
                const input = block.getInput(inputName);
                if (!input) return defaultValue;
                const targetBlock = input.connection?.targetBlock();
                if (targetBlock) {
                    const field = targetBlock.inputList[0]?.fieldRow[0];
                    if (field && field.getValue) {
                        const val = field.getValue();
                        return typeof val === 'number' ? val : parseFloat(val) || defaultValue;
                    }
                }
                const field = input.fieldRow[0];
                if (field && field.getValue) {
                    const val = field.getValue();
                    return typeof val === 'number' ? val : parseFloat(val) || defaultValue;
                }
                return defaultValue;
            } catch (e) {
                return defaultValue;
            }
        };

        const getStack = (inputName) => {
            try {
                const input = block.getInput(inputName);
                if (input && input.connection) {
                    return input.connection.targetBlock();
                }
            } catch (e) {}
            return null;
        };

        switch (type) {
            case 'flight_move_forward':
                const distance = getVal('DISTANCE', 10);
                airplane.moveForward(distance);
                await this.wait(50);
                break;

            case 'flight_turn_left':
                const degreesL = getVal('DEGREES', 15);
                airplane.turnLeft(degreesL);
                await this.wait(50);
                break;

            case 'flight_turn_right':
                const degreesR = getVal('DEGREES', 15);
                airplane.turnRight(degreesR);
                await this.wait(50);
                break;

            case 'flight_climb':
                const heightC = getVal('HEIGHT', 10);
                airplane.climb(heightC);
                await this.wait(50);
                break;

            case 'flight_dive':
                const heightD = getVal('HEIGHT', 10);
                airplane.dive(heightD);
                await this.wait(50);
                break;

            case 'flight_goto':
                const gotoX = getVal('X', 0);
                const gotoY = getVal('Y', 0);
                airplane.goto(gotoX, gotoY);
                await this.wait(50);
                break;

            case 'action_barrel_roll':
                await airplane.barrelRoll();
                break;

            case 'action_loop':
                await airplane.backLoop();
                break;

            case 'action_flip':
                await airplane.frontFlip();
                break;

            case 'action_hover':
                const hoverDuration = getVal('DURATION', 1);
                await airplane.hover(hoverDuration);
                break;

            case 'action_speed_up':
                airplane.speedUp();
                airplane.isAccelerating = true;
                await this.wait(500);
                airplane.isAccelerating = false;
                break;

            case 'action_slow_down':
                airplane.slowDown();
                airplane.isDecelerating = true;
                await this.wait(500);
                airplane.isDecelerating = false;
                break;

            case 'effect_smoke':
                airplane.effects.smoke = true;
                await this.wait(1000);
                airplane.effects.smoke = false;
                break;

            case 'effect_fire':
                airplane.effects.fire = true;
                await this.wait(1000);
                airplane.effects.fire = false;
                break;

            case 'effect_rainbow':
                airplane.effects.rainbow = true;
                await this.wait(2000);
                airplane.effects.rainbow = false;
                break;

            case 'effect_clear':
                airplane.effects = { smoke: false, fire: false, rainbow: false };
                airplane.particles = [];
                break;

            case 'looks_say':
                const msg = getVal('MESSAGE', '你好！');
                airplane.say(String(msg), 2000);
                await this.wait(100);
                break;

            case 'looks_change_color':
                airplane.changeColor();
                await this.wait(100);
                break;

            case 'control_wait':
                const duration = getVal('DURATION', 1) * 1000;
                await this.wait(duration);
                break;

            case 'control_repeat':
                const times = getVal('TIMES', 1);
                const repeatStack = getStack('SUBSTACK');
                for (let i = 0; i < times && !this.shouldStop; i++) {
                    await this.executeBlockChain(repeatStack);
                }
                break;

            case 'control_forever':
                const foreverStack = getStack('SUBSTACK');
                while (!this.shouldStop) {
                    await this.executeBlockChain(foreverStack);
                    await this.wait(10);
                }
                break;

            case 'control_if':
                const ifStack = getStack('SUBSTACK');
                await this.executeBlockChain(ifStack);
                break;

            case 'control_if_else':
                const elseStack = getStack('SUBSTACK2');
                await this.executeBlockChain(elseStack);
                break;

            case 'control_stop':
                this.shouldStop = true;
                break;

            case 'event_when_green_flag':
                break;
        }
    }
}

window.RuntimeEngine = RuntimeEngine;
