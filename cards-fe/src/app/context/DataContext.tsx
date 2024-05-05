import { createContext, PropsWithChildren, useContext, useState } from "react";
import { User } from "../models/user";

interface DataContextValue {
  user: User | null;
  setUser: (user: User) => void;
  removeUser: () => void;
}

export const DataContext = createContext<DataContextValue | undefined>(
  undefined
);

export function useDataContext() {
  const context = useContext(DataContext);

  if (context === undefined) {
    throw Error("Not inside the provider");
  }

  return context;
}

export function DataProvider({ children }: PropsWithChildren<any>) {
  const [user, setUser] = useState<User | null>(null);

  function removeUser() {
    setUser(null);
  }

  return (
    <DataContext.Provider value={{ user, setUser, removeUser }}>
      {children}
    </DataContext.Provider>
  );
}
