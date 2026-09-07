# Pixora 📸🎬✨

Pixora is an image, video, and GIFs searching tool. You can search, add to favorites, and make a collection.

---

## 🌟 Key Features

- **Multi-Media Search**: Search across thousands of high-quality stock photos, HD videos, and animated GIFs in real time.
- **Collection Folders**: Organize your media into visual folder cards with dynamic multi-image collage previews.
- **Favorites System**: Quickly like media items to save them directly to your Favorites folder.
- **Save to Collection Modal**: Easily save media into existing custom folders or create a new collection folder on the fly.
- **Full Media Viewer**: Inspect media in high resolution, preview videos with autoplay, copy direct links, and download assets.
- **Google Authentication**: Secure user login and signup powered by Firebase Authentication with user-scoped collections.
- **Dark & Light Mode**: Smooth theme switching with custom typography (Outfit & Gabarito).

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & [React-Redux](https://react-redux.js.org/)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Authentication**: [Firebase Auth](https://firebase.google.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **APIs**:
  - **Photos**: [Unsplash API](https://unsplash.com/developers)
  - **Videos**: [Pexels API](https://www.pexels.com/api/)
  - **GIFs**: [Klipy API](https://klipy.com/)

---

## 🚀 Getting Started

Follow these steps to set up and run Pixora locally on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/pixora.git
cd pixora
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory and add your API keys:

```env
# Media API Keys
VITE_UNSPLASH_KEY=your_unsplash_access_key
VITE_PEXELS_KEY=your_pexels_api_key
VITE_KLIPY_KEY=your_klipy_api_key

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

### 4. Run the Application

Start the local development server:

```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:5173
```

---

## 📦 Available Scripts

- `npm run dev`: Runs the app in development mode with Hot Module Replacement (HMR).
- `npm run build`: Builds the app for production in the `dist` directory.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Runs ESLint to check for code quality and syntax issues.

---

## 📂 Project Structure

```
Pixora/
├── src/
│   ├── api/              # API callers for Unsplash, Pexels, and Klipy
│   ├── components/       # Reusable UI components (ResultCard, MediaModal, FolderCard, etc.)
│   ├── firebase/         # Firebase configuration and auth provider
│   ├── pages/            # Page views (HomePage, CollectionsPage, SignupPage)
│   ├── redux/            # Redux store and feature slices (auth, collection, search)
│   ├── App.jsx           # Main router & auth listener
│   ├── index.css         # Tailwind & theme variables
│   └── main.jsx          # Entry point
├── index.html
├── package.json
└── vite.config.js
```
