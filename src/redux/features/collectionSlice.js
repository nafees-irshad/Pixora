import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {doc, getDoc, setDoc} from "firebase/firestore";
import {auth, db} from "../../firebase/firebase";

const DEFAULT_COLLECTION_ID = "default_favorites";

const createDefaultCollections = () => [{
        id: DEFAULT_COLLECTION_ID,
        name: "Favorites",
        createdAt: Date.now(),
        items: []
    },];

const getCurrentUserId = () => {
    try {
        const userStr = localStorage.getItem("pixora_user");
        if (userStr) {
            const u = JSON.parse(userStr);
            return u ?. uid || null;
        }
    } catch (e) {}
    return null;
};

const loadSavedCollections = (specificUid) => {
    try {
        const uid = specificUid !== undefined ? specificUid : getCurrentUserId();
        if (! uid) {
            return [];
        }
        const userKey = `pixora_collections_${uid}`;
        let data = localStorage.getItem(userKey);
        if (! data) { // fallback to legacy key
            data = localStorage.getItem("pixora_collections");
        }
        if (data) {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
        return createDefaultCollections();
    } catch (err) {
        return [];
    }
};

const saveCollectionsToStorage = (collections) => {
    try {
        const uid = getCurrentUserId();
        if (uid) {
            localStorage.setItem(`pixora_collections_${uid}`, JSON.stringify(collections),);
        }
        localStorage.setItem("pixora_collections", JSON.stringify(collections));
        const allItems = collections.flatMap((c) => c.items);
        const uniqueItems = Array.from(new Map(allItems.map((i) => [i.id, i])).values(),);
        localStorage.setItem("pixora_collection", JSON.stringify(uniqueItems));
    } catch (err) {
        console.error("Failed to save collections to localStorage", err);
    }
};

const saveCollectionsToCloud = async (uid, collections) => {
    if (!uid) {
        console.warn("No UID provided, cannot save to cloud");
        return;
    }

    try {
        await setDoc(doc(db, "users", uid), {
            collections,
            updatedAt: Date.now()
        }, {merge: true});
        console.log("Collections saved to Firestore successfully");
    } catch (error) {
        console.error("Failed to save collections to Firestore:", error);
    }
};

export const loadUserCollections = createAsyncThunk("collection/loadUserCollections", async (uid, {dispatch}) => {
    if (!uid) 
        return;
    


    try {
        const docRef = doc(db, "users", uid);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists() && Array.isArray(snapshot.data() ?. collections)) {
            const collections = snapshot.data().collections;
            dispatch(collectionsLoaded(collections));
            saveCollectionsToStorage(collections); // optional cache
            return collections;
        }

        // No data in Firestore → create default
        const defaultCollections = createDefaultCollections();
        await setDoc(docRef, {
            collections: defaultCollections,
            updatedAt: Date.now()
        }, {merge: true});

        dispatch(collectionsLoaded(defaultCollections));
        saveCollectionsToStorage(defaultCollections);
        return defaultCollections;
    } catch (error) {
        console.error("Failed to load collections from Firestore:", error);
        // Only fallback to localStorage if Firestore completely fails
        const local = loadSavedCollections(uid);
        dispatch(collectionsLoaded(local.length > 0 ? local : createDefaultCollections()));
    }
});

const initialCollections = loadSavedCollections();
const initialAllItems = Array.from(new Map(initialCollections.flatMap((c) => c.items).map((i) => [i.id, i]),).values(),);

const collectionSlice = createSlice({
    name: "collection",
    initialState: {
        collections: initialCollections,
        activeCollectionId: initialCollections[0] ?. id || DEFAULT_COLLECTION_ID,
        items: initialAllItems
    },
    reducers: {
        collectionsLoaded: (state, action) => {
            const cols = action.payload;
            state.collections = cols;
            state.activeCollectionId = cols[0] ?. id || DEFAULT_COLLECTION_ID;
            state.items = Array.from(new Map(cols.flatMap((c) => c.items).map((i) => [i.id, i])).values(),);
        },
        resetCollections: (state) => {
            state.collections = [];
            state.activeCollectionId = DEFAULT_COLLECTION_ID;
            state.items = [];
        },
        createCollection: (state, action) => {
            const name = action.payload ?. name ?. trim();
            if (! name) 
                return;
            


            const initialItem = action.payload ?. initialItem;
            const newCol = {
                id: `col_${
                    Date.now()
                }_${
                    Math.random().toString(36).substring(2, 7)
                }`,
                name,
                createdAt: Date.now(),
                items: initialItem ? [initialItem] : []
            };
            state.collections.push(newCol);
            state.activeCollectionId = newCol.id;
            state.items = Array.from(new Map(state.collections.flatMap((c) => c.items).map((i) => [i.id, i]),).values(),);
            saveCollectionsToStorage(state.collections);
            void saveCollectionsToCloud(auth.currentUser ?. uid || getCurrentUserId(), state.collections,);
        },
        addToCollection: (state, action) => {
            const {item, collectionId} = action.payload;
            const targetCol = state.collections.find((c) => c.id === collectionId) || state.collections[0];
            if (targetCol && item) {
                const exists = targetCol.items.some((i) => i.id === item.id);
                if (! exists) {
                    targetCol.items.unshift(item);
                }
            }
            state.items = Array.from(new Map(state.collections.flatMap((c) => c.items).map((i) => [i.id, i]),).values(),);
            saveCollectionsToStorage(state.collections);
            void saveCollectionsToCloud(auth.currentUser ?. uid || getCurrentUserId(), state.collections,);
        },
        deleteCollection: (state, action) => {
            const id = action.payload;
            if (id === DEFAULT_COLLECTION_ID) 
                return;
            

            // Prevent deleting default favorites
            state.collections = state.collections.filter((c) => c.id !== id);
            if (state.activeCollectionId === id) {
                state.activeCollectionId = state.collections[0] ?. id || DEFAULT_COLLECTION_ID;
            }
            state.items = Array.from(new Map(state.collections.flatMap((c) => c.items).map((i) => [i.id, i]),).values(),);
            saveCollectionsToStorage(state.collections);
            void saveCollectionsToCloud(auth.currentUser ?. uid || getCurrentUserId(), state.collections,);
        },
        setActiveCollection: (state, action) => {
            state.activeCollectionId = action.payload;
        },
        toggleCollection: (state, action) => {
            const item = action.payload ?. item || action.payload;
            const targetColId = action.payload ?. collectionId || state.activeCollectionId || DEFAULT_COLLECTION_ID;

            let targetCol = state.collections.find((c) => c.id === targetColId);
            if (! targetCol) {
                targetCol = state.collections[0];
            }

            if (targetCol) {
                const itemIndex = targetCol.items.findIndex((i) => i.id === item.id);
                if (itemIndex >= 0) {
                    targetCol.items.splice(itemIndex, 1);
                } else {
                    targetCol.items.unshift(item);
                }
            }

            state.items = Array.from(new Map(state.collections.flatMap((c) => c.items).map((i) => [i.id, i]),).values(),);
            saveCollectionsToStorage(state.collections);
            void saveCollectionsToCloud(auth.currentUser ?. uid || getCurrentUserId(), state.collections,);
        },
        removeFromCollection: (state, action) => {
            const {id, collectionId} = action.payload ?. id ? action.payload : {
                id: action.payload,
                collectionId: state.activeCollectionId
            };

            state.collections.forEach((col) => {
                if (!collectionId || col.id === collectionId) {
                    col.items = col.items.filter((i) => i.id !== id);
                }
            });

            state.items = Array.from(new Map(state.collections.flatMap((c) => c.items).map((i) => [i.id, i]),).values(),);
            saveCollectionsToStorage(state.collections);
            void saveCollectionsToCloud(auth.currentUser ?. uid || getCurrentUserId(), state.collections,);
        },
        clearCollection: (state, action) => {
            const colId = action.payload || state.activeCollectionId;
            const targetCol = state.collections.find((c) => c.id === colId);
            if (targetCol) {
                targetCol.items = [];
            }
            state.items = Array.from(new Map(state.collections.flatMap((c) => c.items).map((i) => [i.id, i]),).values(),);
            saveCollectionsToStorage(state.collections);
            void saveCollectionsToCloud(auth.currentUser ?. uid || getCurrentUserId(), state.collections,);
        }
    }
});

export const {
    collectionsLoaded,
    resetCollections,
    createCollection,
    addToCollection,
    deleteCollection,
    setActiveCollection,
    toggleCollection,
    removeFromCollection,
    clearCollection
} = collectionSlice.actions;

export default collectionSlice.reducer;
