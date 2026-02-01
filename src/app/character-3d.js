import * as THREE from 'three';

export class Character {
    constructor() {
        this.mesh = new THREE.Group();
        this.materials = {};
        this.parts = {};

        this.initMaterials();
        this.buildCharacter();
    }

    initMaterials() {
        const flatMat = (color) => new THREE.MeshStandardMaterial({
            color: color,
            flatShading: true,
            roughness: 0.7,
            metalness: 0.1
        });

        this.materials = {
            skin: flatMat(0xffdbac),
            shirt: flatMat(0x3b82f6),
            pants: flatMat(0x1e293b),
            hair: flatMat(0x2c1608),
            shoes: flatMat(0x111111)
        };
    }

    buildCharacter() {
        // --- TORSO ---
        const torsoGeo = new THREE.CylinderGeometry(0.3, 0.25, 0.7, 5); // Hexagonal low poly feel
        const torso = new THREE.Mesh(torsoGeo, this.materials.shirt);
        torso.position.y = 0.35;
        this.parts.torso = torso;
        this.mesh.add(torso);

        // --- HEAD GROUP ---
        this.parts.headGroup = new THREE.Group();
        this.parts.headGroup.position.y = 0.8; // Neck height
        this.mesh.add(this.parts.headGroup);

        // Head Base
        const headGeo = new THREE.IcosahedronGeometry(0.25, 0); // Low poly sphere
        const head = new THREE.Mesh(headGeo, this.materials.skin);
        this.parts.head = head;
        this.parts.headGroup.add(head);

        // Eyes (Simple Boxes)
        const eyeGeo = new THREE.BoxGeometry(0.05, 0.05, 0.02);
        const eyeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });

        const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
        leftEye.position.set(-0.1, 0.05, 0.22);
        this.parts.headGroup.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
        rightEye.position.set(0.1, 0.05, 0.22);
        this.parts.headGroup.add(rightEye);

        // Hair (Stacked Boxes specific style)
        this.parts.hairGroup = new THREE.Group();
        this.parts.headGroup.add(this.parts.hairGroup);
        this.createHair('style1');


        // --- LEGS ---
        const legGeo = new THREE.CylinderGeometry(0.08, 0.06, 0.8, 5);

        const leftLeg = new THREE.Mesh(legGeo, this.materials.pants);
        leftLeg.position.set(-0.15, -0.4, 0);
        this.parts.leftLeg = leftLeg;
        this.mesh.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeo, this.materials.pants);
        rightLeg.position.set(0.15, -0.4, 0);
        this.parts.rightLeg = rightLeg;
        this.mesh.add(rightLeg);

        // --- ARMS ---
        const armGeo = new THREE.CylinderGeometry(0.07, 0.05, 0.7, 5);

        const leftArm = new THREE.Mesh(armGeo, this.materials.skin);
        leftArm.position.set(-0.4, 0.45, 0);
        leftArm.rotation.z = 0.2;
        this.parts.leftArm = leftArm;
        this.mesh.add(leftArm);

        const rightArm = new THREE.Mesh(armGeo, this.materials.skin);
        rightArm.position.set(0.4, 0.45, 0);
        rightArm.rotation.z = -0.2;
        this.parts.rightArm = rightArm;
        this.mesh.add(rightArm);
    }

    createHair(styleId) {
        // Clear previous hair
        while (this.parts.hairGroup.children.length > 0) {
            this.parts.hairGroup.remove(this.parts.hairGroup.children[0]);
        }

        const mat = this.materials.hair;

        if (styleId === 'style1') { // Short messy
            const geo = new THREE.IcosahedronGeometry(0.27, 0);
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.y = 0.05;
            this.parts.hairGroup.add(mesh);
        }
        else if (styleId === 'style2') { // Flat top
            const geo = new THREE.CylinderGeometry(0.28, 0.28, 0.2, 6);
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.y = 0.15;
            this.parts.hairGroup.add(mesh);
        }
        else if (styleId === 'style3') { // Mohawk
            const geo = new THREE.BoxGeometry(0.1, 0.4, 0.4);
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.y = 0.25;
            this.parts.hairGroup.add(mesh);
        }
    }

    updateScale(params) {
        // Height affects legs and torso scaling Y
        if (params.height) {
            const scale = params.height; // 0.8 to 1.2
            this.parts.leftLeg.scale.y = scale;
            this.parts.rightLeg.scale.y = scale;
            // Adjust body height config if needed
            this.parts.leftLeg.position.y = -0.4 * scale;
            this.parts.rightLeg.position.y = -0.4 * scale;
        }

        if (params.headSize) {
            this.parts.headGroup.scale.setScalar(params.headSize);
        }

        if (params.build) {
            const thick = params.build;
            this.parts.torso.scale.x = thick;
            this.parts.torso.scale.z = thick;
        }
    }

    setColor(part, hexColor) {
        if (this.materials[part]) {
            this.materials[part].color.set(hexColor);
        }
    }

    setHeadShape(shapeId) {
        // Swap geometries for head
        let newGeo;
        if (shapeId === 'shape1') newGeo = new THREE.IcosahedronGeometry(0.25, 0);
        if (shapeId === 'shape2') newGeo = new THREE.BoxGeometry(0.4, 0.5, 0.4); // Blocky
        if (shapeId === 'shape3') newGeo = new THREE.CylinderGeometry(0.2, 0.25, 0.5, 6); // Angular

        this.parts.head.geometry.dispose();
        this.parts.head.geometry = newGeo;
    }
}
