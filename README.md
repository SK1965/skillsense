# 🚀 AI Resume & JD Analyzer

> ✨ Upload your resume and job description to instantly analyze skill match, missing keywords, and get AI-generated improvement suggestions — powered by Gemini Pro (Google GenAI) ✨

![screenshot](https://res.cloudinary.com/dolb0no3p/image/upload/v1753967724/hero.png)

---

## 📌 Features

- ✅ Upload resume in PDF, DOC, or DOCX format
- ✅ Paste or upload job description
- ✅ Analyze skill match percentage
- ✅ See matched vs. missing skills
- ✅ Get AI-generated suggestions to improve resume
- ✅ Extra tips to make your resume stand out
- ✅ Mobile-friendly, accessible design
- ✅ Animated multi-step loader for better UX
- ✅ Built with **Next.js 14 (App Router)** + **Zustand + TailwindCSS + TypeScript**
- ✅ Powered by **Google Gemini Pro** (via `@google/genai`)

---

## 🛠️ Tech Stack

| Frontend              | Backend            | AI Model                        | Misc                    |
| --------------------- | ------------------ | ------------------------------- | ----------------------- |
| Next.js (App Router)  | Next.js API Routes | Google GenAI (Gemini 2.5 Flash) | Zustand, Tailwind CSS   |
| React Hook Form + Zod | pdf-parse          | Structured Prompt Engineering   | Framer Motion UI Loader |

---

## 📸 Demo

[Skillsense](https://skillsense.vercel.app/)

---

## 📦 Local Development

### 1. Clone the Repo

```bash
git clone https://github.com/sk1965/skillsense.git
cd skillsense
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables

Create a `.env.local` file at the root with:

```bash
GEMINI_API_KEY=your_google_gemini_api_key
```

> 💡 You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey)

---

### 4. Run Dev Server

```bash
npm run dev
```

> Visit [http://localhost:3000](http://localhost:3000)

---

## 🔥 Deployment

### → Vercel (Recommended)

1. Push your code to GitHub
2. Connect repo to [Vercel](https://vercel.com/)
3. Add the `GEMINI_API_KEY` in project settings
4. Deploy 🚀

> It works out of the box with Next.js App Router

---

## 🧠 Powered by LLM

We use **Google Gemini Pro (gemini-2.5-flash)** to:

- Parse and analyze resume text
- Compare against job description
- Return structured JSON with:
  - Match score
  - Skills matched/missing
  - Suggestions
  - Extra edge recommendations

---

## ✨ Future Enhancements

- [ ] AI-generated improved resume
- [ ] Cover letter generator
- [ ] Downloadable PDF reports
- [ ] Resume editor with inline suggestions
- [ ] Skill gap roadmap generator

---

## 👨‍💻 Author

Made with ❤️ by [sk1965](https://github.com/SK1965)

- LinkedIn: [shivakumar kamate](https://linkedin.com/in/shivakumar-kamate)
- GitHub: [sk1965](https://github.com/SK1965)

---

## 📄 License

MIT
