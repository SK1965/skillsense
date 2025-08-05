# 🚀 AI Resume & JD Analyzer – *SkillSense*

> ✨ Upload your resume and job description to instantly analyze skill match, missing keywords, and get AI-powered improvement suggestions — powered by **Gemini Pro (Google GenAI)**

![screenshot](https://res.cloudinary.com/dolb0no3p/image/upload/v1753967724/hero.png)

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Built%20with-Next.js-000?style=for-the-badge&logo=nextdotjs" />
  <img alt="TailwindCSS" src="https://img.shields.io/badge/Styled%20with-TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss" />
  <img alt="Gemini" src="https://img.shields.io/badge/Powered%20by-Google%20Gemini-FF9800?style=for-the-badge&logo=google" />

</p>

---

## ✨ Key Features

- ✅ Upload resume (PDF, DOC, DOCX)
- ✅ Paste or upload job description
- ✅ Get AI-powered **match score**
- ✅ Visualize matched vs. missing skills
- ✅ Get smart, tailored suggestions
- ✅ Extra tips to make your resume stand out
- ✅ Animated **multi-step loader**
- ✅ Fully responsive + accessible UI
- ✅ State persistence using Zustand
- ✅ Built on **Next.js 14 (App Router)** with TypeScript

---

## 🧠 Tech Stack

| Layer           | Tools/Technologies Used                             |
|----------------|------------------------------------------------------|
| **Frontend**    | Next.js App Router, Tailwind CSS, TypeScript        |
| **State**       | Zustand                                              |
| **Form**        | React Hook Form + Zod                               |
| **AI Model**    | Google Gemini 2.5 Flash (via `@google/genai`)       |
| **Backend**     | Next.js API Routes + pdf-parse for resume parsing   |
| **UI/UX**       | ShadCN UI, Framer Motion, Heroicons, Lucide Icons   |

---

## 📸 Live Demo

🌐 [Try it on Vercel →](https://skillsense.vercel.app)

---

## 📦 Getting Started Locally

### 1️⃣ Clone the repo

```bash
git clone https://github.com/sk1965/skillsense.git
cd skillsense
````

### 2️⃣ Install dependencies

```bash
npm install
# or
yarn install
```

### 3️⃣ Configure environment variables

Create a `.env.local` file:

```bash
GEMINI_API_KEY=your_google_gemini_api_key
```

> 🔑 Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

---

### 4️⃣ Start the development server

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 🚀 Deploy to Production

### 👉 Deploy on Vercel

1. Push code to GitHub
2. Connect repo to [Vercel](https://vercel.com/)
3. Add your `GEMINI_API_KEY` in Vercel project settings
4. Deploy!

✅ Works seamlessly with **Next.js 14 App Router**

---

## 🧠 AI Model – Gemini Pro

We use [Gemini 2.5 Flash](https://deepmind.google/technologies/gemini/) to:

* Extract skills from resume
* Match against job description
* Return:

  * ✅ Match score
  * ✅ Matched & missing skills
  * ✅ AI-powered resume tips
  * ✅ Unique suggestions to stand out

---

## 📈 Coming Soon

* [ ] ✍️ AI-generated improved resume
* [ ] 📄 Cover letter generator
* [ ] 🧑‍🏫 Skill gap roadmap
* [ ] ✏️ In-browser resume editor with AI hints

---

## 🙋‍♂️ Author

Made with ❤️ by **Shivakumar Kamate**

* 🔗 [LinkedIn](https://linkedin.com/in/shivakumar-kamate)
* 💻 [GitHub](https://github.com/sk1965)

---

## 🌟 Star the repo if you found it useful!
