const workspace = document.getElementById('workspace');
const emptyState = document.getElementById('emptyState');
const imageContainer = document.getElementById('imageContainer');
const mainImage = document.getElementById('mainImage');
const canvasOverlay = document.getElementById('canvasOverlay');
const toolbar = document.getElementById('toolbar');
const blurSlider = document.getElementById('blurSlider');
const zoomSlider = document.getElementById('zoomSlider');
const snapToggle = document.getElementById('snapToggle');
const revealAnimSelect = document.getElementById('revealAnimSelect');

const btnEdit = document.getElementById('btnEdit');
const btnPresent = document.getElementById('btnPresent');
const btnClear = document.getElementById('btnClear');

const btnRect = document.getElementById('btnRect');
const btnCircle = document.getElementById('btnCircle');
const bgColorPicker = document.getElementById('bgColorPicker');
const colorSwatches = document.querySelectorAll('.color-swatch');

const toast = document.getElementById('toast');

const contextMenu = document.getElementById('contextMenu');
const editMenuItems = document.getElementById('editMenuItems');
const presentMenuItems = document.getElementById('presentMenuItems');
const menuDuplicate = document.getElementById('menuDuplicate');
const menuDelete = document.getElementById('menuDelete');
const menuStopPresent = document.getElementById('menuStopPresent');

let mode = 'edit';
let isDrawing = false;
let isDragging = false;
let isResizing = false;
let resizingHandle = null;
let draggedElement = null;
let startX, startY;
let offsetX, offsetY;
let startWidth, startHeight, startLeft, startTop;
let currentBlurBox = null;
let blurIntensity = 20;
let currentScale = 1;
let selectedSegment = null;

let currentShape = 'rect'; // 'rect' or 'circle'

// --- Shape & Background Management ---
function setShape(shape) {
    currentShape = shape;
    btnRect.classList.toggle('active', shape === 'rect');
    btnCircle.classList.toggle('active', shape === 'circle');
}

function setBgColor(color) {
    document.documentElement.style.setProperty('--workspace-bg', color);
    bgColorPicker.value = color;
    colorSwatches.forEach(s => {
        s.classList.toggle('active', s.dataset.color === color);
    });
    saveSettings();
}

btnRect.addEventListener('click', () => setShape('rect'));
btnCircle.addEventListener('click', () => setShape('circle'));

colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => setBgColor(swatch.dataset.color));
});

bgColorPicker.addEventListener('input', (e) => setBgColor(e.target.value));

// --- Hotkeys ---
window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (e.target.tagName === 'INPUT' && e.target.type !== 'range') return;

    if (key === 'r') setShape('rect');
    if (key === 'c') setShape('circle');
    if (key === ' ') {
        e.preventDefault();
        setMode(mode === 'edit' ? 'present' : 'edit');
    }
});

// --- Settings Persistence ---
function saveSettings() {
    const settings = {
        bgColor: getComputedStyle(document.documentElement).getPropertyValue('--workspace-bg').trim(),
        zoom: zoomSlider.value,
        blur: blurSlider.value,
        snap: snapToggle.checked,
        revealAnim: revealAnimSelect.value
    };
    localStorage.setItem('softreveal_settings', JSON.stringify(settings));
}

function loadSettings() {
    const saved = localStorage.getItem('softreveal_settings');
    if (saved) {
        try {
            const settings = JSON.parse(saved);
            if (settings.bgColor) setBgColor(settings.bgColor);
            if (settings.zoom) {
                zoomSlider.value = settings.zoom;
                currentScale = parseFloat(settings.zoom);
                updateImageScale();
            }
            if (settings.blur) {
                blurSlider.value = settings.blur;
                blurIntensity = settings.blur;
            }
            if (settings.snap !== undefined) {
                snapToggle.checked = settings.snap;
            }
            if (settings.revealAnim) {
                revealAnimSelect.value = settings.revealAnim;
            }
        } catch (e) {
            console.error("Failed to load settings", e);
        }
    }
}

// --- UI Utilities ---
function showToast(message) {
    toast.textContent = message;
    toast.style.display = 'block';
    // The animation takes 2s, we reset display after it finished
    toast.style.animation = 'none';
    toast.offsetHeight; // trigger reflow
    toast.style.animation = null;

    setTimeout(() => {
        toast.style.display = 'none';
    }, 2000);
}

// --- Mode Management ---
function setMode(newMode) {
    mode = newMode;
    workspace.classList.toggle('reveal-mode', mode === 'present');
    btnEdit.classList.toggle('active', mode === 'edit');
    btnPresent.classList.toggle('active', mode === 'present');

    const header = document.querySelector('header');
    if (mode === 'present') {
        header.classList.add('hidden');
        toolbar.classList.add('hidden');
        showToast('Right-click and choose "Stop Present" to exit');
    } else {
        header.classList.remove('hidden');
        toolbar.classList.remove('hidden');
        // Revert all revealed segments
        document.querySelectorAll('.blur-segment').forEach(s => {
            s.classList.remove('revealing');
            s.className = s.className.split(' ').filter(c => !c.startsWith('reveal-')).join(' ');
        });
    }
    hideContextMenu();
}

btnEdit.addEventListener('click', () => setMode('edit'));
btnPresent.addEventListener('click', () => setMode('present'));
menuStopPresent.addEventListener('click', () => setMode('edit'));

btnClear.addEventListener('click', () => {
    document.querySelectorAll('.blur-segment').forEach(s => s.remove());
});

// --- Zoom & Image Scaling ---
zoomSlider.addEventListener('input', (e) => {
    currentScale = parseFloat(e.target.value);
    updateImageScale();
    saveSettings();
});

function updateImageScale() {
    mainImage.style.transform = `scale(${currentScale})`;
    canvasOverlay.style.transform = `scale(${currentScale})`;
}

// --- Blur & Snap ---
blurSlider.addEventListener('input', (e) => {
    blurIntensity = e.target.value;
    document.querySelectorAll('.blur-segment').forEach(seg => {
        seg.style.backdropFilter = `blur(${blurIntensity}px)`;
        seg.style.webkitBackdropFilter = `blur(${blurIntensity}px)`;
    });
    saveSettings();
});

snapToggle.addEventListener('change', () => {
    saveSettings();
});

revealAnimSelect.addEventListener('change', () => {
    saveSettings();
});

// --- Image Loading ---
function loadImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        mainImage.src = e.target.result;
        emptyState.style.display = 'none';
        imageContainer.style.display = 'flex';
        toolbar.style.display = 'flex';
        document.querySelectorAll('.blur-segment').forEach(s => s.remove());
        // Reset zoom on new image
        currentScale = 1;
        zoomSlider.value = 1;
        imageContainer.style.transform = 'scale(1)';
    };
    reader.readAsDataURL(file);
}

window.addEventListener('paste', (e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) loadImage(items[i].getAsFile());
    }
});

workspace.addEventListener('dragover', (e) => e.preventDefault());
workspace.addEventListener('drop', (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.indexOf('image') !== -1) loadImage(files[0]);
});

// --- Snapping Logic ---
const SNAP_THRESHOLD = 10;
function getSnappingPos(x, y, width, height, excludeEl) {
    if (!snapToggle.checked) return { x, y };

    const segments = Array.from(document.querySelectorAll('.blur-segment')).filter(el => el !== excludeEl);
    let snappedX = x;
    let snappedY = y;

    const edgesX = [0, canvasOverlay.clientWidth - width];
    const edgesY = [0, canvasOverlay.clientHeight - height];

    segments.forEach(seg => {
        const r = {
            left: parseFloat(seg.style.left),
            top: parseFloat(seg.style.top),
            width: parseFloat(seg.style.width),
            height: parseFloat(seg.style.height)
        };
        edgesX.push(r.left, r.left + r.width, r.left - width, r.left + r.width - width);
        edgesY.push(r.top, r.top + r.height, r.top - height, r.top + r.height - height);
    });

    for (let ex of edgesX) {
        if (Math.abs(x - ex) < SNAP_THRESHOLD) { snappedX = ex; break; }
    }
    for (let ey of edgesY) {
        if (Math.abs(y - ey) < SNAP_THRESHOLD) { snappedY = ey; break; }
    }

    return { x: snappedX, y: snappedY };
}

// --- Context Menu Handlers ---
function showContextMenu(x, y, segment = null) {
    selectedSegment = segment;
    contextMenu.style.display = 'flex';
    contextMenu.style.left = Math.min(x, window.innerWidth - 200) + 'px';
    contextMenu.style.top = Math.min(y, window.innerHeight - 100) + 'px';

    if (mode === 'present') {
        editMenuItems.style.display = 'none';
        presentMenuItems.style.display = 'block';
    } else {
        editMenuItems.style.display = segment ? 'block' : 'none';
        presentMenuItems.style.display = 'none';
        if (!segment) contextMenu.style.display = 'none';
    }
}

function hideContextMenu() {
    contextMenu.style.display = 'none';
    selectedSegment = null;
}

window.addEventListener('click', (e) => {
    if (!contextMenu.contains(e.target)) hideContextMenu();
});

window.addEventListener('contextmenu', (e) => {
    if (mode === 'present') {
        e.preventDefault();
        showContextMenu(e.clientX, e.clientY);
    } else if (e.target.classList.contains('blur-segment')) {
        e.preventDefault();
        showContextMenu(e.clientX, e.clientY, e.target);
    } else {
        hideContextMenu();
    }
});

menuDelete.addEventListener('click', () => {
    if (selectedSegment) {
        selectedSegment.remove();
        hideContextMenu();
    }
});

menuDuplicate.addEventListener('click', () => {
    if (selectedSegment) {
        const clone = selectedSegment.cloneNode(true);
        clone.style.left = (parseFloat(selectedSegment.style.left) + 20) + 'px';
        clone.style.top = (parseFloat(selectedSegment.style.top) + 20) + 'px';
        // Re-attach event listeners for clone
        attachSegmentListeners(clone);
        canvasOverlay.appendChild(clone);
        hideContextMenu();
    }
});

function attachSegmentListeners(segment) {
    // Add resize handles
    const positions = [
        { type: 'tl', class: 'corner tl' }, { type: 'tr', class: 'corner tr' },
        { type: 'bl', class: 'corner bl' }, { type: 'br', class: 'corner br' },
        { type: 'l', class: 'side v l' }, { type: 'r', class: 'side v r' },
        { type: 't', class: 'side h t' }, { type: 'b', class: 'side h b' }
    ];

    positions.forEach(pos => {
        const handle = document.createElement('div');
        handle.className = `resize-handle ${pos.class}`;
        handle.dataset.handle = pos.type;
        segment.appendChild(handle);
    });

    segment.addEventListener('click', (e) => {
        if (mode === 'present') {
            const anim = revealAnimSelect.value;
            segment.classList.add('revealing');
            segment.classList.add(`reveal-${anim}`);
        }
    });
}

// --- Interaction Handler ---
canvasOverlay.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return; // Only left click

    const rect = canvasOverlay.getBoundingClientRect();
    const x = (e.clientX - rect.left) / currentScale;
    const y = (e.clientY - rect.top) / currentScale;

    if (mode === 'present') return;

    // Check if clicking a resize handle
    if (e.target.classList.contains('resize-handle')) {
        isResizing = true;
        resizingHandle = e.target.dataset.handle;
        draggedElement = e.target.parentElement;
        startX = x;
        startY = y;
        startWidth = parseFloat(draggedElement.style.width);
        startHeight = parseFloat(draggedElement.style.height);
        startLeft = parseFloat(draggedElement.style.left);
        startTop = parseFloat(draggedElement.style.top);
        return;
    }

    // Check if clicking an existing segment to drag
    const target = e.target;
    if (target.classList.contains('blur-segment')) {
        isDragging = true;
        draggedElement = target;
        draggedElement.classList.add('dragging');
        offsetX = x - parseFloat(draggedElement.style.left);
        offsetY = y - parseFloat(draggedElement.style.top);
        return;
    }

    // Otherwise, start drawing new segment
    isDrawing = true;
    startX = x;
    startY = y;
    currentBlurBox = document.createElement('div');
    currentBlurBox.className = `selection-box ${currentShape === 'circle' ? 'circle' : ''}`;
    canvasOverlay.appendChild(currentBlurBox);
});

window.addEventListener('mousemove', (e) => {
    const rect = canvasOverlay.getBoundingClientRect();
    const x = (e.clientX - rect.left) / currentScale;
    const y = (e.clientY - rect.top) / currentScale;

    // Bound checking (relative to current scale)
    const boundsX = Math.max(0, Math.min(canvasOverlay.clientWidth, x));
    const boundsY = Math.max(0, Math.min(canvasOverlay.clientHeight, y));

    if (isResizing && draggedElement) {
        const dx = boundsX - startX;
        const dy = boundsY - startY;

        switch (resizingHandle) {
            case 'r':
                draggedElement.style.width = Math.max(10, startWidth + dx) + 'px';
                break;
            case 'l':
                const newWidthL = Math.max(10, startWidth - dx);
                draggedElement.style.left = (startLeft + startWidth - newWidthL) + 'px';
                draggedElement.style.width = newWidthL + 'px';
                break;
            case 'b':
                draggedElement.style.height = Math.max(10, startHeight + dy) + 'px';
                break;
            case 't':
                const newHeightT = Math.max(10, startHeight - dy);
                draggedElement.style.top = (startTop + startHeight - newHeightT) + 'px';
                draggedElement.style.height = newHeightT + 'px';
                break;
            case 'br':
                draggedElement.style.width = Math.max(10, startWidth + dx) + 'px';
                draggedElement.style.height = Math.max(10, startHeight + dy) + 'px';
                break;
            case 'bl':
                const nwBL = Math.max(10, startWidth - dx);
                draggedElement.style.left = (startLeft + startWidth - nwBL) + 'px';
                draggedElement.style.width = nwBL + 'px';
                draggedElement.style.height = Math.max(10, startHeight + dy) + 'px';
                break;
            case 'tr':
                draggedElement.style.width = Math.max(10, startWidth + dx) + 'px';
                const nhTR = Math.max(10, startHeight - dy);
                draggedElement.style.top = (startTop + startHeight - nhTR) + 'px';
                draggedElement.style.height = nhTR + 'px';
                break;
            case 'tl':
                const nwTL = Math.max(10, startWidth - dx);
                const nhTL = Math.max(10, startHeight - dy);
                draggedElement.style.left = (startLeft + startWidth - nwTL) + 'px';
                draggedElement.style.width = nwTL + 'px';
                draggedElement.style.top = (startTop + startHeight - nhTL) + 'px';
                draggedElement.style.height = nhTL + 'px';
                break;
        }
    }

    if (isDragging && draggedElement && !isResizing) {
        let newX = boundsX - offsetX;
        let newY = boundsY - offsetY;

        const snapped = getSnappingPos(newX, newY, parseFloat(draggedElement.style.width), parseFloat(draggedElement.style.height), draggedElement);

        draggedElement.style.left = snapped.x + 'px';
        draggedElement.style.top = snapped.y + 'px';
    }

    if (isDrawing && currentBlurBox) {
        const left = Math.min(startX, boundsX);
        const top = Math.min(startY, boundsY);
        const width = Math.abs(boundsX - startX);
        const height = Math.abs(boundsY - startY);

        currentBlurBox.style.left = left + 'px';
        currentBlurBox.style.top = top + 'px';
        currentBlurBox.style.width = width + 'px';
        currentBlurBox.style.height = height + 'px';
    }
});

window.addEventListener('mouseup', () => {
    if (isResizing) {
        isResizing = false;
        resizingHandle = null;
        draggedElement = null;
    }

    if (isDragging && draggedElement) {
        draggedElement.classList.remove('dragging');
        isDragging = false;
        draggedElement = null;
    }

    if (isDrawing && currentBlurBox) {
        isDrawing = false;
        const width = parseFloat(currentBlurBox.style.width);
        const height = parseFloat(currentBlurBox.style.height);

        if (width > 5 && height > 5) {
            const segment = document.createElement('div');
            segment.className = `blur-segment ${currentBlurBox.classList.contains('circle') ? 'circle' : ''}`;
            segment.style.left = currentBlurBox.style.left;
            segment.style.top = currentBlurBox.style.top;
            segment.style.width = currentBlurBox.style.width;
            segment.style.height = currentBlurBox.style.height;
            segment.style.backdropFilter = `blur(${blurIntensity}px)`;
            segment.style.webkitBackdropFilter = `blur(${blurIntensity}px)`;

            attachSegmentListeners(segment);

            canvasOverlay.appendChild(segment);
        }
        currentBlurBox.remove();
        currentBlurBox = null;
    }
});

// --- Initialization ---
loadSettings();
if (mainImage.src && !mainImage.src.endsWith('index.html')) {
    imageContainer.style.display = 'block';
    emptyState.style.display = 'none';
    toolbar.style.display = 'flex';
}
