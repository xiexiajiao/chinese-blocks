/**
 * 主程序 - 初始化 Blockly 和绑定事件
 * 包含项目管理、引导助手、Toast 提示
 */

let workspace = null;
let runtime = null;
let currentProject = null;
let guideStep = 1;
const totalGuideSteps = 6;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initBlockly();
    initRuntime();
    bindEvents();
    loadLastProject();
});

// ==================== 初始化 ====================

// 初始化 Blockly
function initBlockly() {
    workspace = Blockly.inject('blocklyDiv', {
        toolbox: document.getElementById('toolbox'),
        grid: {
            spacing: 25,
            length: 3,
            colour: '#e0e0e0',
            snap: true
        },
        zoom: {
            controls: true,
            wheel: true,
            startScale: 0.9,
            maxScale: 2,
            minScale: 0.5,
            scaleSpeed: 1.2
        },
        trashcan: true,
        collapse: false,
        comments: false,
        disable: true,
        scrollbars: true,
        move: {
            scrollbars: true,
            drag: true,
            wheel: false
        }
    });

    // 窗口大小变化时调整
    window.addEventListener('resize', function() {
        Blockly.svgResize(workspace);
    });
}

// 初始化运行时
function initRuntime() {
    const canvas = document.getElementById('stageCanvas');
    runtime = new RuntimeEngine(canvas);
    runtime.update();
}

// ==================== 事件绑定 ====================

function bindEvents() {
    // 控制按钮
    document.getElementById('runBtn').addEventListener('click', runProgram);
    document.getElementById('stopBtn').addEventListener('click', stopProgram);
    document.getElementById('resetBtn').addEventListener('click', resetProgram);

    // 项目按钮
    document.getElementById('newProjectBtn').addEventListener('click', newProject);
    document.getElementById('saveProjectBtn').addEventListener('click', showSaveModal);
    document.getElementById('loadProjectBtn').addEventListener('click', showLoadModal);

    // 助手按钮
    document.getElementById('helpBtn').addEventListener('click', showGuide);

    // 弹窗关闭
    document.getElementById('closeGuideBtn').addEventListener('click', hideGuide);
    document.getElementById('closeProjectBtn').addEventListener('click', hideProjectModal);

    // 引导导航
    document.getElementById('prevStepBtn').addEventListener('click', prevGuideStep);
    document.getElementById('nextStepBtn').addEventListener('click', nextGuideStep);

    // 保存确认
    document.getElementById('confirmSaveBtn').addEventListener('click', confirmSave);

    // 绿旗事件
    runtime.registerEvent('greenFlag', async function() {
        await runFromBlockly();
    });

    // 角色控制
    const sizeSlider = document.getElementById('sizeSlider');
    const sizeValue = document.getElementById('sizeValue');
    const showHide = document.getElementById('showHide');

    sizeSlider?.addEventListener('input', (e) => {
        if (runtime && runtime.sprite) {
            runtime.sprite.size = parseInt(e.target.value);
            sizeValue.textContent = runtime.sprite.size;
        }
    });

    showHide?.addEventListener('change', (e) => {
        if (runtime && runtime.sprite) {
            runtime.sprite.visible = e.target.checked;
        }
    });

    // 工作区变化时标记未保存
    workspace.addChangeListener(function(event) {
        if (event.type === Blockly.Events.BLOCK_CHANGE ||
            event.type === Blockly.Events.BLOCK_CREATE ||
            event.type === Blockly.Events.BLOCK_DELETE ||
            event.type === Blockly.Events.BLOCK_MOVE) {
            updateSaveStatus(false);
        }
    });

    // 键盘快捷键
    document.addEventListener('keydown', handleKeyDown);

    // 点击弹窗外部关闭
    document.getElementById('guideModal').addEventListener('click', function(e) {
        if (e.target === this) hideGuide();
    });
    document.getElementById('projectModal').addEventListener('click', function(e) {
        if (e.target === this) hideProjectModal();
    });
}

// ==================== 程序控制 ====================

function runProgram() {
    if (runtime.isRunning) return;
    runtime.triggerEvent('greenFlag');
}

function stopProgram() {
    runtime.stop();
    showToast('程序已停止', 'warning');
}

function resetProgram() {
    runtime.reset();
    showToast('已重置', 'warning');
}

async function runFromBlockly() {
    const topBlocks = workspace.getTopBlocks(true);
    const startBlocks = topBlocks.filter(b => b.type === 'event_when_green_flag');

    if (startBlocks.length === 0) {
        showToast('请先添加 "🚩 当绿旗被点击" 积木！', 'error');
        return;
    }

    for (const block of startBlocks) {
        runtime.executeBlockChain(block);
    }
}

// ==================== 项目管理 ====================

function getProjectList() {
    try {
        const list = localStorage.getItem('scratchProjects');
        return list ? JSON.parse(list) : [];
    } catch (e) {
        return [];
    }
}

function saveProjectList(projects) {
    localStorage.setItem('scratchProjects', JSON.stringify(projects));
}

function newProject() {
    if (workspace.getTopBlocks().length > 0) {
        if (!confirm('确定要新建项目吗？当前未保存的内容将会丢失。')) {
            return;
        }
    }
    workspace.clear();
    runtime.reset();
    currentProject = null;
    document.getElementById('projectName').textContent = '未命名项目';
    updateSaveStatus(false);
    showToast('已新建项目', 'success');
}

function showSaveModal() {
    document.getElementById('projectModalTitle').textContent = '💾 保存项目';
    document.getElementById('saveProjectView').style.display = 'block';
    document.getElementById('loadProjectView').style.display = 'none';
    document.getElementById('projectNameInput').value = currentProject || '';
    document.getElementById('projectModal').classList.add('show');
    document.getElementById('projectNameInput').focus();
}

function showLoadModal() {
    document.getElementById('projectModalTitle').textContent = '📂 打开项目';
    document.getElementById('saveProjectView').style.display = 'none';
    document.getElementById('loadProjectView').style.display = 'block';
    renderProjectList();
    document.getElementById('projectModal').classList.add('show');
}

function hideProjectModal() {
    document.getElementById('projectModal').classList.remove('show');
}

function confirmSave() {
    const name = document.getElementById('projectNameInput').value.trim() || '未命名项目';
    saveProjectToStorage(name);
    hideProjectModal();
}

function saveProjectToStorage(name) {
    const xml = Blockly.Xml.workspaceToDom(workspace);
    const xmlText = Blockly.Xml.domToText(xml);

    const projects = getProjectList();
    const timestamp = new Date().toLocaleString('zh-CN');

    // 查找是否已有同名项目
    const existingIndex = projects.findIndex(p => p.name === name);

    const projectData = {
        name: name,
        content: xmlText,
        updated: timestamp
    };

    if (existingIndex >= 0) {
        projects[existingIndex] = projectData;
    } else {
        projects.push(projectData);
    }

    saveProjectList(projects);

    currentProject = name;
    document.getElementById('projectName').textContent = name;
    updateSaveStatus(true);
    showToast('项目已保存', 'success');
}

function renderProjectList() {
    const list = document.getElementById('projectList');
    const projects = getProjectList();

    if (projects.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">暂无保存的项目</p>';
        return;
    }

    list.innerHTML = projects.map((p, index) => `
        <div class="project-item" data-index="${index}">
            <div>
                <div class="project-item-name">${escapeHtml(p.name)}</div>
                <div class="project-item-date">${p.updated}</div>
            </div>
            <button class="project-item-delete" data-index="${index}" title="删除">×</button>
        </div>
    `).join('');

    // 绑定点击事件
    list.querySelectorAll('.project-item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (e.target.classList.contains('project-item-delete')) return;
            const index = parseInt(this.dataset.index);
            loadProject(index);
        });
    });

    list.querySelectorAll('.project-item-delete').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            deleteProject(parseInt(this.dataset.index));
        });
    });
}

function loadProject(index) {
    const projects = getProjectList();
    if (projects[index]) {
        const xml = Blockly.Xml.textToDom(projects[index].content);
        Blockly.Xml.domToWorkspace(xml, workspace);
        currentProject = projects[index].name;
        document.getElementById('projectName').textContent = currentProject;
        updateSaveStatus(true);
        hideProjectModal();
        showToast(`已加载：${currentProject}`, 'success');
    }
}

function deleteProject(index) {
    const projects = getProjectList();
    if (projects[index]) {
        if (confirm(`确定要删除 "${projects[index].name}" 吗？`)) {
            projects.splice(index, 1);
            saveProjectList(projects);
            renderProjectList();
            showToast('项目已删除', 'warning');

            if (currentProject === projects[index]?.name) {
                currentProject = null;
            }
        }
    }
}

function loadLastProject() {
    // 首次加载时不自动加载，保持空白
    updateSaveStatus(true);
}

function updateSaveStatus(saved) {
    const status = document.getElementById('saveStatus');
    if (saved) {
        status.className = 'save-status saved';
    } else {
        status.className = 'save-status unsaved';
    }
}

// ==================== Toast 提示 ====================

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// ==================== 引导助手 ====================

function showGuide() {
    document.getElementById('guideModal').classList.add('show');
    updateGuideStep(1);
}

function hideGuide() {
    document.getElementById('guideModal').classList.remove('show');
}

function updateGuideStep(step) {
    guideStep = step;
    document.querySelectorAll('.guide-step').forEach(el => {
        el.classList.remove('active');
        if (parseInt(el.dataset.step) === step) {
            el.classList.add('active');
        }
    });
    document.getElementById('stepIndicator').textContent = `${step} / ${totalGuideSteps}`;
    document.getElementById('prevStepBtn').disabled = step === 1;
    document.getElementById('nextStepBtn').textContent = step === totalGuideSteps ? '完成' : '下一步';
}

function prevGuideStep() {
    if (guideStep > 1) {
        updateGuideStep(guideStep - 1);
    }
}

function nextGuideStep() {
    if (guideStep < totalGuideSteps) {
        updateGuideStep(guideStep + 1);
    } else {
        hideGuide();
        showToast('加油！开始你的编程之旅吧！', 'success');
    }
}

// ==================== 工具函数 ====================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function handleKeyDown(e) {
    // Ctrl+S 保存
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        showSaveModal();
    }

    // Ctrl+O 打开
    if (e.ctrlKey && e.key === 'o') {
        e.preventDefault();
        showLoadModal();
    }

    // Ctrl+N 新建
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        newProject();
    }

    // Ctrl+Enter 运行
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        runProgram();
    }

    // Escape 停止
    if (e.key === 'Escape') {
        runtime.stop();
        hideGuide();
        hideProjectModal();
    }
}

// 页面关闭前提示
window.addEventListener('beforeunload', function(e) {
    const status = document.getElementById('saveStatus');
    if (status.classList.contains('unsaved')) {
        e.preventDefault();
        e.returnValue = '';
    }
});
