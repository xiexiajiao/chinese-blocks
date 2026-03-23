/**
 * 运行时引擎 - 负责执行积木代码
 * 包含角色管理、动画执行、事件处理
 */

// ==================== 角色类 ====================
class Sprite {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        // 位置和方向
        this.x = 0;
        this.y = 0;
        this.direction = 90; // 90=右，0=上，180=下，270=左
        this.size = 100; // 大小百分比

        // 外观
        this.visible = true;
        this.colorEffect = 0;
        this.sayMessage = null;
        this.sayTimer = 0;

        // 绘制小猫角色（用 Canvas 绘制）
        this.drawCat = this.drawCat.bind(this);
    }

    // 转换为 Scratch 坐标（Canvas 坐标不同）
    toCanvasX(x) {
        return this.canvas.width / 2 + x;
    }

    toCanvasY(y) {
        return this.canvas.height / 2 - y;
    }

    // 移动
    move(steps) {
        const rad = (this.direction - 90) * Math.PI / 180;
        this.x += steps * Math.cos(rad);
        this.y += steps * Math.sin(rad);

        // 边界检测
        this.x = Math.max(-240, Math.min(240, this.x));
        this.y = Math.max(-180, Math.min(180, this.y));
    }

    // 旋转
    turn(degrees) {
        this.direction = (this.direction + degrees) % 360;
        if (this.direction < 0) this.direction += 360;
    }

    // 设置位置
    goto(x, y) {
        this.x = x;
        this.y = y;
    }

    // 设置方向
    setDirection(dir) {
        this.direction = dir % 360;
        if (this.direction < 0) this.direction += 360;
    }

    // 显示气泡
    say(message, duration = 2000) {
        this.sayMessage = message;
        this.sayTimer = Date.now() + duration;
    }

    // 清除气泡
    clearSay() {
        this.sayMessage = null;
    }

    // 绘制小猫
    drawCat() {
        if (!this.visible) return;

        const ctx = this.ctx;
        const cx = this.toCanvasX(this.x);
        const cy = this.toCanvasY(this.y);
        const scale = this.size / 100;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((this.direction - 90) * Math.PI / 180);
        ctx.scale(scale, scale);

        // 应用颜色效果
        if (this.colorEffect !== 0) {
            ctx.filter = `hue-rotate(${this.colorEffect}deg)`;
        }

        // 绘制小猫身体（简化的卡通猫）
        // 身体
        ctx.fillStyle = '#FFA500';
        ctx.beginPath();
        ctx.ellipse(0, 10, 30, 25, 0, 0, Math.PI * 2);
        ctx.fill();

        // 头
        ctx.beginPath();
        ctx.arc(0, -15, 22, 0, Math.PI * 2);
        ctx.fill();

        // 耳朵
        ctx.beginPath();
        ctx.moveTo(-15, -30);
        ctx.lineTo(-8, -45);
        ctx.lineTo(0, -35);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(15, -30);
        ctx.lineTo(8, -45);
        ctx.lineTo(0, -35);
        ctx.fill();

        // 内耳
        ctx.fillStyle = '#FFB6C1';
        ctx.beginPath();
        ctx.moveTo(-12, -32);
        ctx.lineTo(-7, -42);
        ctx.lineTo(-3, -34);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(12, -32);
        ctx.lineTo(7, -42);
        ctx.lineTo(3, -34);
        ctx.fill();

        // 眼睛
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.ellipse(-8, -18, 6, 7, 0, 0, Math.PI * 2);
        ctx.ellipse(8, -18, 6, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(-6, -17, 3, 0, Math.PI * 2);
        ctx.arc(6, -17, 3, 0, Math.PI * 2);
        ctx.fill();

        // 鼻子
        ctx.fillStyle = '#FF69B4';
        ctx.beginPath();
        ctx.moveTo(-3, -8);
        ctx.lineTo(3, -8);
        ctx.lineTo(0, -4);
        ctx.fill();

        // 嘴巴
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -4);
        ctx.lineTo(0, 0);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-5, 2);
        ctx.quadraticCurveTo(-3, 5, 0, 3);
        ctx.quadraticCurveTo(3, 5, 5, 2);
        ctx.stroke();

        // 胡须
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(-20, -3);
        ctx.moveTo(-10, 3);
        ctx.lineTo(-20, 3);
        ctx.moveTo(-10, 6);
        ctx.lineTo(-20, 9);
        ctx.moveTo(10, 0);
        ctx.lineTo(20, -3);
        ctx.moveTo(10, 3);
        ctx.lineTo(20, 3);
        ctx.moveTo(10, 6);
        ctx.lineTo(20, 9);
        ctx.stroke();

        // 尾巴
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(25, 15);
        ctx.quadraticCurveTo(40, 5, 35, -10);
        ctx.stroke();

        // 重置滤镜
        ctx.filter = 'none';
        ctx.restore();

        // 绘制说话气泡
        if (this.sayMessage && Date.now() < this.sayTimer) {
            this.drawSpeechBubble(cx, cy - 40 * scale, this.sayMessage);
        } else {
            this.sayMessage = null;
        }
    }

    // 绘制对话气泡
    drawSpeechBubble(x, y, text) {
        const ctx = this.ctx;
        ctx.font = '14px Arial';
        const metrics = ctx.measureText(text);
        const padding = 10;
        const bubbleWidth = metrics.width + padding * 2;
        const bubbleHeight = 30;

        ctx.save();

        // 气泡背景
        ctx.fillStyle = 'white';
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.roundRect(x - bubbleWidth / 2, y - bubbleHeight, bubbleWidth, bubbleHeight, 10);
        ctx.fill();
        ctx.stroke();

        // 小三角
        ctx.beginPath();
        ctx.moveTo(x - 5, y);
        ctx.lineTo(x + 5, y);
        ctx.lineTo(x, y + 8);
        ctx.fill();
        ctx.stroke();

        // 文字
        ctx.fillStyle = 'black';
        ctx.font = '14px Arial';
        ctx.fillText(text, x - metrics.width / 2, y - 10);

        ctx.restore();
    }

    // 更新位置显示
    updatePositionDisplay() {
        const display = document.getElementById('positionDisplay');
        if (display) {
            display.textContent = `位置：(${Math.round(this.x)}, ${Math.round(this.y)}) 方向：${Math.round(this.direction)}°`;
        }
    }
}

// ==================== 运行时引擎 ====================
class RuntimeEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.sprite = new Sprite(canvas, this.ctx);
        this.isRunning = false;
        this.shouldStop = false;

        // 双缓冲
        this.backBuffer = document.createElement('canvas');
        this.backBuffer.width = canvas.width;
        this.backBuffer.height = canvas.height;
        this.backCtx = this.backBuffer.getContext('2d');

        this.bindControls();
    }

    // 绑定控制事件
    bindControls() {
        // 大小滑块
        const sizeSlider = document.getElementById('sizeSlider');
        const sizeValue = document.getElementById('sizeValue');

        if (sizeSlider) {
            sizeSlider.addEventListener('input', (e) => {
                this.sprite.size = parseInt(e.target.value);
                sizeValue.textContent = this.sprite.size;
            });
        }

        // 显示/隐藏
        const showHide = document.getElementById('showHide');
        if (showHide) {
            showHide.addEventListener('change', (e) => {
                this.sprite.visible = e.target.checked;
            });
        }

        // 点击角色
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left - this.canvas.width / 2;
            const y = this.canvas.height / 2 - (e.clientY - rect.top);

            // 简单的点击检测
            const dx = x - this.sprite.x;
            const dy = y - this.sprite.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 50 * this.sprite.size / 100) {
                // 触发点击事件
                this.triggerEvent('clicked');
            }
        });
    }

    // 清除画布
    clear() {
        this.backCtx.fillStyle = '#f8f9fa';
        this.backCtx.fillRect(0, 0, this.backBuffer.width, this.backBuffer.height);

        // 绘制网格
        this.drawGrid();
    }

    // 绘制网格
    drawGrid() {
        const ctx = this.backCtx;
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;

        // 垂直线
        for (let x = 0; x <= this.backBuffer.width; x += 48) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.backBuffer.height);
            ctx.stroke();
        }

        // 水平线
        for (let y = 0; y <= this.backBuffer.height; y += 36) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.backBuffer.width, y);
            ctx.stroke();
        }

        // 中心线
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(this.backBuffer.width / 2, 0);
        ctx.lineTo(this.backBuffer.width / 2, this.backBuffer.height);
        ctx.moveTo(0, this.backBuffer.height / 2);
        ctx.lineTo(this.backBuffer.width, this.backBuffer.height / 2);
        ctx.stroke();
    }

    // 渲染到主画布
    render() {
        this.ctx.drawImage(this.backBuffer, 0, 0);
        this.sprite.drawCat();
        this.sprite.updatePositionDisplay();
    }

    // 完整渲染循环
    update() {
        this.clear();
        this.render();
        requestAnimationFrame(() => this.update());
    }

    // 等待函数（用于积木执行）
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 停止所有
    stop() {
        this.shouldStop = true;
    }

    // 重置
    reset() {
        this.stop();
        setTimeout(() => {
            this.sprite.x = 0;
            this.sprite.y = 0;
            this.sprite.direction = 90;
            this.sprite.size = 100;
            this.sprite.colorEffect = 0;
            this.sprite.visible = true;
            this.sprite.clearSay();
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

    // 执行积木链（由 main.js 调用）
    async executeBlockChain(block) {
        if (!block || this.shouldStop) return;

        this.isRunning = true;
        await this.executeBlock(block);

        // 执行下一个积木
        if (block.nextConnection) {
            const nextBlock = block.nextConnection.targetBlock();
            if (nextBlock) {
                await this.executeBlockChain(nextBlock);
            }
        }

        this.isRunning = false;
    }

    // 执行单个积木
    async executeBlock(block) {
        if (!block || this.shouldStop) return;

        const type = block.type;
        const sprite = this.sprite;

        // 获取数值的辅助函数
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

        // 获取子积木堆的辅助函数
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
            case 'motion_move_steps':
                const steps = getVal('STEPS', 10);
                sprite.move(steps);
                await this.wait(50);
                break;

            case 'motion_turn_right':
                const degreesR = getVal('DEGREES', 15);
                sprite.turn(degreesR);
                await this.wait(50);
                break;

            case 'motion_turn_left':
                const degreesL = getVal('DEGREES', 15);
                sprite.turn(-degreesL);
                await this.wait(50);
                break;

            case 'motion_goto_xy':
                const gotoX = getVal('X', 0);
                const gotoY = getVal('Y', 0);
                sprite.goto(gotoX, gotoY);
                await this.wait(50);
                break;

            case 'motion_set_x':
                const setX = getVal('X', 0);
                sprite.goto(setX, sprite.y);
                await this.wait(50);
                break;

            case 'motion_set_y':
                const setY = getVal('Y', 0);
                sprite.goto(sprite.x, setY);
                await this.wait(50);
                break;

            case 'motion_set_direction':
                const dir = getVal('DIRECTION', 90);
                sprite.setDirection(dir);
                await this.wait(50);
                break;

            case 'looks_say':
                const sayMsg = getVal('MESSAGE', '你好！');
                sprite.say(String(sayMsg), 2000);
                await this.wait(100);
                break;

            case 'looks_think':
                const thinkMsg = getVal('MESSAGE', '让我想想...');
                sprite.say(String(thinkMsg), 2000);
                await this.wait(100);
                break;

            case 'looks_change_color_effect':
                sprite.colorEffect = (sprite.colorEffect + 25) % 360;
                await this.wait(100);
                break;

            case 'looks_clear_graphic_effects':
                sprite.colorEffect = 0;
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
                // 简单处理：暂时跳过条件判断
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
                // 绿旗事件，继续执行后续积木
                break;
        }
    }
}

// 导出全局
window.RuntimeEngine = RuntimeEngine;
