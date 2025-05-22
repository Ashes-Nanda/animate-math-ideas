
import * as THREE from 'three';

interface AnimationConfig {
  duration: number;
  width: number;
  height: number;
}

// Define a custom interface that extends Three.js objects with our animate method
interface AnimatableObject {
  object: THREE.Object3D;
  animate: (t: number) => void;
}

export const generateMathAnimation = async (
  prompt: string, 
  config: AnimationConfig = { duration: 5, width: 800, height: 600 }
) => {
  // Create scene, camera and renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, config.width / config.height, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  
  renderer.setSize(config.width, config.height);
  renderer.setClearColor(0x1a1a1a); // Dark background
  
  // Parse the prompt and create appropriate animations
  const animatableObjects = parsePromptToObjects(prompt, scene);
  
  // Position camera
  camera.position.z = 5;
  
  // Create animation frames
  const frames: Uint8Array[] = [];
  const totalFrames = config.duration * 60; // 60fps
  
  for (let i = 0; i < totalFrames; i++) {
    // Update animations
    const t = i / totalFrames;
    animatableObjects.forEach(obj => {
      obj.animate(t);
    });
    
    // Render frame
    renderer.render(scene, camera);
    
    // Capture frame
    const buffer = new Uint8Array(config.width * config.height * 4);
    renderer.getContext().readPixels(
      0, 0, config.width, config.height,
      renderer.getContext().RGBA,
      renderer.getContext().UNSIGNED_BYTE,
      buffer
    );
    frames.push(buffer);
  }
  
  // Convert frames to video blob
  const videoBlob = await framesToVideo(frames, config);
  return videoBlob;
};

function parsePromptToObjects(prompt: string, scene: THREE.Scene): AnimatableObject[] {
  const animatableObjects: AnimatableObject[] = [];
  const promptLower = prompt.toLowerCase();

  // Basic shapes and concepts
  if (promptLower.includes('circle')) {
    const geometry = new THREE.CircleGeometry(1, 32);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x3b82f6,
      wireframe: true
    });
    const circle = new THREE.Mesh(geometry, material);
    scene.add(circle);
    
    // Create an animatable object with the circle and its animation function
    animatableObjects.push({
      object: circle,
      animate: (t: number) => {
        circle.rotation.z = t * Math.PI * 2;
      }
    });
  }

  if (promptLower.includes('vector')) {
    const origin = new THREE.Vector3(0, 0, 0);
    const direction = new THREE.Vector3(1, 1, 0).normalize();
    const length = 2;
    const color = 0x8b5cf6;
    
    const arrow = new THREE.ArrowHelper(direction, origin, length, color);
    scene.add(arrow);
    
    // Create an animatable object with the arrow and its animation function
    animatableObjects.push({
      object: arrow,
      animate: (t: number) => {
        arrow.rotation.z = t * Math.PI;
      }
    });
  }

  if (promptLower.includes('matrix') || promptLower.includes('transformation')) {
    // Create a grid of points
    const gridSize = 5;
    const points = [];
    const geometry = new THREE.BufferGeometry();
    
    for (let i = -gridSize; i <= gridSize; i++) {
      for (let j = -gridSize; j <= gridSize; j++) {
        points.push(i/gridSize, j/gridSize, 0);
      }
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    const material = new THREE.PointsMaterial({ color: 0xa855f7, size: 0.05 });
    const pointCloud = new THREE.Points(geometry, material);
    scene.add(pointCloud);
    
    // Create an animatable object with the pointCloud and its animation function
    animatableObjects.push({
      object: pointCloud,
      animate: (t: number) => {
        // Apply transformation matrix
        const matrix = new THREE.Matrix4();
        matrix.makeRotationZ(t * Math.PI);
        matrix.scale(new THREE.Vector3(Math.cos(t * Math.PI), Math.sin(t * Math.PI), 1));
        pointCloud.matrix.copy(matrix);
        pointCloud.matrixAutoUpdate = false;
      }
    });
  }

  return animatableObjects;
}

async function framesToVideo(frames: Uint8Array[], config: AnimationConfig): Promise<Blob> {
  // This is a simplified version - in a real implementation,
  // you would use WebCodecs API or a similar solution to create
  // a proper video file. For now, we'll create a simple animated GIF
  // or return the first frame as a PNG.
  
  // For demo purposes, return a static image of the first frame
  const canvas = document.createElement('canvas');
  canvas.width = config.width;
  canvas.height = config.height;
  const ctx = canvas.getContext('2d')!;
  
  const imageData = ctx.createImageData(config.width, config.height);
  imageData.data.set(frames[0]);
  ctx.putImageData(imageData, 0, 0);
  
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob!);
    }, 'image/png');
  });
}
