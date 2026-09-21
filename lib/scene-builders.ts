import type * as Three from 'three';

type Engine = typeof Three;
export type SceneKind = 'desk' | 'globe' | 'tech';
export const technologyNames = [
  'React',
  'Angular',
  '.NET',
  'Node.js',
  'SQL Server',
  'PostgreSQL',
  'MongoDB',
  'Dynamics 365',
];

export function buildScene(T: Engine, kind: SceneKind) {
  const scene = new T.Scene();
  const root = new T.Group();
  scene.add(root);
  const camera = new T.PerspectiveCamera(38, 1, 0.1, 100);
  const textures: Three.Texture[] = [];
  const animated: Three.Object3D[] = [];
  const dark = new T.MeshStandardMaterial({
    color: '#101722',
    metalness: 0.65,
    roughness: 0.3,
  });
  const blue = new T.MeshStandardMaterial({
    color: '#182a43',
    metalness: 0.55,
    roughness: 0.35,
  });
  const glow = new T.MeshBasicMaterial({ color: '#67e8f9' });
  scene.add(new T.HemisphereLight('#b8eaff', '#101226', 2.7));
  const light = new T.DirectionalLight('#cdefff', 4);
  light.position.set(-3, 7, 5);
  scene.add(light);
  const rim = new T.PointLight('#11b9ee', 35, 20);
  rim.position.set(4, 2, -2);
  scene.add(rim);
  function box(
    w: number,
    h: number,
    d: number,
    x: number,
    y: number,
    z: number,
    material: Three.Material = dark,
    parent = root,
  ) {
    const mesh = new T.Mesh(new T.BoxGeometry(w, h, d), material);
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  }
  function texture(
    draw: (ctx: CanvasRenderingContext2D) => void,
    width = 512,
    height = 512,
  ) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas unavailable');
    draw(ctx);
    const map = new T.CanvasTexture(canvas);
    map.colorSpace = T.SRGBColorSpace;
    textures.push(map);
    return map;
  }
  if (kind === 'desk') {
    root.position.y = -0.4;
    box(7.8, 0.18, 3.3, 0, -0.65, 0, blue);
    box(7.5, 0.025, 0.025, 0, -0.64, 1.66, glow);
    for (const x of [-3.25, 3.25]) box(0.18, 1.2, 2.5, x, -1.31, 0);
    box(0.65, 0.12, 0.55, -0.65, -0.5, -0.55);
    box(0.13, 0.7, 0.14, -0.65, -0.19, -0.65);
    box(4.3, 2.35, 0.18, -0.65, 1.2, -0.7);
    const code = texture(
      (c) => {
        c.fillStyle = '#07111e';
        c.fillRect(0, 0, 1024, 576);
        c.fillStyle = '#101e2c';
        c.fillRect(0, 0, 1024, 37);
        c.fillRect(0, 37, 195, 539);
        c.fillStyle = '#8593a6';
        c.font = '16px monospace';
        c.fillText('portfolio.tsx    ×', 217, 25);
        [
          'EXPLORER',
          '⌄  WILDER',
          '  ⌄ src',
          '    components',
          '    pages',
          '    services',
          '    styles',
          '  package.json',
        ].forEach((s, i) => c.fillText(s, 15, 69 + i * 29));
        const lines = [
          'import { passion } from "life";',
          '',
          'const developer = {',
          '  name: "Wilder Mancera",',
          '  role: "Full Stack Developer",',
          '  stack: ["React", ".NET", "Node"],',
          '  mindset: "Always building",',
          '};',
          '',
          'export async function createFuture() {',
          '  const idea = await imagine();',
          '  return build(idea, {',
          '    quality: true,',
          '    impact: "meaningful",',
          '  });',
          '}',
        ];
        c.font = '19px monospace';
        lines.forEach((s, i) => {
          c.fillStyle = '#425369';
          c.fillText(String(i + 1).padStart(2), 213, 70 + i * 28);
          c.fillStyle =
            i % 3 === 0 ? '#b4a3ff' : i % 3 === 1 ? '#9ae6b4' : '#67e8f9';
          c.fillText(s, 256, 70 + i * 28);
        });
      },
      1024,
      576,
    );
    const screen = new T.Mesh(
      new T.PlaneGeometry(4.08, 2.13),
      new T.MeshBasicMaterial({ map: code }),
    );
    screen.position.set(-0.65, 1.2, -0.599);
    root.add(screen);
    box(2.7, 0.055, 0.9, -0.6, -0.515, 0.88, blue);
    for (let row = 0; row < 5; row++)
      for (let col = 0; col < 15; col++)
        box(
          0.145,
          0.035,
          0.12,
          -1.81 + col * 0.171,
          -0.47,
          0.53 + row * 0.155,
          row === 4 && col > 3 && col < 10 ? blue : dark,
        );
    box(2.65, 0.012, 0.014, -0.6, -0.5, 1.335, glow);
    const mouse = new T.Mesh(new T.SphereGeometry(0.19, 20, 12), blue);
    mouse.scale.set(0.8, 0.4, 1.3);
    mouse.position.set(1.2, -0.46, 0.95);
    root.add(mouse);
    box(0.015, 0.02, 0.14, 1.2, -0.383, 0.94, glow);
    for (const x of [-3.05, 1.85]) {
      box(0.47, 0.78, 0.5, x, -0.16, -0.5);
      const cone = new T.Mesh(
        new T.CylinderGeometry(0.15, 0.15, 0.025, 24),
        blue,
      );
      cone.rotation.x = Math.PI / 2;
      cone.position.set(x, -0.13, -0.235);
      root.add(cone);
      const ring = new T.Mesh(new T.TorusGeometry(0.15, 0.012, 8, 32), glow);
      ring.position.set(x, -0.13, -0.21);
      root.add(ring);
    }
    box(1.05, 2.2, 1.45, 2.95, 0.53, -0.35);
    box(0.89, 2.02, 0.035, 2.95, 0.54, 0.391, blue);
    for (const y of [-0.02, 0.62, 1.26]) {
      const fan = new T.Group();
      fan.position.set(2.95, y, 0.43);
      root.add(fan);
      animated.push(fan);
      const ring = new T.Mesh(new T.TorusGeometry(0.25, 0.023, 8, 40), glow);
      fan.add(ring);
      for (let i = 0; i < 7; i++) {
        const blade = new T.Mesh(new T.BoxGeometry(0.1, 0.2, 0.025), blue);
        const a = (i / 7) * Math.PI * 2;
        blade.position.set(Math.cos(a) * 0.12, Math.sin(a) * 0.12, 0);
        blade.rotation.z = a - 0.6;
        fan.add(blade);
      }
      const hub = new T.Mesh(new T.CircleGeometry(0.06, 20), glow);
      hub.position.z = 0.02;
      fan.add(hub);
    }
    const glass = new T.MeshStandardMaterial({
      color: '#27769c',
      transparent: true,
      opacity: 0.25,
      metalness: 0.4,
      roughness: 0.1,
    });
    box(0.018, 1.94, 1.26, 2.416, 0.54, -0.35, glass);
    camera.position.set(4.8, 3.8, 10);
    camera.lookAt(0, 0.1, 0);
  } else if (kind === 'globe') {
    const globe = new T.Group();
    root.add(globe);
    animated.push(globe);
    const earthMap = texture(
      (c) => {
        c.fillStyle = '#102843';
        c.fillRect(0, 0, 1024, 512);
        c.strokeStyle = '#1c405e';
        c.lineWidth = 1;
        for (let x = 0; x < 1024; x += 43) {
          c.beginPath();
          c.moveTo(x, 0);
          c.lineTo(x, 512);
          c.stroke();
        }
        for (let y = 0; y < 512; y += 43) {
          c.beginPath();
          c.moveTo(0, y);
          c.lineTo(1024, y);
          c.stroke();
        }
        const continents = [
          [
            [-168, 70],
            [-130, 72],
            [-114, 61],
            [-82, 54],
            [-55, 52],
            [-66, 43],
            [-81, 25],
            [-97, 16],
            [-109, 25],
            [-125, 48],
            [-148, 60],
          ],
          [
            [-81, 12],
            [-63, 10],
            [-49, -2],
            [-35, -8],
            [-45, -24],
            [-54, -36],
            [-69, -55],
            [-76, -30],
          ],
          [
            [-52, 59],
            [-42, 61],
            [-20, 79],
            [-43, 84],
            [-60, 74],
          ],
          [
            [-11, 36],
            [-18, 19],
            [-16, 5],
            [7, 4],
            [11, -5],
            [17, -30],
            [31, -35],
            [41, -13],
            [51, 11],
            [35, 30],
            [10, 37],
          ],
          [
            [-10, 36],
            [-10, 44],
            [2, 51],
            [8, 58],
            [20, 71],
            [37, 69],
            [44, 57],
            [63, 54],
            [92, 74],
            [128, 70],
            [175, 63],
            [151, 49],
            [135, 35],
            [121, 22],
            [108, 5],
            [101, 3],
            [95, 19],
            [79, 7],
            [68, 26],
            [44, 30],
            [34, 43],
            [19, 40],
          ],
          [
            [113, -22],
            [123, -13],
            [137, -12],
            [153, -25],
            [146, -39],
            [129, -34],
            [115, -35],
          ],
          [
            [47, -13],
            [50, -17],
            [47, -26],
            [44, -24],
          ],
          [
            [129, 31],
            [142, 45],
            [145, 39],
            [136, 33],
          ],
          [
            [166, -35],
            [178, -39],
            [169, -47],
          ],
        ];
        c.fillStyle = '#48a8b6';
        c.strokeStyle = '#83d3d5';
        c.lineWidth = 1.6;
        continents.forEach((polygon) => {
          c.beginPath();
          polygon.forEach(([lon, lat], i) => {
            const x = ((lon + 180) / 360) * 1024;
            const y = ((90 - lat) / 180) * 512;
            if (!i) c.moveTo(x, y);
            else c.lineTo(x, y);
          });
          c.closePath();
          c.fill();
          c.stroke();
        });
      },
      1024,
      512,
    );
    globe.add(
      new T.Mesh(
        new T.SphereGeometry(1.65, 64, 48),
        new T.MeshStandardMaterial({
          map: earthMap,
          metalness: 0.2,
          roughness: 0.8,
        }),
      ),
    );
    globe.rotation.set(0.13, 2.4, -0.12);
    const halo = new T.ShaderMaterial({
      transparent: true,
      side: T.BackSide,
      blending: T.AdditiveBlending,
      depthWrite: false,
      vertexShader:
        'varying vec3 n; varying vec3 v; void main(){ vec4 p=modelViewMatrix*vec4(position,1.0); n=normalize(normalMatrix*normal); v=normalize(-p.xyz); gl_Position=projectionMatrix*p; }',
      fragmentShader:
        'varying vec3 n; varying vec3 v; void main(){float f=pow(max(0.0,1.0-abs(dot(n,v))),3.0); gl_FragColor=vec4(0.16,0.72,0.95,f*0.52);}',
    });
    root.add(new T.Mesh(new T.SphereGeometry(1.77, 48, 32), halo));
    for (let i = 0; i < 3; i++) {
      const orbit = new T.Mesh(
        new T.TorusGeometry(2.03 + i * 0.2, 0.005, 4, 160),
        new T.MeshBasicMaterial({
          color: '#67e8f9',
          transparent: true,
          opacity: 0.18 + i * 0.06,
        }),
      );
      orbit.rotation.set(0.9 + i * 0.32, i * 0.5, -0.5);
      root.add(orbit);
    }
    const positions = new Float32Array(450);
    for (let i = 0; i < 450; i++) positions[i] = Math.sin(i * 137.51) * 7;
    const stars = new T.BufferGeometry();
    stars.setAttribute('position', new T.BufferAttribute(positions, 3));
    root.add(
      new T.Points(
        stars,
        new T.PointsMaterial({
          color: '#8bd8ef',
          size: 0.017,
          transparent: true,
          opacity: 0.6,
        }),
      ),
    );
    camera.position.set(0, 0.4, 7.6);
    camera.lookAt(0, 0, 0);
  } else {
    technologyNames.forEach((name, index) => {
      const group = new T.Group();
      root.add(group);
      animated.push(group);
      const shell = new T.Mesh(
        new T.IcosahedronGeometry(0.79, 1),
        new T.MeshStandardMaterial({
          color: '#264359',
          metalness: 0.3,
          roughness: 0.5,
          flatShading: true,
        }),
      );
      group.add(shell);
      const edges = new T.LineSegments(
        new T.EdgesGeometry(shell.geometry),
        new T.LineBasicMaterial({
          color: '#53a7c3',
          transparent: true,
          opacity: 0.22,
        }),
      );
      group.add(edges);
      const map = texture((c) => {
        c.clearRect(0, 0, 512, 512);
        c.strokeStyle = '#83e8fc';
        c.fillStyle = '#83e8fc';
        c.lineWidth = 16;
        c.lineCap = 'round';
        c.lineJoin = 'round';
        if (index === 0) {
          for (let i = 0; i < 3; i++) {
            c.beginPath();
            c.ellipse(256, 256, 155, 57, (i * Math.PI) / 3, 0, Math.PI * 2);
            c.stroke();
          }
          c.beginPath();
          c.arc(256, 256, 22, 0, Math.PI * 2);
          c.fill();
        } else if (index === 1) {
          c.beginPath();
          c.moveTo(256, 75);
          c.lineTo(414, 130);
          c.lineTo(388, 345);
          c.lineTo(256, 426);
          c.lineTo(124, 345);
          c.lineTo(98, 130);
          c.closePath();
          c.stroke();
          c.font = 'bold 235px sans-serif';
          c.textAlign = 'center';
          c.fillText('A', 256, 338);
        } else if (index === 3) {
          c.beginPath();
          for (let i = 0; i < 6; i++) {
            const a = (i * Math.PI) / 3 - Math.PI / 2;
            const x = 256 + Math.cos(a) * 170;
            const y = 256 + Math.sin(a) * 170;
            if (i) c.lineTo(x, y);
            else c.moveTo(x, y);
          }
          c.closePath();
          c.stroke();
          c.font = 'bold 125px monospace';
          c.textAlign = 'center';
          c.fillText('JS', 256, 302);
        } else if (index === 4) {
          for (const y of [135, 255, 375]) {
            c.beginPath();
            c.ellipse(256, y, 135, 47, 0, 0, Math.PI * 2);
            c.stroke();
          }
          c.beginPath();
          c.moveTo(121, 135);
          c.lineTo(121, 375);
          c.moveTo(391, 135);
          c.lineTo(391, 375);
          c.stroke();
        } else if (index === 5) {
          c.beginPath();
          c.moveTo(218, 334);
          c.bezierCurveTo(77, 359, 75, 102, 217, 126);
          c.bezierCurveTo(275, 82, 422, 121, 396, 260);
          c.lineTo(347, 316);
          c.lineTo(331, 402);
          c.quadraticCurveTo(279, 432, 288, 353);
          c.lineTo(284, 228);
          c.stroke();
          c.beginPath();
          c.arc(254, 212, 10, 0, Math.PI * 2);
          c.fill();
          c.beginPath();
          c.moveTo(165, 170);
          c.quadraticCurveTo(116, 282, 216, 307);
          c.stroke();
        } else if (index === 6) {
          c.beginPath();
          c.moveTo(256, 59);
          c.bezierCurveTo(441, 240, 328, 374, 256, 420);
          c.bezierCurveTo(128, 357, 97, 226, 256, 59);
          c.fill();
          c.strokeStyle = '#122b3c';
          c.lineWidth = 8;
          c.beginPath();
          c.moveTo(256, 140);
          c.lineTo(256, 458);
          c.stroke();
        } else if (index === 7) {
          c.beginPath();
          c.moveTo(139, 79);
          c.lineTo(361, 200);
          c.lineTo(361, 328);
          c.lineTo(139, 449);
          c.lineTo(139, 313);
          c.lineTo(267, 246);
          c.lineTo(139, 176);
          c.closePath();
          c.stroke();
        } else {
          c.font = 'bold 127px sans-serif';
          c.textAlign = 'center';
          c.fillText('.NET', 256, 300);
        }
      });
      const symbol = new T.Mesh(
        new T.PlaneGeometry(1.17, 1.17),
        new T.MeshBasicMaterial({ map, transparent: true, depthWrite: false }),
      );
      symbol.position.z = 0.9;
      group.add(symbol);
      group.userData.name = name;
    });
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);
  }
  function resize(width: number, height: number) {
    camera.aspect = width / height;
    if (kind === 'tech') {
      const columns = width < 580 ? 2 : 4;
      const rows = 8 / columns;
      animated.forEach((object, i) => {
        object.position.set(
          ((i % columns) - (columns - 1) / 2) * 2.3,
          ((rows - 1) / 2 - Math.floor(i / columns)) * 2.5 + 0.25,
          0,
        );
      });
      camera.position.z =
        (Math.max((columns * 2.3) / camera.aspect, rows * 2.5) /
          (2 * Math.tan(T.MathUtils.degToRad(19)))) *
        1.04;
    } else if (kind === 'desk') {
      const distance = camera.aspect < 1.35 ? 1.35 / camera.aspect : 1;
      camera.position.set(4.8 * distance, 3.8 * distance, 10 * distance);
      camera.lookAt(0, 0.1, 0);
    } else camera.position.z = Math.max(7.6, 5.3 / camera.aspect);
    camera.updateProjectionMatrix();
  }
  function labelPositions() {
    if (kind !== 'tech') return [];
    camera.updateMatrixWorld();
    return animated.map((object) => {
      const point = new T.Vector3(
        object.position.x,
        object.position.y - 1.05,
        0,
      ).project(camera);
      return {
        left: (point.x * 0.5 + 0.5) * 100,
        top: (-point.y * 0.5 + 0.5) * 100,
      };
    });
  }
  function update(time: number, pointerX: number, pointerY: number) {
    root.rotation.y = pointerX * 0.065;
    root.rotation.x = pointerY * 0.025;
    if (kind === 'desk')
      animated.forEach((fan) => {
        fan.rotation.z = time * 0.85;
      });
    if (kind === 'globe') animated[0].rotation.y = 2.4 + time * 0.035;
    if (kind === 'tech')
      animated.forEach((object, i) => {
        object.rotation.y = Math.sin(time * 0.45 + i) * 0.13;
        object.rotation.x = Math.sin(time * 0.35 + i) * 0.06;
      });
  }
  function dispose() {
    const geometries = new Set<Three.BufferGeometry>();
    const materials = new Set<Three.Material>([dark, blue, glow]);
    scene.traverse((object) => {
      const mesh = object as Three.Mesh;
      if (mesh.geometry) geometries.add(mesh.geometry);
      if (mesh.material)
        (Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material]
        ).forEach((material) => materials.add(material));
    });
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    textures.forEach((map) => map.dispose());
  }
  return { scene, camera, resize, update, labelPositions, dispose };
}
