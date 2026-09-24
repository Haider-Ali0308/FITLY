
# 💪 Fitly – AI-Powered Fitness & Meal Planning Web App

**Fitly** is an intelligent fitness and meal planning application developed using the **MERN stack** (MongoDB, Express.js, React.js, Node.js). It helps users adopt a healthier lifestyle by generating personalized **exercise routines** and **meal plans**, tracking daily progress, and providing smart recommendations using **Google Gemini API**.

## 🚀 Features

- 🧠 **AI-Powered Recommendations**  
  Dynamic and personalized meal and workout plans powered by Google Gemini API.

- 📋 **User Profiles**  
  Register, log in, and set your physical stats, fitness goals, dietary preferences, and restrictions.

- 🍽️ **Smart Meal Plans**  
  Get meal suggestions tailored to your caloric and nutritional needs.

- 🏋️ **Custom Workout Plans**  
  AI-curated routines based on your fitness goals and body metrics.

- 📊 **Progress Dashboard**  
  Track your meals, workouts, and health stats in real-time with data visualization.

- 🔁 **Adaptive Planning**  
  Plans evolve based on your feedback and behavior over time.

- 🌐 **Responsive Design**  
  Fully responsive and mobile-friendly interface using Tailwind CSS.

---

## 🛠️ Tech Stack

| Layer          | Technology               |
|----------------|--------------------------|
| **Frontend**   | React.js, Tailwind CSS   |
| **Backend**    | Node.js, Express.js      |
| **Database**   | MongoDB Atlas            |
| **AI Integration** | Google Gemini API        |
| **Hosting**    | Vercel (frontend), Render (backend) |
| **Version Control** | Git & GitHub         |

---

## 🧠 AI Integration – Google Gemini API

Fitly uses the **Google Gemini API** to:
- Generate conversational and context-aware meal and workout plans.
- Provide health and fitness tips based on user questions.
- Modify plans based on behavioral patterns and preferences.

This integration enables a **conversational fitness assistant** experience, making Fitly more interactive and human-like in responses.

---

## 📁 Project Structure

```

fitly/
│
├── client/                 # React Frontend
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── App.js
│
├── server/                 # Express Backend
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── app.js
│
├── ai/                     # AI Logic (Gemini API integration)
│   └── geminiService.js
│
├── .env                    # Environment variables
├── package.json
└── README.md

````

---

## 📦 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/fitly.git
cd fitly
````

### 2. Setup Environment Variables

Create a `.env` file in both `client/` and `server/` directories and add:

**Client (`client/.env`):**

```
REACT_APP_BACKEND_URL=http://localhost:5000
```

**Server (`server/.env`):**

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
```

### 3. Install Dependencies

```bash
# For frontend
cd client
npm install

# For backend
cd ../server
npm install
```

### 4. Run the App

```bash
# Backend
cd server
npm run dev

# Frontend (in another terminal)
cd client
npm start
```

---

## 📊 Datasets Used

* **Exercise & Fitness Dataset** (Kaggle)
* **Nutrition & Meal Dataset** (Kaggle)

These datasets were used to train the recommendation logic and build AI prompts for Gemini API integration.

---

## 🔮 Future Enhancements

* Integration with wearable fitness devices.
* Mobile app version (React Native).
* Gamification features (badges, streaks).
* Voice assistant support.
* Community/social sharing module.

---

## 🤝 Authors

* \[Your Name] – Full-Stack Developer
* \[Any Collaborators]
* Supervised by: *\[Supervisor's Name]*

---

## 📜 License

This project is licensed under the MIT License.

---

## 🙌 Acknowledgements

* Google Gemini API for AI integration
* Kaggle for fitness and nutrition datasets
* OpenAI ChatGPT & Gemini for ideation and development support

```

---

Would you like this exported as a downloadable **README.md** file or added to your GitHub repo?
```
