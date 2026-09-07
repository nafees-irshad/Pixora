import {createSlice} from "@reduxjs/toolkit";

const DEFAULT_COLLECTION_ID = "default_favorites";

const getCurrentUserId = () => {
    try {
        const userStr = localStorage.getItem("pixora_user");
        if (userStr) {
            const u = JSON.parse(userStr);
            return u?.uid || null;
        }
    } catch (e) {}
    return null;
};

const loadSavedCollections = (specificUid) => {
    try {
        const uid = specificUid !== undefined ? specificUid : getCurrentUserId();
        if (!uid) {
            return [];
        }
        const userKey = `pixora_collections_${uid}`;
        let data = localStorage.getItem(userKey);
        if (!data) {
            // fallback to legacy key
            data = localStorage.getItem("pixora_collections");
        }
        if (data) {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
        return [{
            id: DEFAULT_COLLECTION_ID,
            name: "Favorites",
            createdAt: Date.now(),
            items: []
        }];
    } catch (err) {
        return [];
    }
};

const saveCollectionsToStorage = (collections) => {
    try {
        const uid = getCurrentUserId();
        if (uid) {
            localStorage.setItem(`pixora_collections_${uid}`, JSON.stringify(collections));
        }
        localStorage.setItem("pixora_collections", JSON.stringify(collections));
        const allItems = collections.flatMap((c) => c.items);
        const uniqueItems = Array.from(new Map(allItems.map((i) => [i.id, i])).values());
        localStorage.setItem("pixora_collection", JSON.stringify(uniqueItems));
    } catch (err) {
        console.error("Failed to save collections to localStorage", err);
    }
};

const initialCollections = loadSavedCollections();
const initialAllItems = Array.from(new Map(initialCollections.flatMap((c) => c.items).map((i) => [i.id, i])).values());

const collectionSlice = createSlice({
    name: "collection",
    initialState: {
        collections: initialCollections,
        activeCollectionId: initialCollections[0]?.id || DEFAULT_COLLECTION_ID,
        items: initialAllItems
    },
    reducers: {
        loadUserCollections: (state, action) => {
            const uid = action.payload;
            const cols = loadSavedCollections(uid);
            state.collections = cols;
            state.activeCollectionId = cols[0]?.id || DEFAULT_COLLECTION_ID;
            state.items = Array.from(new Map(cols.flatMap((c) => c.items).map((i) => [i.id, i])).values());
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
            state.items = Array.from(new Map(state.collections.flatMap((c) => c.items).map((i) => [i.id, i])).values());
            saveCollectionsToStorage(state.collections);
        },
        addToCollection: (state, action) => {
            const { item, collectionId } = action.payload;
            const targetCol = state.collections.find((c) => c.id === collectionId) || state.collections[0];
            if (targetCol && item) {
                const exists = targetCol.items.some((i) => i.id === item.id);
                if (!exists) {
                    targetCol.items.unshift(item);
                }
            }
            state.items = Array.from(new Map(state.collections.flatMap((c) => c.items).map((i) => [i.id, i])).values());
            saveCollectionsToStorage(state.collections);
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
            state.items = Array.from(new Map(state.collections.flatMap((c) => c.items).map((i) => [i.id, i])).values());
            saveCollectionsToStorage(state.collections);
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

            state.items = Array.from(new Map(state.collections.flatMap((c) => c.items).map((i) => [i.id, i])).values());
            saveCollectionsToStorage(state.collections);
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

            state.items = Array.from(new Map(state.collections.flatMap((c) => c.items).map((i) => [i.id, i])).values());
            saveCollectionsToStorage(state.collections);
        },
        clearCollection: (state, action) => {
            const colId = action.payload || state.activeCollectionId;
            const targetCol = state.collections.find((c) => c.id === colId);
            if (targetCol) {
                targetCol.items = [];
            }
            state.items = Array.from(new Map(state.collections.flatMap((c) => c.items).map((i) => [i.id, i])).values());
            saveCollectionsToStorage(state.collections);
        }
    }
});

export const {
    loadUserCollections,
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
