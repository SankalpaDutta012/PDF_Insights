# PDF Analyzer

PDF Analyzer is an intelligent document management system that revolutionizes how you interact with your personal PDF library. Instead of treating documents as isolated files, our application creates connections between related content across your entire collection.

## What We Built

We've developed a comprehensive solution that combines advanced AI technologies with intuitive user experience design. The system analyzes your uploaded PDFs using semantic understanding to identify relationships between different sections, documents, and concepts. Users can simply select any text passage to instantly discover related content from their entire library, creating a web of knowledge that helps surface insights that might otherwise remain hidden.

The application goes beyond simple document viewing by offering AI-powered analysis, natural language querying in multiple languages, and even audio summaries for accessibility and convenience.

## Link : https://pdf-analyze-rose.vercel.app

## 🌟 Features

### 📄 High-Fidelity PDF Viewer
- Seamlessly upload and view multiple PDF documents
- Full fidelity rendering with zoom and pan controls
- Powered by the Adobe PDF Embed API for professional-grade viewing

### 🔗 Semantic Document Linking
- Select any text within a document to discover related content
- Instantly surface semantically similar sections from your entire library
- AI-powered cross-document connections help you find relevant information

### 🎯 Smart Navigation
- Click any found snippet to jump directly to the source
- Automatic PDF opening and section highlighting
- Contextual navigation across your document collection

### 💡 AI-Powered Insights
- **Insights Bulb**: Generate interesting facts and key takeaways with one click
- Discover surprising details and hidden connections in your documents
- Extract meaningful insights from complex content

### 🤖 Multilingual AI Assistant
- Natural language chatbot supporting English, Hindi, and Bengali
- Get answers grounded in your uploaded document content
- Ask questions and receive contextually relevant responses

### 🎧 Audio Overview & Podcast Mode
- Generate concise audio summaries of your documents
- Multi-lingual text-to-speech capabilities
- Perfect for on-the-go learning and review

## 🏗️ Architecture

This application follows a modern microservices architecture with containerized deployment:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    Frontend     │    │   Core Backend  │    │ Features Service│
│                 │    │                 │    │                 │
│  React + Vite   │◄──►│  Python FastAPI │◄──►│   Node.js       │
│  Tailwind CSS   │    │  Transformers   │    │   Express.js    │
│  Adobe PDF API  │    │  PyTorch, NLTK  │    │   Gemini API    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Tech Stack

#### Frontend
- **React** with Vite for fast development and building
- **Tailwind CSS** for responsive, utility-first styling
- **Adobe PDF Embed API** for professional PDF rendering

#### Backend (Core Logic)
- **Python** with FastAPI for high-performance API development
- **Sentence-Transformers** for semantic text analysis
- **PyTorch** for deep learning model execution
- **NLTK** for natural language processing

#### Features Service (AI/TTS)
- **Node.js** with Express.js for lightweight service architecture
- **Google Gemini API** for advanced AI capabilities
- **Microsoft Azure Text-to-Speech** for multi-lingual audio generation

#### Orchestration
- **Docker Compose** for simplified multi-container deployment
- Containerized microservices for scalability and maintainability

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (required)
- Git (for cloning the repository)

### Installation & Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/Hrita0910/PDF_Analyzer.git
cd PDF_Analyzer
```

#### 2. Configure Environment Variables
Create a `.env` file in the Features folder:

```bash
New-Item -Path Features\.env -ItemType File
```
Add the following configuration to your `.env` file:

```env
# Google Gemini API Configuration (From Google AI Studio)
GEMINI_API_KEY=your_gemini_api_key_here 

# Microsoft Azure Text-to-Speech Configuration (From portal.azure.com -> create a resource for Speech -> Go to Manage Keys)
AZURE_SPEECH_KEY=your_azure_tts_key_here
AZURE_SPEECH_REGION=your_azure_region_here
```
Create a `.env` file in the Frontend folder:

```bash
New-Item -Path Frontend\.env -ItemType File
```
Add the following configuration to your `.env` file:

```env
VITE_ADOBE_CLIENT_ID_LH=628c0718047f4a0eaaccc8a09c8e3130   
VITE_ADOBE_CLIENT_ID_PROD=16a2f3d7661744c2a79e2f6283c1c8d5 
```

Create a `.env` file in the project root directory:

```bash
New-Item -Path .env -ItemType File
```

Add the following configuration to your `.env` file:

```env
VITE_ADOBE_CLIENT_ID_LH=628c0718047f4a0eaaccc8a09c8e3130
VITE_ADOBE_CLIENT_ID_PROD=16a2f3d7661744c2a79e2f6283c1c8d5

# Google Gemini API Configuration (From Google AI Studio)
GEMINI_API_KEY=your_gemini_api_key_here 

# Microsoft Azure Text-to-Speech Configuration (From portal.azure.com -> create a resource for Speech -> Go to Manage Keys)
AZURE_SPEECH_KEY=your_azure_tts_key_here
AZURE_SPEECH_REGION=your_azure_region_here
```

> **📝 Note**: Replace the placeholder values with your actual API credentials.

#### 3. Build and Deploy
```bash
docker-compose up --build
```

This command will:
- Build Docker images for all services
- Download required dependencies and ML models
- Start all containers in the correct order
- Establish inter-service networking

> **⏰ First Run**: Initial build may take 15-20 minutes due to large ML libraries. Subsequent runs will be much faster thanks to Docker caching.

#### 4. Access the Application
Once all services are running, open your browser and navigate to:

**🌐 http://localhost:8080**

## 📋 Usage Guide

### Getting Started
1. **Upload Documents**: Drag and drop PDF files or use the upload button
2. **Explore Content**: Use the PDF viewer to navigate through your documents
3. **Find Connections**: Select text to discover related content across your library
4. **Get Insights**: Click the insights bulb for AI-generated takeaways
5. **Ask Questions**: Use the chatbot to query your document collection
6. **Listen on the Go**: Generate audio summaries for mobile learning

### Supported Languages
- **English** - Full feature support
- **Hindi** - Chatbot and TTS support
- **Bengali** - Chatbot and TTS support

## 🐳 Docker Services

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 8080 | React application with PDF viewer |
| Backend | 8000 | FastAPI server with ML models |
| Features | 3000 | AI and TTS service endpoints |

## 🛠️ Development

### Local Development Setup
```bash
# Frontend
cd Frontend
npm install
npm run dev

# Backend
cd Backend
python app.py

# Features Service
cd Features
npm install
node server.js
```

### Project Structure
```
PDF_Analyzer/
├── Frontend/           # React application
├── Backend/           # Python FastAPI service
├── Features/          # Node.js AI/TTS service
├── docker-compose.yml # Container orchestration
├── .env              # Environment configuration
└── README.md         # This file
```
