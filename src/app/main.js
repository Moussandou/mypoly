import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Character } from './character-3d.js';

// --- SCENE SETUP ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1e293b); // Fallback color
// Custom Fog for depth
scene.fog = new THREE.Fog(0x0f172a, 5, 20);

// Camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(2, 2, 4);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
container.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(5, 10, 7);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;
scene.add(dirLight);

const backLight = new THREE.DirectionalLight(0x38bdf8, 0.5); // Blue rim light
backLight.position.set(-5, 2, -5);
scene.add(backLight);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 2;
controls.maxDistance = 8;
controls.target.set(0, 0, 0);

// Ground
const groundGeo = new THREE.CylinderGeometry(3, 3, 0.2, 8);
const groundMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    flatShading: true,
    roughness: 0.8
});
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.position.y = -0.9;
ground.receiveShadow = true;
scene.add(ground);

// --- CHARACTER ---
const character = new Character();
scene.add(character.mesh);

// --- ANIMATION LOOP ---
function animate() {
    requestAnimationFrame(animate);

    // Idle Animation: simple floating/breathing
    const time = Date.now() * 0.001;
    character.mesh.position.y = Math.sin(time) * 0.05 + 0.05;
    character.mesh.rotation.y = Math.sin(time * 0.5) * 0.05;

    controls.update();
    renderer.render(scene, camera);
}
animate();

// --- RESIZE ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- UI LOGIC ---
const uiState = {
    height: 1,
    build: 1,
    headSize: 1
};

const panel = document.getElementById('panel-content');

function createSlider(id, label, min, max, step, value, onChange) {
    const div = document.createElement('div');
    div.className = 'slider-container';
    div.innerHTML = `<label><span>${label}</span> <span id="${id}-val">${value}</span></label>`;

    const input = document.createElement('input');
    input.type = 'range';
    input.min = min;
    input.max = max;
    input.step = step;
    input.value = value;

    input.addEventListener('input', (e) => {
        document.getElementById(`${id}-val`).innerText = e.target.value;
        onChange(parseFloat(e.target.value));
    });

    div.appendChild(input);
    return div;
}

function createColorPicker(label, colors, onSelect) {
    const div = document.createElement('div');
    div.className = 'control-group';
    div.innerHTML = `<h3>${label}</h3>`;

    const grid = document.createElement('div');
    grid.className = 'color-grid';

    colors.forEach(col => {
        const btn = document.createElement('div');
        btn.className = 'color-btn';
        btn.style.backgroundColor = col;
        btn.addEventListener('click', () => {
            document.querySelectorAll(`.color-btn[data-group="${label}"]`).forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            onSelect(col);
        });
        btn.dataset.group = label;
        grid.appendChild(btn);
    });

    div.appendChild(grid);
    return div;
}

function createSelector(label, options, onSelect) {
    const div = document.createElement('div');
    div.className = 'control-group';
    div.innerHTML = `<h3>${label}</h3>`;

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.gap = '10px';

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'cyber-btn secondary';
        btn.style.flex = '1';
        btn.style.padding = '0.5rem';
        btn.innerText = opt.name;
        btn.addEventListener('click', () => {
            onSelect(opt.id);
        });
        container.appendChild(btn);
    });

    div.appendChild(container);
    return div;
}

// Render UI Panels
function renderCategory(category) {
    panel.innerHTML = '';

    if (category === 'body') {
        panel.appendChild(createSlider('height', 'Height', 0.8, 1.2, 0.01, uiState.height, (v) => {
            uiState.height = v;
            character.updateScale(uiState);
        }));
        panel.appendChild(createSlider('build', 'Build (Width)', 0.8, 1.5, 0.01, uiState.build, (v) => {
            uiState.build = v;
            character.updateScale(uiState);
        }));
    }
    else if (category === 'head') {
        panel.appendChild(createSlider('headSize', 'Head Size', 0.8, 1.5, 0.01, uiState.headSize, (v) => {
            uiState.headSize = v;
            character.updateScale(uiState);
        }));

        panel.appendChild(createSelector('Head Shape', [
            { id: 'shape1', name: 'Round' },
            { id: 'shape2', name: 'Box' },
            { id: 'shape3', name: 'Sharp' }
        ], (id) => character.setHeadShape(id)));

        panel.appendChild(createSelector('Hairstyle', [
            { id: 'style1', name: 'Messy' },
            { id: 'style2', name: 'Flat' },
            { id: 'style3', name: 'Mohawk' }
        ], (id) => character.createHair(id)));
    }
    else if (category === 'colors') {
        const skinColors = ['#ffdbac', '#f1c27d', '#e0ac69', '#8d5524', '#3e2723'];
        const clothesColors = ['#f8fafc', '#1e293b', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];

        panel.appendChild(createColorPicker('Skin Tone', skinColors, (c) => character.setColor('skin', c)));
        panel.appendChild(createColorPicker('Shirt Color', clothesColors, (c) => character.setColor('shirt', c)));
        panel.appendChild(createColorPicker('Pants Color', clothesColors, (c) => character.setColor('pants', c)));
        panel.appendChild(createColorPicker('Shoes Color', clothesColors, (c) => character.setColor('shoes', c)));
    }
}

// Tab Switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderCategory(btn.dataset.category);
    });
});

// Initial Render
renderCategory('body');

// Randomize
document.getElementById('random-btn').addEventListener('click', () => {
    // Logic to randomise all sliders and colors
    // For demo purposes (simple version)
    const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const randColor = () => '#' + new THREE.Color(Math.random(), Math.random(), Math.random()).getHexString();

    character.setColor('shirt', randColor());
    character.setColor('pants', randColor());
    character.setColor('skin', r(['#ffdbac', '#8d5524']));
    character.setHeadShape(r(['shape1', 'shape2', 'shape3']));
});
