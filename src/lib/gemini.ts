import * as THREE from 'three';

const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

interface AnimationInstruction {
  type: string;
  parameters: Record<string, any>;
  duration: number;
}

export const generateMathAnimation = async (prompt: string): Promise<AnimationInstruction[]> => {
  try {
    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Convert this mathematical concept into a sequence of animation instructions. Format the response as a JSON array of animation objects with 'type', 'parameters', and 'duration' fields. Only use these animation types: 'circle', 'vector', 'matrix', 'graph', 'transform'. Prompt: ${prompt}`
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate animation instructions');
    }

    const data = await response.json();
    const instructions = JSON.parse(data.candidates[0].content.parts[0].text);
    
    return instructions;
  } catch (error) {
    console.error('Error generating with Gemini:', error);
    throw error;
  }
};

export const renderAnimation = async (instructions: AnimationInstruction[]): Promise<Blob> => {
  // Set up Three.js scene
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 16/9, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(1280, 720);
  
  camera.position.z = 5;

  // Create animation objects based on instructions
  const objects: THREE.Object3D[] = [];
  
  instructions.forEach(instruction => {
    let object: THREE.Object3D;
    
    switch (instruction.type) {
      case 'circle':
        const geometry = new THREE.CircleGeometry(
          instruction.parameters.radius || 1,
          32
        );
        const material = new THREE.MeshBasicMaterial({
          color: instruction.parameters.color || 0x3b82f6,
          wireframe: true
        });
        object = new THREE.Mesh(geometry, material);
        break;

      case 'vector':
        const dir = new THREE.Vector3(
          instruction.parameters.x || 0,
          instruction.parameters.y || 1,
          instruction.parameters.z || 0
        );
        const origin = new THREE.Vector3(0, 0, 0);
        const length = instruction.parameters.length || 1;
        const arrowHelper = new THREE.ArrowHelper(
          dir.normalize(),
          origin,
          length,
          instruction.parameters.color || 0x8b5cf6
        );
        object = arrowHelper;
        break;

      case 'matrix':
        const gridHelper = new THREE.GridHelper(
          instruction.parameters.size || 2,
          instruction.parameters.divisions || 10,
          instruction.parameters.color1 || 0x888888,
          instruction.parameters.color2 || 0x444444
        );
        object = gridHelper;
        break;

      default:
        object = new THREE.Object3D();
    }

    scene.add(object);
    objects.push(object);
  });

  // Animation loop
  const frames: Blob[] = [];
  const fps = 30;
  const duration = Math.max(...instructions.map(i => i.duration));
  const totalFrames = duration * fps;

  for (let frame = 0; frame < totalFrames; frame++) {
    const time = frame / fps;

    // Update objects based on instructions
    objects.forEach((object, index) => {
      const instruction = instructions[index];
      
      switch (instruction.type) {
        case 'circle':
          object.rotation.z = (time / instruction.duration) * Math.PI * 2;
          break;
        case 'vector':
          (object as THREE.ArrowHelper).setDirection(
            new THREE.Vector3(
              Math.cos(time / instruction.duration * Math.PI * 2),
              Math.sin(time / instruction.duration * Math.PI * 2),
              0
            ).normalize()
          );
          break;
        case 'matrix':
          object.rotation.y = (time / instruction.duration) * Math.PI * 2;
          break;
      }
    });

    renderer.render(scene, camera);
    
    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve) => {
      renderer.domElement.toBlob((b) => resolve(b!), 'image/png');
    });
    
    frames.push(blob);
  }

  // Combine frames into video (simplified for demo)
  // In a real implementation, you'd want to use WebCodecs API
  // to properly encode the frames into a video
  return new Blob(frames, { type: 'video/webm' });
};