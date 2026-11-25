import * as THREE from 'three';
import { gsap } from 'gsap'; // Aggiunto GSAP
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

// 1. Setup Base
const container = document.getElementById('webgl-container');
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// 2. Texture e Dimensioni
const textureLoader = new THREE.TextureLoader();
const img1 = textureLoader.load('/img/1.png');
const img2 = textureLoader.load('/img/2.png');
const depthMap = textureLoader.load('/img/1_depth.webp'); 

// Assumiamo che le tue foto siano 16:9, cambialo se sono verticali
const imageAspect = 1920.0 / 1080.0; 

// 3. Shader Material con Aspect Ratio Fix
const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
        uImage1: { value: img1 },
        uImage2: { value: img2 },
        uDepth: { value: depthMap },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uTime: { value: 0.0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uImageAspect: { value: imageAspect }
    }
});

const geometry = new THREE.PlaneGeometry(2, 2);
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// 4. Tracciamento Mouse
let targetMouse = new THREE.Vector2(0.5, 0.5);
window.addEventListener('mousemove', (e) => {
    targetMouse.x = e.clientX / window.innerWidth;
    targetMouse.y = 1.0 - (e.clientY / window.innerHeight);
});

// 5. Resize e aggiornamento proporzioni
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
});

// 6. Animazione Bottone Contatti (GSAP)
const revealBtn = document.getElementById('reveal-phone-btn');
const hiddenPhone = document.getElementById('hidden-phone');

revealBtn.addEventListener('click', () => {
    gsap.to(revealBtn, {
        opacity: 0, 
        y: -20, 
        duration: 0.3,
        onComplete: () => {
            revealBtn.style.display = 'none';
            hiddenPhone.style.display = 'block';
            gsap.fromTo(hiddenPhone, 
                { opacity: 0, scale: 0.5, y: 30 }, 
                { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }
            );
        }
    });
});

// 7. Loop di Rendering
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    material.uniforms.uTime.value = clock.getElapsedTime();
    material.uniforms.uMouse.value.x += (targetMouse.x - material.uniforms.uMouse.value.x) * 0.1;
    material.uniforms.uMouse.value.y += (targetMouse.y - material.uniforms.uMouse.value.y) * 0.1;
    renderer.render(scene, camera);
}
animate();