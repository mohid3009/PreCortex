import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function BrainViz() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animId;
    let disposed = false;

    // ── Renderer ──────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x060606, 1);

    const canvas = renderer.domElement;
    Object.assign(canvas.style, {
      position: 'absolute', top: '0', left: '0',
      width: '100%', height: '100%', display: 'block',
    });
    container.appendChild(canvas);

    // ── Scene & camera ────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.01, 1000);
    camera.position.set(0, 0, 5);

    // ── Lights ────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 1.5));

    const key = new THREE.DirectionalLight(0xCCCCFF, 3);
    key.position.set(5, 5, 5);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0x6688CC, 1.5);
    rim.position.set(-5, -2, -3);
    scene.add(rim);

    // ── Resize ────────────────────────────────────────────────
    function resize() {
      const w = container.offsetWidth  || 500;
      const h = container.offsetHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    }
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    // ── Render loop (keeps running even during load) ──────────
    const pivot = new THREE.Group();
    scene.add(pivot);

    function tick(ts) {
      animId = requestAnimationFrame(tick);
      if (disposed) return;
      pivot.rotation.y = ts * 0.0002;
      renderer.render(scene, camera);
    }
    animId = requestAnimationFrame(tick);

    // ── Load brain via fetch + GLTFLoader.parse ───────────────
    const loader = new GLTFLoader();

    fetch('/brain.glb')
      .then(r => r.arrayBuffer())
      .then(buf => new Promise((ok, fail) => loader.parse(buf, '', ok, fail)))
      .then(gltf => {
        if (disposed) return;

        const model = gltf.scene;

        // Apply visible material to every mesh
        model.traverse(child => {
          if (!child.isMesh) return;
          child.castShadow    = false;
          child.receiveShadow = false;
          child.material = new THREE.MeshPhongMaterial({
            color:    new THREE.Color(0x2A2A3E),
            specular: new THREE.Color(0x5577BB),
            shininess: 50,
            side: THREE.DoubleSide,
          });
        });

        // Auto-fit: centre + scale to fill ~2 units
        const box  = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const ctr  = box.getCenter(new THREE.Vector3());
        const maxD = Math.max(size.x, size.y, size.z);
        const scale = 2.8 / maxD;

        model.position.copy(ctr).negate().multiplyScalar(scale);
        model.scale.setScalar(scale);

        pivot.add(model);
        model.updateWorldMatrix(true, true);
        console.log('[BrainViz] model loaded. size:', size, 'scale:', scale);

        // ── Neurons ──────────────────────────────────────────
        const N = 260;

        // Sample neuron positions from model's bounding box (fast fallback)
        const nPos = new Float32Array(N * 3);
        const nCol = new Float32Array(N * 3);

        // Sample from surface of largest mesh
        let bigMesh = null, bigCount = 0;
        model.traverse(c => {
          if (c.isMesh) {
            const n = c.geometry.attributes.position.count;
            if (n > bigCount) { bigCount = n; bigMesh = c; }
          }
        });

        if (bigMesh) {
          bigMesh.updateWorldMatrix(true, true);
          const p = bigMesh.geometry.attributes.position;
          const step = Math.max(1, Math.floor(bigCount / N));
          for (let i = 0; i < N; i++) {
            const vi = (i * step) % bigCount;
            const v = new THREE.Vector3(p.getX(vi), p.getY(vi), p.getZ(vi));
            v.applyMatrix4(bigMesh.matrixWorld);
            nPos[i*3]   = v.x;
            nPos[i*3+1] = v.y;
            nPos[i*3+2] = v.z;
            nCol[i*3] = nCol[i*3+1] = nCol[i*3+2] = 0.25;
          }
        }

        const nGeo = new THREE.BufferGeometry();
        nGeo.setAttribute('position', new THREE.BufferAttribute(nPos, 3));
        nGeo.setAttribute('color',    new THREE.BufferAttribute(nCol, 3));
        const nMat = new THREE.PointsMaterial({ size: 0.03, vertexColors: true, transparent: true, opacity: 0.9 });
        const points = new THREE.Points(nGeo, nMat);
        pivot.add(points);

        // ── Firing ───────────────────────────────────────────
        const firing  = new Float32Array(N).fill(0);
        let lastFire  = -1;
        let prevTs    = -1;

        function fireCluster(ci) {
          const cx = nPos[ci*3], cy = nPos[ci*3+1], cz = nPos[ci*3+2];
          const r2 = 0.8 * 0.8;
          for (let i = 0; i < N; i++) {
            const dx=nPos[i*3]-cx, dy=nPos[i*3+1]-cy, dz=nPos[i*3+2]-cz;
            if (dx*dx+dy*dy+dz*dz < r2)
              firing[i] = Math.max(firing[i], 0.65 + Math.random() * 0.35);
          }
        }

        cancelAnimationFrame(animId);

        function animate(ts) {
          animId = requestAnimationFrame(animate);
          if (disposed) return;
          if (prevTs < 0) prevTs = ts;
          const dt = Math.min((ts - prevTs) / 1000, 0.05);
          prevTs = ts;

          pivot.rotation.y = ts * 0.0002;

          if (lastFire < 0 || (ts/1000) - lastFire > 0.55 + Math.random()*0.45) {
            lastFire = ts / 1000;
            fireCluster(Math.floor(Math.random() * N));
            if (Math.random() > 0.5) fireCluster(Math.floor(Math.random() * N));
          }

          const nc = nGeo.attributes.color.array;
          for (let i = 0; i < N; i++) {
            firing[i] = Math.max(0, firing[i] - 0.5 * dt);
            const g = firing[i] ** 2;
            nc[i*3]   = 0.20 + g * 0.80;
            nc[i*3+1] = 0.20 + g * 0.72;
            nc[i*3+2] = 0.28 + g * 0.70;
          }
          nGeo.attributes.color.needsUpdate = true;

          renderer.render(scene, camera);
        }
        animId = requestAnimationFrame(animate);
      })
      .catch(err => console.error('[BrainViz] ERROR:', err));

    return () => {
      disposed = true;
      cancelAnimationFrame(animId);
      ro.disconnect();
      if (canvas.parentNode === container) container.removeChild(canvas);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden="true"
    />
  );
}
