from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os
import uuid
import subprocess
from pathlib import Path
from typing import Optional
import sys
import logging
import shutil
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash-latest')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite's default port
        "http://localhost:8080",  # Alternative development port
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8080"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create necessary directories
BASE_DIR = Path(__file__).parent.absolute()
VIDEOS_DIR = BASE_DIR / "videos"
MEDIA_DIR = BASE_DIR / "media"
TEMP_DIR = BASE_DIR / "temp"

# Create all required directories
for directory in [VIDEOS_DIR, MEDIA_DIR, TEMP_DIR]:
    directory.mkdir(exist_ok=True)

class AnimationRequest(BaseModel):
    prompt: str
    quality: Optional[str] = "medium"  # low, medium, high
    level: Optional[str] = "intermediate"  # basic, intermediate, advanced
    style: Optional[str] = "educational"   # fun, serious, engaging

def detect_topic(prompt: str) -> str:
    """Detect the mathematical topic from the prompt."""
    topics = {
        "calculus": ["derivative", "integral", "limit", "differentiation", "integration"],
        "algebra": ["equation", "factor", "solve", "polynomial", "quadratic"],
        "geometry": ["circle", "triangle", "area", "pythagorean", "perimeter", "volume"],
        "linear algebra": ["matrix", "vector", "eigenvalue", "determinant", "transformation"],
        "statistics": ["probability", "distribution", "mean", "median", "standard deviation"],
        "trigonometry": ["sine", "cosine", "tangent", "angle", "trigonometric"]
    }
    
    for topic, keywords in topics.items():
        for word in keywords:
            if word in prompt.lower():
                return topic
    return "general"

def enrich_prompt(prompt: str) -> str:
    """Enrich the prompt with additional context based on keywords."""
    keyword_map = {
        "pythagorean": "The Pythagorean theorem states that in a right-angled triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides.",
        "derivative": "The derivative of a function represents the rate at which the function value changes as its input changes. Visualize it as the slope of a tangent line.",
        "matrix multiplication": "Matrix multiplication involves taking the dot product of rows and columns. Animate using two matrices and their product step-by-step.",
        "integration": "Integration is the process of finding the area under a curve. Show the Riemann sum approximation and its convergence to the actual area.",
        "eigenvalue": "Eigenvalues represent the scaling factor of eigenvectors in a linear transformation. Visualize how vectors are scaled but maintain their direction.",
        "probability": "Probability measures the likelihood of an event occurring. Show the sample space and how probabilities are calculated."
    }

    for key, expansion in keyword_map.items():
        if key in prompt.lower():
            return f"{prompt}. Context: {expansion}"
    return prompt

def build_contextual_prompt(prompt: str, level: str = "intermediate", style: str = "educational") -> str:
    """Build a detailed prompt for Gemini with context and guidelines."""
    topic = detect_topic(prompt)
    
    style_guidance = {
        "fun": "Use playful colors and smooth transitions. Include some element of surprise or discovery.",
        "serious": "Focus on precise mathematical accuracy and formal presentation.",
        "educational": "Break down concepts into clear, digestible steps with explanatory text."
    }
    
    level_guidance = {
        "basic": "Keep explanations simple and intuitive. Use basic shapes and clear labels.",
        "intermediate": "Include some mathematical notation and intermediate-level concepts.",
        "advanced": "Incorporate complex mathematical notation and deeper theoretical concepts."
    }
    
    return f"""
You are an expert Python developer using the Manim library to visually explain math and science concepts.

### Task:
Write the Python code for the `construct(self)` method of a Manim Scene that teaches the following concept visually and clearly:

**Concept:** {prompt}
**Topic:** {topic}
**Level:** {level}
**Style:** {style}

### Guidelines:
- Use clear and modern Manim constructs (Text, MathTex, always use `.scale()` for better visuals).
- Break down the concept step-by-step with animations (e.g., arrows, object movements, color highlighting).
- Annotate the scene with brief `Text()` elements to explain transitions.
- Make it friendly for a {level}-level audience.
- {style_guidance.get(style, "")}
- {level_guidance.get(level, "")}
- DO NOT include `import` statements or markdown fences.
- Ensure the animation contains **minimum 3 visual transitions**.
- Ensure code is syntactically correct and properly indented (4 spaces per level).

### Output:
Return only the body of the `construct(self)` method as valid Python code.
"""

def generate_manim_scene(prompt: str, level: str = "intermediate", style: str = "educational") -> tuple[str, str]:
    """Generate a Manim scene based on the prompt using Gemini API, with fallback and proper indentation."""
    scene_name = f"Scene_{uuid.uuid4().hex[:8]}"
    try:
        # Enrich and build the prompt
        enriched_prompt = enrich_prompt(prompt)
        gemini_prompt = build_contextual_prompt(enriched_prompt, level, style)
        
        # Get response from Gemini
        response = model.generate_content(gemini_prompt)
        scene_code = response.text

        # Clean and indent each line by 8 spaces for correct placement inside construct()
        indented_code_lines = []
        for line in scene_code.splitlines():
            cleaned_line = line.strip()
            # Skip empty lines, markdown fences, and potential import statements
            if not cleaned_line or cleaned_line in ['```python', '```'] or cleaned_line.startswith('from manim import'):
                continue
            # Add 8 spaces indentation to the original line (preserving internal spacing if any)
            indented_code_lines.append("        " + line.lstrip())

        indented_code = "\n".join(indented_code_lines)
        
        # Wrap the generated code in a proper Manim scene class
        wrapped_code = f"""
from manim import *

class {scene_name}(Scene):
    def construct(self):
{indented_code}
"""
        
        return wrapped_code, scene_name
        
    except Exception as e:
        logger.error(f"Error generating scene with Gemini: {str(e)}")
        # Fallback to a simple animation if Gemini fails
        fallback_code = generate_fallback_scene(prompt)
        wrapped_code = f"""
from manim import *

class {scene_name}(Scene):
    def construct(self):
{fallback_code}
"""
        return wrapped_code, scene_name

def generate_fallback_scene(prompt: str) -> str:
    """Generate a fallback scene if Gemini API fails."""
    return """
        # Create a simple circle
        circle = Circle()
        circle.set_fill(BLUE, opacity=0.5)
        circle.set_stroke(WHITE, width=2)
        
        # Add the circle to the scene
        self.play(Create(circle))
        
        # Add a label
        label = Text("Math Concept", font_size=24).next_to(circle, UP)
        self.play(Write(label))
        
        self.wait(2)
    """

def check_manim_installation():
    """Check if Manim is properly installed and accessible."""
    try:
        result = subprocess.run(
            ["python", "-m", "manim", "--version"],
            capture_output=True,
            text=True,
            check=True
        )
        logger.info(f"Manim version: {result.stdout.strip()}")
        return True
    except subprocess.CalledProcessError as e:
        logger.error(f"Manim version check failed: {e.stderr}")
        return False
    except FileNotFoundError:
        logger.error("Manim command not found. Please ensure Manim is installed and in PATH")
        return False

@app.post("/generate")
async def generate_animation(request: AnimationRequest):
    try:
        # Check Manim installation first
        if not check_manim_installation():
            raise HTTPException(
                status_code=500,
                detail="Manim is not properly installed or accessible"
            )

        # Generate unique ID for this animation
        animation_id = str(uuid.uuid4())
        output_dir = VIDEOS_DIR / animation_id
        output_dir.mkdir(exist_ok=True)
        
        # Generate Manim scene code using Gemini with level and style
        scene_code, scene_name = generate_manim_scene(
            request.prompt,
            level=request.level,
            style=request.style
        )
        
        # Write scene to temporary file with explicit UTF-8 encoding
        scene_file = output_dir / f"{scene_name}.py"
        with open(scene_file, "w", encoding="utf-8") as f:
            f.write(scene_code)
        
        # Set quality flags based on request
        quality_flags = {
            "low": "-ql",
            "medium": "-qm",
            "high": "-qh"
        }
        quality_flag = quality_flags.get(request.quality, "-qm")
        
        # Set environment variables for Manim
        env = os.environ.copy()
        env["MANIM_MEDIA_DIR"] = str(MEDIA_DIR.absolute())
        
        # Run Manim with the correct command
        cmd = [
            "python", "-m", "manim",
            quality_flag,
            str(scene_file),
            scene_name
        ]
        
        logger.info(f"Running Manim command: {' '.join(cmd)}")
        
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            check=True,
            env=env,
            cwd=str(BASE_DIR)  # Set working directory to backend folder
        )
        
        logger.info(f"Manim output: {result.stdout}")
        
        # Look for the generated video in all possible quality directories
        possible_paths = [
            MEDIA_DIR / "videos" / scene_name / "480p15" / f"{scene_name}.mp4",
            MEDIA_DIR / "videos" / scene_name / "720p30" / f"{scene_name}.mp4",
            MEDIA_DIR / "videos" / scene_name / "1080p60" / f"{scene_name}.mp4",
            output_dir / f"{scene_name}.mp4"  # Check if it was created directly in output_dir
        ]
        
        # Log all possible paths for debugging
        logger.info("Checking for video in paths:")
        for path in possible_paths:
            logger.info(f"Checking path: {path} (exists: {path.exists()})")
        
        output_file = None
        for path in possible_paths:
            if path.exists():
                output_file = path
                logger.info(f"Found video at: {path}")
                break
        
        if output_file:
            # If the file is in media directory, move it to output directory
            if MEDIA_DIR in output_file.parents:
                final_path = output_dir / f"{scene_name}.mp4"
                logger.info(f"Moving video from {output_file} to {final_path}")
                shutil.move(str(output_file), str(final_path))
                # Clean up media directory
                shutil.rmtree(MEDIA_DIR / "videos" / scene_name, ignore_errors=True)
                output_file = final_path
            
            logger.info(f"Returning video URL for file: {output_file}")
            return {
                "id": animation_id,
                "video_url": f"/videos/{animation_id}/{scene_name}.mp4"
            }
        else:
            logger.error("No video file found in any of the expected locations")
            raise HTTPException(
                status_code=500,
                detail="Animation file was not created"
            )
        
    except subprocess.CalledProcessError as e:
        logger.error(f"Manim execution failed: {e.stderr}")
        raise HTTPException(
            status_code=500,
            detail=f"Animation generation failed: {e.stderr}"
        )
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error: {str(e)}"
        )

@app.get("/videos/{animation_id}/{filename}")
async def get_video(animation_id: str, filename: str):
    video_path = VIDEOS_DIR / animation_id / filename
    if not video_path.exists():
        raise HTTPException(status_code=404, detail="Video not found")
    return FileResponse(video_path)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5001) 