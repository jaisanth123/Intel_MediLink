# 🏥 Intel MediLink

[![Deployment Status](https://img.shields.io/badge/Frontend-Vercel-success)](https://intel-medi-link.vercel.app)
[![Deployment Status](https://img.shields.io/badge/Backend-Render-blue)](https://intel-medi-link.vercel.app)
[![Kaggle Notebook](https://img.shields.io/badge/ML_Backend-Kaggle-orange)](https://www.kaggle.com/code/jaisanthk/intel-project-hospital)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

> Advanced healthcare insights powered by AI - analyze food, track health metrics, get personalized recommendations

[Live Demo](https://intel-medi-link.vercel.app) | [Documentation](#documentation) | [Installation](#installation) | [Features](#key-features)

<p align="center">
  <img src="/api/placeholder/800/400" alt="Intel MediLink Banner" />
</p>

## 🚀 Quick Start

### Option 1: Use the Deployed Version (Recommended)

The application is fully deployed and ready to use:

- **Frontend**: Available at [https://intel-medi-link.vercel.app](https://intel-medi-link.vercel.app)
- **Node.js Backend**: Already running on Render
- **Python ML Backend**: Running on Kaggle

Simply visit the [live demo](https://intel-medi-link.vercel.app) to use the application without any setup!

### Option 2: Run Frontend Locally (with deployed backends)

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

### ML Backend (Python with FastAPI) - Kaggle Only

> ⚠️ **Important**: The Python backend must be run on Kaggle for optimal performance, not locally.

To access or run the Python ML backend:

1. Visit the [Kaggle notebook](https://www.kaggle.com/code/jaisanthk/intel-project-hospital/edit)
2. Set up your Hugging Face token in Kaggle secrets as "hf_token"
3. Run the notebook cells

```python
# ONLY RUN THIS ON KAGGLE - DO NOT RUN LOCALLY
# 1. Set up Hugging Face token in Kaggle secrets as "hf_token"
import os
from kaggle_secrets import UserSecretsClient
user_secrets = UserSecretsClient()
hf_token = user_secrets.get_secret("hf_token")
print(hf_token)

# 2. Login to Hugging Face
from kaggle_secrets import UserSecretsClient
from huggingface_hub import login

user_secrets = UserSecretsClient()
HF_TOKEN = user_secrets.get_secret("hf_token")

# Log in to Hugging Face
login(token=HF_TOKEN)
print("Successfully logged into Hugging Face!")
# 3. Clone the repository
!git clone https://github.com/jaisanth123/Intel_MediLink.git
# 4. Navigate to Python backend

%cd Intel_MediLink/backend/python

# 5. Install dependencies
!pip install uvicorn fastapi ngrok python-multipart torchvision ngrok transformers huggingface_hub pyttsx3 vaderSentiment openai-whisper

# 6. Start the server
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

1. **Frontend**: React.js with Vite and Tailwind CSS (deployed on Vercel)
2. **Node.js Backend**: Express.js server with MongoDB (deployed on Render)
3. **Python ML Backend**: FastAPI with Hugging Face models (running on Kaggle)

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

Only needed if you're setting up your own deployment:

#### Node.js Backend

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```

#### Python Backend (Kaggle)

Set up the Hugging Face token in your Kaggle secrets:

- Secret name: `hf_token`
- Secret value: Your Hugging Face API token

> **Important**: While logging in, use the following Hugging Face token as a secret:
>
> `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`
>
> This token has been provided for review purposes. After the review, I will remove it.

## 🔄 Deployment Status

- **Frontend**: Deployed on [Vercel](https://intel-medi-link.vercel.app)
- **Node.js Backend**: Deployed on [Render](https://intel-medi-link.vercel.app)
- **Python ML Backend**: Running on [Kaggle](https://www.kaggle.com/code/jaisanthk/intel-project-hospital/edit)

> **Note**: The weekly news feature uses a free API that only works on localhost. For deployed versions, this feature is demonstrated in a video walkthrough.

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
