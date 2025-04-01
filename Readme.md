# 🏥 Intel MediLink

[![Deployment Status](https://img.shields.io/badge/Frontend-Vercel-success)](https://intel-medi-link.vercel.app)
[![Deployment Status](https://img.shields.io/badge/Backend-Render-blue)](https://intel-medi-link.vercel.app)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

> Advanced healthcare insights powered by AI - analyze food, track health metrics, get personalized recommendations

[Live Demo](https://intel-medi-link.vercel.app) | [Documentation](#documentation) | [Installation](#installation) | [Features](#key-features)

<p align="center">
  <img src="/api/placeholder/800/400" alt="Intel MediLink Banner" />
</p>

## 🚀 Quick Start

### Frontend Setup (React + Vite)

```bash
# Clone the repository
git clone https://github.com/jaisanth123/Intel_MediLink.git

# Navigate to frontend directory
cd Intel_MediLink/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup (Node.js)

```bash
# From project root
cd Intel_MediLink/backend

# Install dependencies
npm install

# Start the server
npm start
```

### ML Backend Setup (Python with FastAPI)

```python
# Run on Kaggle for optimal performance
# 1. Set up Hugging Face token in Kaggle secrets as "hf_token"

# 2. Clone the repository
!git clone https://github.com/jaisanth123/Intel_MediLink.git

# 3. Navigate to Python backend
%cd Intel_MediLink/backend/python

# 4. Install dependencies
!pip install uvicorn fastapi ngrok python-multipart torchvision ngrok transformers huggingface_hub pyttsx3 vaderSentiment openai-whisper

# 5. Start the server
!uvicorn app:app --port 8000
```

## 🌟 Key Features

- **User Authentication** - Secure login and signup with JWT
- **AI-Powered Food Analysis** - Get nutritional insights from food images
- **Health Dashboard** - Track your health metrics in real-time
- **Weekly Medical News** - Stay updated with the latest healthcare developments
- **Sentiment Analysis** - Understand the emotional impact of your dietary choices
- **Responsive Design** - Seamless experience across all devices

## 🏗️ Architecture

The project is built with a three-tier architecture:

1. **Frontend**: React.js with Vite and Tailwind CSS
2. **Node.js Backend**: Express.js server with MongoDB
3. **Python ML Backend**: FastAPI with Hugging Face models

<p align="center">
  <img src="/api/placeholder/700/350" alt="Architecture Diagram" />
</p>

## 📋 Documentation

### API Endpoints

| Endpoint               | Method | Description             | Auth Required |
| ---------------------- | ------ | ----------------------- | ------------- |
| `/api/auth/login`      | POST   | User login              | No            |
| `/api/auth/signup`     | POST   | User registration       | No            |
| `/api/food/analyze`    | POST   | Analyze food image      | Yes           |
| `/api/health/insights` | GET    | Get health insights     | Yes           |
| `/api/news/weekly`     | GET    | Get weekly medical news | Yes           |

### Environment Variables

Create a `.env` file in both backend directories:

#### Node.js Backend

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```

#### Python Backend

```
HF_TOKEN=your_huggingface_token
```

## 🔄 Deployment

- **Frontend**: Deployed on [Vercel](https://intel-medi-link.vercel.app)
- **Node.js Backend**: Deployed on [Render](https://intel-medi-link.vercel.app)
- **Python ML Backend**: Currently running on Kaggle

> **Note**: The weekly news feature uses a free API that only works on localhost. For deployed versions, this feature is demonstrated in a video walkthrough.

## 🧪 Running Tests

```bash
# Run frontend tests
cd frontend
npm test

# Run backend tests
cd ../backend
npm test
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- GitHub: [@jaisanth123](https://github.com/jaisanth123)
- Project Link: [https://github.com/jaisanth123/Intel_MediLink](https://github.com/jaisanth123/Intel_MediLink)

---

<p align="center">
  Made with ❤️ by the Intel MediLink team
</p>
