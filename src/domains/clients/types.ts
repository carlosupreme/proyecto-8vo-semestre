import type { Media } from "../chats/types";

export type Annex = {
    name: string;
    media: Media;
}

export type Client = {
    id: string;
    businessId: string;
    name: string;
    phoneNumber: string;
    tagIds: string[];
    annexes: Annex[];
    photo: string;
    notes: string;
    email: string;
    address: string;
    birthdate?: string;
    createdAt: string;
    updatedAt: string;
}