
import * as THREE from 'three';

// Updated Gemini API endpoint with the correct version
const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';

interface AnimationInstruction {
  type: string;
  parameters: Record<string, any>;
  duration: number;
}

export const generateMathAnimation = async (prompt: string): Promise<AnimationInstruction[]> => {
  try {
    console.log("Sending request to Gemini API...");
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
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(`Failed to generate animation instructions: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0].text) {
      console.error('Unexpected Gemini API response format:', data);
      throw new Error('Invalid response format from Gemini API');
    }
    
    console.log("Received response from Gemini API:", data.candidates[0].content.parts[0].text);
    const instructions = JSON.parse(data.candidates[0].content.parts[0].text);
    
    return instructions;
  } catch (error) {
    console.error('Error generating with Gemini:', error);
    
    // Fallback: Generate default instructions if the API fails
    console.log("Using fallback animation instructions");
    return generateFallbackInstructions(prompt);
  }
};

// Function to generate fallback instructions when the API fails
const generateFallbackInstructions = (prompt: string): AnimationInstruction[] => {
  const promptLower = prompt.toLowerCase();
  const instructions: AnimationInstruction[] = [];
  
  if (promptLower.includes('eigen')) {
    // Eigenvector visualization
    instructions.push({
      type: 'vector',
      parameters: {
        x: 1,
        y: 0,
        z: 0,
        length: 2,
        color: 0xff0000
      },
      duration: 5
    });
    instructions.push({
      type: 'vector',
      parameters: {
        x: 0,
        y: 1,
        z: 0,
        length: 1,
        color: 0x00ff00
      },
      duration: 5
    });
    instructions.push({
      type: 'matrix',
      parameters: {
        size: 3,
        divisions: 10
      },
      duration: 5
    });
  } else if (promptLower.includes('fourier') || promptLower.includes('series')) {
    // Fourier series visualization
    instructions.push({
      type: 'circle',
      parameters: {
        radius: 1,
        color: 0x3b82f6
      },
      duration: 5
    });
    instructions.push({
      type: 'circle',
      parameters: {
        radius: 0.5,
        color: 0x8b5cf6
      },
      duration: 5
    });
  } else if (promptLower.includes('matrix') || promptLower.includes('transformation')) {
    // Matrix transformation visualization
    instructions.push({
      type: 'matrix',
      parameters: {
        size: 3,
        divisions: 10,
        color1: 0x888888,
        color2: 0x444444
      },
      duration: 5
    });
    instructions.push({
      type: 'transform',
      parameters: {
        scale: 2,
        rotate: Math.PI / 4
      },
      duration: 5
    });
  } else if (promptLower.includes('vector') || promptLower.includes('projection')) {
    // Vector projection visualization
    instructions.push({
      type: 'vector',
      parameters: {
        x: 1,
        y: 1,
        z: 0,
        length: 2,
        color: 0x3b82f6
      },
      duration: 5
    });
    instructions.push({
      type: 'vector',
      parameters: {
        x: 1,
        y: 0,
        z: 0,
        length: 1,
        color: 0xff0000
      },
      duration: 5
    });
  } else {
    // Default visualization for any other prompt
    instructions.push({
      type: 'circle',
      parameters: {
        radius: 1.5,
        color: 0x3b82f6
      },
      duration: 5
    });
    instructions.push({
      type: 'vector',
      parameters: {
        x: 1,
        y: 1,
        z: 0,
        length: 2,
        color: 0x8b5cf6
      },
      duration: 5
    });
  }
  
  return instructions;
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
