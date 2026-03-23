/**
 * 自定义积木定义 - 全中文图形化编程
 * 适合 11 岁儿童使用
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
            .appendField("👆 当角色被点击");
        this.setNextStatement(true);
        this.setColour(60);
        this.setTooltip("当角色被鼠标点击时开始执行");
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
                ["A", "a"],
                ["B", "b"],
                ["C", "c"],
                ["D", "d"]
            ]), "KEY");
        this.setNextStatement(true);
        this.setColour(60);
        this.setTooltip("当按下指定键盘时开始执行");
        this.setHelpUrl("");
    }
};

// ==================== 运动类积木 ====================
Blockly.Blocks['motion_move_steps'] = {
    init: function() {
        this.appendValueInput("STEPS")
            .setCheck("Number")
            .appendField("📍 移动");
        this.appendDummyInput()
            .appendField("步");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(210);
        this.setTooltip("让角色向当前方向移动指定步数");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['motion_turn_right'] = {
    init: function() {
        this.appendValueInput("DEGREES")
            .setCheck("Number")
            .appendField("🔃 顺时针旋转");
        this.appendDummyInput()
            .appendField("度");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(210);
        this.setTooltip("让角色顺时针旋转指定角度");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['motion_turn_left'] = {
    init: function() {
        this.appendValueInput("DEGREES")
            .setCheck("Number")
            .appendField("🔄 逆时针旋转");
        this.appendDummyInput()
            .appendField("度");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(210);
        this.setTooltip("让角色逆时针旋转指定角度");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['motion_goto_xy'] = {
    init: function() {
        this.appendValueInput("X")
            .setCheck("Number")
            .appendField("🎯 移到 x:");
        this.appendValueInput("Y")
            .setCheck("Number")
            .appendField("y:");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(210);
        this.setTooltip("让角色移动到指定坐标位置");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['motion_set_x'] = {
    init: function() {
        this.appendValueInput("X")
            .setCheck("Number")
            .appendField("📍 将 x 坐标设为");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(210);
        this.setTooltip("设置角色的 x 坐标");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['motion_set_y'] = {
    init: function() {
        this.appendValueInput("Y")
            .setCheck("Number")
            .appendField("📍 将 y 坐标设为");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(210);
        this.setTooltip("设置角色的 y 坐标");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['motion_set_direction'] = {
    init: function() {
        this.appendValueInput("DIRECTION")
            .setCheck("Number")
            .appendField("🧭 面向方向");
        this.appendDummyInput()
            .appendField("度");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(210);
        this.setTooltip("设置角色的朝向（90=右，0=上，180=下，270=左）");
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
        this.setTooltip("让角色显示一个说话气泡");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['looks_think'] = {
    init: function() {
        this.appendValueInput("MESSAGE")
            .setCheck(null)
            .appendField("💭 想");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(300);
        this.setTooltip("让角色显示一个思考气泡");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['looks_change_color_effect'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("🎨 将颜色效果增加 25");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(300);
        this.setTooltip("改变角色的颜色效果");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['looks_clear_graphic_effects'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("🧹 清除图形效果");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(300);
        this.setTooltip("清除所有图形效果，恢复原样");
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
            .appendField("🔁 重复执行");
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

Blockly.Blocks['math_not'] = {
    init: function() {
        this.appendValueInput("BOOL")
            .setCheck("Boolean")
            .appendField("❌ 不成立");
        this.setOutput(true, "Boolean");
        this.setColour(230);
        this.setTooltip("逻辑非运算");
        this.setHelpUrl("");
    }
};

// ==================== 自定义函数 ====================
Blockly.Blocks['custom_function'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("⭐ 定义函数")
            .appendField(new Blockly.FieldTextInput("我的函数"), "NAME");
        this.appendStatementInput("SUBSTACK")
            .setCheck(null);
        this.setColour(290);
        this.setTooltip("创建一个可复用的函数");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['call_function'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("▶️ 执行")
            .appendField(new Blockly.FieldTextInput("我的函数"), "NAME");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(290);
        this.setTooltip("执行已定义的函数");
        this.setHelpUrl("");
    }
};
