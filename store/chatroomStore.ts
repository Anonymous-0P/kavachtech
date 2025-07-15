import { create } from "zustand";

export type Chatroom = {
  id: string;
  title: string;
};

type State = {
  chatrooms: Chatroom[];
  hydrated: boolean;
  addChatroom: (title: string) => void;
  deleteChatroom: (id: string) => void;
  setHydrated: () => void;
};

const CHATROOMS_KEY = "chatrooms";

function loadChatrooms(): Chatroom[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(CHATROOMS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveChatrooms(chatrooms: Chatroom[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CHATROOMS_KEY, JSON.stringify(chatrooms));
}

export const useChatroomStore = create<State>((set, get) => ({
  chatrooms: [],
  hydrated: false,
  setHydrated: () => {
    set({ chatrooms: loadChatrooms(), hydrated: true });
  },
  addChatroom: (title) => {
    const newRoom = { id: Date.now().toString(), title };
    const updated = [...get().chatrooms, newRoom];
    set({ chatrooms: updated });
    saveChatrooms(updated);
  },
  deleteChatroom: (id) => {
    const updated = get().chatrooms.filter((r) => r.id !== id);
    set({ chatrooms: updated });
    saveChatrooms(updated);
  },
})); 