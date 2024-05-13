import { Deck } from "./deck";

export interface Class {
  id: number;
  title: string;
  description: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  username: string;
}

export interface ClassWithDecks extends Class {
  decks: Deck[];
}
