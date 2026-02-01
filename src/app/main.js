document.addEventListener('DOMContentLoaded', () => {
    const state = {
        face: 'face-1',
        eyes: 'eyes-1',
        mouth: 'mouth-1',
        hair: 'hair-1',
        colors: {
            skin: CharacterData.colors.skin[0],
            hair: CharacterData.colors.hair[0],
            eyes: CharacterData.colors.eyes[0],
            clothes: CharacterData.colors.clothes[0]
        }
    };

    const elements = {
        headGroup: document.getElementById('head-group'),
        eyesGroup: document.getElementById('eyes-group'),
        mouthGroup: document.getElementById('mouth-group'),
        hairGroup: document.getElementById('hair-group'),
        optionsPanel: document.getElementById('options-panel'),
        tabBtns: document.querySelectorAll('.tab-btn'),
        randomBtn: document.getElementById('random-btn'),
        exportBtn: document.getElementById('export-btn')
    };

    function renderCharacter() {
        const faceData = CharacterData.parts.face.find(p => p.id === state.face);
        const eyesData = CharacterData.parts.eyes.find(p => p.id === state.eyes);
        const mouthData = CharacterData.parts.mouth.find(p => p.id === state.mouth);
        const hairData = CharacterData.parts.hair.find(p => p.id === state.hair);

        elements.headGroup.innerHTML = faceData.path;
        elements.headGroup.style.color = state.colors.skin;

        elements.eyesGroup.innerHTML = eyesData.path;
        elements.eyesGroup.style.color = state.colors.eyes;

        elements.mouthGroup.innerHTML = mouthData.path;
        elements.mouthGroup.style.color = '#333';

        elements.hairGroup.innerHTML = hairData.path;
        elements.hairGroup.style.color = state.colors.hair;
    }

    function createOptionItem(category, item) {
        const div = document.createElement('div');
        div.className = `style-item ${state[category] === item.id ? 'active' : ''}`;
        div.innerHTML = `<span style="font-size: 0.7rem">${item.name}</span>`;
        div.addEventListener('click', () => {
            state[category] = item.id;
            updateUI();
            renderCharacter();
        });
        return div;
    }

    function createColorItem(category, color) {
        const div = document.createElement('div');
        div.className = `color-item ${state.colors[category] === color ? 'active' : ''}`;
        div.style.backgroundColor = color;
        div.addEventListener('click', () => {
            state.colors[category] = color;
            updateUI();
            renderCharacter();
        });
        return div;
    }

    function updateUI() {
        // Update tabs and panel content based on active tab
        const activeTab = document.querySelector('.tab-btn.active').dataset.category;
        renderOptions(activeTab);
    }

    function renderOptions(category) {
        elements.optionsPanel.innerHTML = '';

        if (category === 'colors') {
            ['skin', 'hair', 'eyes', 'clothes'].forEach(type => {
                const group = document.createElement('div');
                group.className = 'option-group';
                group.innerHTML = `<h3>${type} color</h3>`;
                const grid = document.createElement('div');
                grid.className = 'color-grid';
                CharacterData.colors[type].forEach(color => {
                    grid.appendChild(createColorItem(type, color));
                });
                group.appendChild(grid);
                elements.optionsPanel.appendChild(group);
            });
        } else {
            const group = document.createElement('div');
            group.className = 'option-group';
            group.innerHTML = `<h3>Select ${category}</h3>`;
            const grid = document.createElement('div');
            grid.className = 'style-grid';
            CharacterData.parts[category].forEach(item => {
                grid.appendChild(createOptionItem(category, item));
            });
            group.appendChild(grid);
            elements.optionsPanel.appendChild(group);
        }
    }

    elements.tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderOptions(btn.dataset.category);
        });
    });

    elements.randomBtn.addEventListener('click', () => {
        state.face = CharacterData.parts.face[Math.floor(Math.random() * CharacterData.parts.face.length)].id;
        state.eyes = CharacterData.parts.eyes[Math.floor(Math.random() * CharacterData.parts.eyes.length)].id;
        state.mouth = CharacterData.parts.mouth[Math.floor(Math.random() * CharacterData.parts.mouth.length)].id;
        state.hair = CharacterData.parts.hair[Math.floor(Math.random() * CharacterData.parts.hair.length)].id;

        state.colors.skin = CharacterData.colors.skin[Math.floor(Math.random() * CharacterData.colors.skin.length)];
        state.colors.hair = CharacterData.colors.hair[Math.floor(Math.random() * CharacterData.colors.hair.length)];

        updateUI();
        renderCharacter();
    });

    elements.exportBtn.addEventListener('click', () => {
        const svg = document.getElementById('character-svg');
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            canvas.width = 800;
            canvas.height = 1000;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, 800, 1000);
            const pngUrl = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.href = pngUrl;
            downloadLink.download = 'mypoly-character.png';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);
        };
        img.src = url;
    });

    // Initial render
    renderCharacter();
    renderOptions('face');
});
