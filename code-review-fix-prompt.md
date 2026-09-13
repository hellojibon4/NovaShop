# 🔧 Code Editor AI Prompt - Website Issues Fix করার জন্য

## কীভাবে ব্যবহার করবেন:
**আপনার Code Editor এ (VS Code, etc) যেকোনো AI Extension (Copilot/Claude) খুলুন এবং এই prompt টি paste করুন:**

---

## 📋 MAIN PROMPT

```
আমার একটি ecommerce website আছে (NovaShop) যা Netlify এ hosted। 
আমি আমার সম্পূর্ণ source code দিচ্ছি - তুমি analyze করে নিচের কাজগুলো করবে:

### ১. ANALYZE করার বিষয়সমূহ:

#### 🎯 Performance Issues
- Page load time slow কিনা check করো
- Unnecessary images, CSS, JS size বড় কিনা
- Unused code আছে কিনা
- API calls optimize করা যায় কিনা
- Browser caching implement আছে কিনা

#### 🎨 UI/UX Issues
- Responsive design properly implement আছে কিনা (mobile, tablet, desktop)
- Color contrast এ accessibility problem আছে কিনা
- Button/form validation proper কিনা
- Loading states, error messages দেখা যাচ্ছে কিনা
- Navigation smooth এবং logical কিনা

#### 🔒 Security Issues
- XSS vulnerability আছে কিনা
- CORS properly configure করা আছে কিনা
- Sensitive data expose হচ্ছে কিনা
- Input validation implement আছে কিনা
- Environment variables properly use হচ্ছে কিনা

#### 📱 SEO Issues
- Meta tags সঠিকভাবে set করা আছে কিনা
- Heading structure (H1, H2, H3) logical কিনা
- Open Graph tags আছে কিনা
- Sitemap এবং robots.txt আছে কিনা

#### 💻 Code Quality Issues
- Code duplication আছে কিনা
- Functions properly documented কিনা (comments)
- Naming conventions consistent কিনা
- Error handling proper কিনা
- Type checking (if using TypeScript) implement আছে কিনা

#### 🐛 Bugs & Logic Issues
- Console errors/warnings আছে কিনা
- Edge cases handle করা হয়েছে কিনা
- Data validation implement আছে কিনা
- State management properly handle করা হয়েছে কিনা (if using React/Vue)

### ২. DETAILED REPORT দিতে হবে:

প্রতিটি issue এর জন্য:
- **Issue Name**: কি সমস্যা
- **Severity**: Critical / High / Medium / Low
- **Location**: কোন file/line এ আছে
- **Problem**: সমস্যা বিস্তারিত ব্যাখ্যা করো
- **Solution**: কীভাবে fix করবে step by step
- **Code Example**: Fixed code example দাও

### ৩. PRIORITY তে sort করো:
1. Critical/Security issues first
2. Performance issues
3. UX/UI issues
4. Code quality improvements

### ৪. Output Format:

```markdown
## 🚨 CRITICAL ISSUES (Must Fix)
[Critical issues list]

## ⚠️ HIGH PRIORITY (Should Fix)
[High priority issues]

## 📋 MEDIUM PRIORITY (Nice to Have)
[Medium issues]

## 💡 SUGGESTIONS (Best Practices)
[Suggestions]

## ✅ SUMMARY
- Total Issues Found: X
- Critical: X
- High: X
- Medium: X
```

### ৫. প্রতিটি issue এর জন্য provide করো:
✅ Before (wrong code)
✅ After (correct code)
✅ Explanation (বাংলায় explain করো)
✅ Why it matters
✅ Implementation steps
```

---

## 🔄 FOLLOW-UP QUESTIONS (যদি AI কিছু clear না বুঝে):

1. "কোন specific feature তে issue আছে?"
2. "কোন browser/device এ problem দেখা যাচ্ছে?"
3. "Performance এর জন্য target load time কত হওয়া উচিত?"
4. "Backend API আছে কিনা, নাকি static site?"
5. "কোন framework/library ব্যবহার করেছো?" (React, Vue, Vanilla JS, etc)

---

## 📝 USAGE STEPS:

### Step 1: Code Upload করো
```
এই prompt এর পরে আপনার সম্পূর্ণ source code share করো (files/folders):
- HTML files
- CSS files
- JavaScript files
- Any configuration files (package.json, etc)
```

### Step 2: Specific Issues জানাও (optional)
```
"আমি notice করেছি যে website slow load হচ্ছে"
"Mobile view এ header broken দেখা যাচ্ছে"
```

### Step 3: AI Response ব্যবহার করো
- প্রতিটি issue একে একে fix করো
- Code example অনুযায়ী implementation করো
- Test করো thoroughly

---

## 🎯 ADVANCED VARIATIONS:

### শুধু Performance Fix করতে:
"আমার website slow load হচ্ছে। Performance optimize করার জন্য সব issues find করো এবং step-by-step solution দাও।"

### শুধু Mobile Fix করতে:
"Mobile view broken দেখা যাচ্ছে। Responsive design issues identify করো এবং সব CSS fixes দাও।"

### শুধু Security Audit:
"Security vulnerabilities check করো এবং all security issues fix করার code দাও।"

### Code Quality Improvement:
"Code quality improve করার জন্য refactoring suggestions দাও। DRY principle apply করো, code duplication remove করো।"

---

## ⚙️ EXTRA TIPS:

1. **File structure clear করো**: 
   ```
   src/
   ├── index.html
   ├── styles.css
   ├── app.js
   └── components/
   ```

2. **Environment setup mention করো**:
   ```
   Framework: React / Vue / Vanilla
   Node version: 16+
   Package manager: npm / yarn
   Build tool: Webpack / Vite
   ```

3. **Expected vs Actual behavior বলো**:
   ```
   Expected: Page load in 2 seconds
   Actual: Page load takes 8 seconds
   ```

4. **Browser console errors paste করো** (থাকলে)

---

## 📌 REMEMBER:

✨ যত বেশি detail দেবে, তত ভালো solution পাবে
✨ Code share করার সময় sensitive info (API keys) remove করো
✨ Each fix test করার পরে next issue এ move করো
✨ Questions ask করতে ভয় পাবে না

---

**Happy Coding! 🚀**
```

---

## কিভাবে Use করবেন:

### Option 1️⃣: VS Code + Copilot/Claude Extension
1. Code Editor খুলো
2. এই prompt সম্পূর্ণ copy করো
3. AI Chat এ paste করো
4. আপনার code paste করো
5. Analysis পাবে automatically

### Option 2️⃣: ChatGPT/Claude Web
1. Chat open করো
2. এই prompt paste করো
3. Code share করো
4. Detailed analysis পাবে

### Option 3️⃣: Quick Fix করতে
নির্দিষ্ট issue এর জন্য:
```
"এই code এ [specific issue] আছে। এটা fix করো: [code paste]"
```

---

চাইলে এই prompt এ আরও কিছু যোগ করতে পারি! আপনার কোন specific issue আছে? 🎯
