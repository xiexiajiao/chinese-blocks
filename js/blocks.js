/**
 * 自定义积木定义 - 飞机主题
 * 适合儿童使用的游戏化编程
 */

// ==================== 事件类积木 ====================
Blockly.Blocks['event_when_green_flag'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("🚩 当绿旗被点击");
        this.setNextStatement(true);
        this.setColour(60);
        this.setTooltip("当点击绿旗时开始执行");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['event_when_clicked'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("👆 当飞机被点击");
        this.setNextStatement(true);
        this.setColour(60);
        this.setTooltip("当飞机被鼠标点击时开始执行");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['event_when_key_pressed'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("⌨️ 当按下")
            .appendField(new Blockly.FieldDropdown([
                ["空格", "space"],
                ["↑ 上箭头", "up"],
                ["↓ 下箭头", "down"],
                ["← 左箭头", "left"],
                ["→ 右箭头", "right"],
                ["F 加速", "f"],
                ["S 减速", "s"]
            ]), "KEY");
        this.setNextStatement(true);
        this.setColour(60);
        this.setTooltip("当按下指定键盘时开始执行");
        this.setHelpUrl("");
    }
};

// ==================== 飞行控制类积木 ====================
Blockly.Blocks['flight_move_forward'] = {
    init: function() {
        this.appendValueInput("DISTANCE")
            .setCheck("Number")
            .appendField("✈️ 向前飞行");
        this.appendDummyInput()
            .appendField("米");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(210);
        this.setTooltip("让飞机向前飞行指定距离");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['flight_turn_left'] = {
    init: function() {
        this.appendValueInput("DEGREES")
            .setCheck("Number")
            .appendField("🔄 向左转弯");
        this.appendDummyInput()
            .appendField("度");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(210);
        this.setTooltip("让飞机向左转弯指定角度");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['flight_turn_right'] = {
    init: function() {
        this.appendValueInput("DEGREES")
            .setCheck("Number")
            .appendField("🔃 向右转弯");
        this.appendDummyInput()
            .appendField("度");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(210);
        this.setTooltip("让飞机向右转弯指定角度");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['flight_climb'] = {
    init: function() {
        this.appendValueInput("HEIGHT")
            .setCheck("Number")
            .appendField("📈 爬升");
        this.appendDummyInput()
            .appendField("米");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(210);
        this.setTooltip("让飞机向上爬升");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['flight_dive'] = {
    init: function() {
        this.appendValueInput("HEIGHT")
            .setCheck("Number")
            .appendField("📉 俯冲");
        this.appendDummyInput()
            .appendField("米");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(210);
        this.setTooltip("让飞机向下俯冲");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['flight_goto'] = {
    init: function() {
        this.appendValueInput("X")
            .setCheck("Number")
            .appendField("🎯 飞到 x:");
        this.appendValueInput("Y")
            .setCheck("Number")
            .appendField("y:");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(210);
        this.setTooltip("让飞机飞到指定坐标");
        this.setHelpUrl("");
    }
};

// ==================== 飞行动作类积木 ====================
Blockly.Blocks['action_barrel_roll'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("🌀 桶滚机动");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(290);
        this.setTooltip("让飞机做一个帅气的桶滚动作");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['action_loop'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("⭕ 后空翻");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(290);
        this.setTooltip("让飞机做一个后空翻动作");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['action_flip'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("🔁 前空翻");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(290);
        this.setTooltip("让飞机做一个前空翻动作");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['action_hover'] = {
    init: function() {
        this.appendValueInput("DURATION")
            .setCheck("Number")
            .appendField("🚁 悬停");
        this.appendDummyInput()
            .appendField("秒");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(290);
        this.setTooltip("让飞机在空中悬停");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['action_speed_up'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("💨 加速飞行");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(290);
        this.setTooltip("让飞机加速飞行");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['action_slow_down'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("🐢 减速飞行");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(290);
        this.setTooltip("让飞机减速飞行");
        this.setHelpUrl("");
    }
};

// ==================== 特效类积木 ====================
Blockly.Blocks['effect_smoke'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("💨 喷射烟雾");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(300);
        this.setTooltip("让飞机尾部喷射烟雾");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['effect_fire'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("🔥 喷射火焰");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(300);
        this.setTooltip("让飞机尾部喷射火焰");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['effect_rainbow'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("🌈 彩虹尾迹");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(300);
        this.setTooltip("让飞机喷出彩虹尾迹");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['effect_clear'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("🧹 清除特效");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(300);
        this.setTooltip("清除所有特效");
        this.setHelpUrl("");
    }
};

// ==================== 外观类积木 ====================
Blockly.Blocks['looks_say'] = {
    init: function() {
        this.appendValueInput("MESSAGE")
            .setCheck(null)
            .appendField("💬 说");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(300);
        this.setTooltip("让飞机显示一个说话气泡");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['looks_change_color'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("🎨 改变飞机颜色");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(300);
        this.setTooltip("改变飞机的颜色");
        this.setHelpUrl("");
    }
};

// ==================== 控制类积木 ====================
Blockly.Blocks['control_wait'] = {
    init: function() {
        this.appendValueInput("DURATION")
            .setCheck("Number")
            .appendField("⏱️ 等待");
        this.appendDummyInput()
            .appendField("秒");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(30);
        this.setTooltip("等待指定的秒数后继续执行");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['control_repeat'] = {
    init: function() {
        this.appendValueInput("TIMES")
            .setCheck("Number")
            .appendField("🔁 重复");
        this.appendDummyInput()
            .appendField("次");
        this.appendStatementInput("SUBSTACK")
            .setCheck(null);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(30);
        this.setTooltip("重复执行内部的积木指定次数");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['control_forever'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("🔁 无限循环");
        this.appendStatementInput("SUBSTACK")
            .setCheck(null);
        this.setPreviousStatement(true);
        this.setColour(30);
        this.setTooltip("无限重复执行内部的积木");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['control_if'] = {
    init: function() {
        this.appendValueInput("CONDITION")
            .setCheck("Boolean")
            .appendField("❓ 如果");
        this.appendStatementInput("SUBSTACK")
            .setCheck(null);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(30);
        this.setTooltip("如果条件为真，执行内部的积木");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['control_if_else'] = {
    init: function() {
        this.appendValueInput("CONDITION")
            .setCheck("Boolean")
            .appendField("❓ 如果");
        this.appendStatementInput("SUBSTACK")
            .setCheck(null);
        this.appendDummyInput()
            .appendField("否则");
        this.appendStatementInput("SUBSTACK2")
            .setCheck(null);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(30);
        this.setTooltip("如果条件为真执行第一部分，否则执行第二部分");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['control_stop'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("⏹️ 停止全部");
        this.setPreviousStatement(true);
        this.setColour(30);
        this.setTooltip("停止所有正在运行的脚本");
        this.setHelpUrl("");
    }
};

// ==================== 数字与逻辑类积木 ====================
Blockly.Blocks['math_number'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldNumber(0, null, null, 1), "NUM");
        this.setOutput(true, "Number");
        this.setColour(230);
        this.setTooltip("一个数字");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['math_arithmetic'] = {
    init: function() {
        this.appendValueInput("A")
            .setCheck("Number")
            .appendField("");
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["+", "ADD"],
                ["-", "SUBTRACT"],
                ["×", "MULTIPLY"],
                ["÷", "DIVIDE"],
                ["^", "POWER"]
            ]), "OP");
        this.appendValueInput("B")
            .setCheck("Number");
        this.setOutput(true, "Number");
        this.setColour(230);
        this.setTooltip("对两个数字进行算术运算");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['math_random_int'] = {
    init: function() {
        this.appendValueInput("FROM")
            .setCheck("Number")
            .appendField("🎲 随机");
        this.appendValueInput("TO")
            .setCheck("Number")
            .appendField("到");
        this.setOutput(true, "Number");
        this.setColour(230);
        this.setTooltip("生成一个指定范围内的随机数");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['math_compare'] = {
    init: function() {
        this.appendValueInput("A")
            .setCheck("Number")
            .appendField("🔢");
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["=", "EQ"],
                ["≠", "NEQ"],
                [">", "GT"],
                ["<", "LT"],
                ["≥", "GE"],
                ["≤", "LE"]
            ]), "OP");
        this.appendValueInput("B")
            .setCheck("Number");
        this.setOutput(true, "Boolean");
        this.setColour(230);
        this.setTooltip("比较两个数字");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['math_and_or'] = {
    init: function() {
        this.appendValueInput("A")
            .setCheck("Boolean")
            .appendField("🔗");
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["且", "AND"],
                ["或", "OR"]
            ]), "OP");
        this.appendValueInput("B")
            .setCheck("Boolean");
        this.setOutput(true, "Boolean");
        this.setColour(230);
        this.setTooltip("逻辑与/或运算");
        this.setHelpUrl("");
    }
};

// ==================== 传感器类积木 ====================
Blockly.Blocks['sensor_altitude'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("📏 当前高度");
        this.setOutput(true, "Number");
        this.setColour(120);
        this.setTooltip("获取飞机当前高度");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['sensor_speed'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("💨 当前速度");
        this.setOutput(true, "Number");
        this.setColour(120);
        this.setTooltip("获取飞机当前速度");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['sensor_direction'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("🧭 当前方向");
        this.setOutput(true, "Number");
        this.setColour(120);
        this.setTooltip("获取飞机当前飞行方向（度）");
        this.setHelpUrl("");
    }
};
