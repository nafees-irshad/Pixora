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
        unsubscribeCollections = subscribeToUserCollections(
          firebaseUser.uid,
          dispatch,
        );
      } else {
        const hasLocalUser = localStorage.getItem("pixora_user");
        if (!hasLocalUser) {
          dispatch(resetCollections());
        }
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
