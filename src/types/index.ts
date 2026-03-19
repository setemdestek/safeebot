export interface ChatMessage {
    id: string;
    role: "user" | "bot";
    content: string;
    timestamp: number;
}

export interface ChatSession {
    id: string;
    title: string;
    messages: ChatMessage[];
    createdAt: number;
    updatedAt: number;
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    locale: string;
    theme: string;
}

export interface Source {
    id: string;
    name: string;
    abbreviation: string;
    hasFlag: boolean;
    logo?: string;
}
