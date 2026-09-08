import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";
import { setUser } from "./redux/features/authSlice";
import {
  resetCollections,
  subscribeToUserCollections,
} from "./redux/features/collectionSlice";
import HomePage from "./components/home";
import SignupPage from "./pages/SignupPage";
import CollectionsPage from "./pages/CollectionsPage";

// ─── App with Routes & Auth Listener ─────────────────────────────────────────
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    let unsubscribeCollections = () => {};

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // Always tear down the previous Firestore listener before setting up a new one.
      unsubscribeCollections();

      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        const userData = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || "User",
          email: firebaseUser.email,
          picture: firebaseUser.photoURL,
        };
        dispatch(setUser({ user: userData, token }));
        // Subscribe to Firestore — this is what drives cross-browser real-time sync.
        // onSnapshot will immediately fire with the latest server state, keeping all
        // browser tabs and devices in sync whenever collections are mutated.
        unsubscribeCollections = subscribeToUserCollections(
          firebaseUser.uid,
          dispatch,
        );
      } else {
        // No authenticated Firebase session — clear state so guest users start fresh.
        // Note: Firebase persists sessions in IndexedDB, so onAuthStateChanged will
        // always resolve to a firebaseUser on reload if the user was previously logged in.
        // Reaching this branch genuinely means the user is logged out.
        dispatch(resetCollections());
      }
    });

    return () => {
      unsubscribe();
      unsubscribeCollections();
    };
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<SignupPage />} />
      <Route path="/collections" element={<CollectionsPage />} />
    </Routes>
  );
}

export default App;
