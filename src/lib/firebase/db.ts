import { db } from "./config";
import { collection, doc, addDoc, setDoc, getDoc, getDocs, query, orderBy, limit, Timestamp } from "firebase/firestore";

export interface SearchHistoryEntry {
    id?: string;
    username: string;
    score: number;
    timestamp: Date;
    avatarUrl?: string;
}

export interface SharedResult {
    shareId?: string;
    creatorUid?: string;
    username: string;
    analysisData: any;
    roadmapData: any;
    createdAt: Date;
}

// --- Session History Functions --- //

export const saveSearchHistory = async (userId: string, username: string, score: number, avatarUrl?: string) => {
    try {
        const searchesRef = collection(db, "users", userId, "searches");
        await addDoc(searchesRef, {
            username,
            score,
            avatarUrl: avatarUrl || `https://github.com/${username}.png`,
            timestamp: Timestamp.now()
        });
    } catch (error) {
        console.error("Error saving search history:", error);
    }
}

export const getSearchHistory = async (userId: string, maxResults = 10): Promise<SearchHistoryEntry[]> => {
    try {
        const searchesRef = collection(db, "users", userId, "searches");
        const q = query(searchesRef, orderBy("timestamp", "desc"), limit(maxResults));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp.toDate()
        })) as SearchHistoryEntry[];
    } catch (error) {
        console.error("Error fetching search history:", error);
        return [];
    }
}

// --- Sharing Functions --- //

export const createSharedResult = async (shareId: string, username: string, analysisData: any, roadmapData: any, creatorUid?: string) => {
    try {
        const docRef = doc(db, "shared_results", shareId);
        await setDoc(docRef, {
            creatorUid: creatorUid || null,
            username,
            analysisData,
            roadmapData,
            createdAt: Timestamp.now()
        });
        return shareId;
    } catch (error) {
        console.error("Error creating shared result:", error);
        throw error;
    }
}

export const getSharedResult = async (shareId: string): Promise<SharedResult | null> => {
    try {
        const docRef = doc(db, "shared_results", shareId);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
            return {
                shareId: snapshot.id,
                ...snapshot.data(),
                createdAt: snapshot.data().createdAt.toDate()
            } as SharedResult;
        }
        return null;
    } catch (error) {
        console.error("Error fetching shared result:", error);
        return null;
    }
}
