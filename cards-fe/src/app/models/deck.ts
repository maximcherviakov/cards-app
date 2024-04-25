import { Flashcard } from "./card";

export interface Deck {
  id: number;
  title: string;
  description: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  classId: number;
  userId: number;
  username: string;
  cardsCount: number;
}

export interface DeckWithCards {
  id: number;
  title: string;
  description: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  classId: number;
  userId: number;
  username: string;
  cards: Flashcard[];
}
