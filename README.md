
# Visual Math Animator

A modern web application that transforms mathematical concepts into beautiful, interactive animations using Manim and AI.


## ✨ Features

- 🎨 Convert natural language descriptions into mathematical animations
- 🤖 Powered by Google's Gemini 1.5 AI for intelligent scene generation
- 📊 Professional-grade animations using Manim
- ⚡ Fast and responsive React-based UI
- 🎯 Multiple quality settings for different use cases
- 📱 Mobile-friendly design
- 🎓 Support for different educational levels and styles

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- Python 3.8 or higher
- Node.js 16 or higher
- FFmpeg
- Manim and its dependencies
- Google Gemini API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/animate-math-ideas.git
cd animate-math-ideas
```

2. Install frontend dependencies:

```bash
npm install
```

3. Install backend dependencies:

```bash
cd backend
pip install -r requirements.txt
```

4. Create a `.env` file in the root directory with your Gemini API key:

```env
GEMINI_API_KEY=your_api_key_here
```

### Running the Application

1. Start the backend server:

```bash
cd backend
python main.py
```

2. In a new terminal, start the frontend development server:

```bash
npm run dev
```

3. Visit `http://localhost:5173` in your browser to use the application.

## 🎮 Usage

1. Enter a mathematical concept you want to visualize
2. Choose the quality level (low, medium, high)
3. Select the educational level (basic, intermediate, advanced)
4. Pick a presentation style (educational, fun, serious)
5. Click "Generate Animation" and wait for your custom animation

**Example prompts:**
- "Explain the Pythagorean theorem with a visual proof"
- "Show how sine waves relate to the unit circle"
- "Demonstrate matrix multiplication step by step"

## 🧠 Tech Stack

### Frontend

- React with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Three.js for web-based animations
- Custom React hooks for mobile and toast notifications

### Backend

- FastAPI (Python)
- Manim for mathematical animations
- Google Gemini 1.5 AI for scene generation
- FFmpeg for video processing

## 🧱 Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── pages/         # Page components
│   └── public/            # Static assets
└── backend/
    ├── main.py            # FastAPI server
    ├── media/             # Generated media files
    ├── temp/              # Temporary files
    └── videos/            # Rendered animations
```

## 🎬 Animation Guidelines

The application follows specific animation guidelines for consistent and professional results:

### Text Timing

- 2-second pauses for new text
- 1-second pauses between steps
- Smooth fade transitions

### Element Management

- Proper positioning to avoid overlap
- Organized grouping of related elements
- Clear visual hierarchy

### Screen Management

- Clean transitions between concepts
- Readable text scaling
- Professional typography

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Manim Community](https://www.manim.community/) for the amazing animation engine
- [Google Gemini](https://deepmind.google/technologies/gemini/) for AI capabilities
- [FastAPI](https://fastapi.tiangolo.com/) for the robust backend framework
- All contributors and users of this project


