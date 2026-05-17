import { useContext, useReducer, createContext, useEffect } from "react";
import storeReducer, { initialStore } from "../store";

const StoreContext = createContext();

export function StoreProvider({ children }) {
    const getInitialState = () => {
        const savedStore = localStorage.getItem("starwars_store");
        if (savedStore) {
            try {
                return JSON.parse(savedStore);
            } catch (error) {
                console.error("Error parseando el almacenamiento local:", error);
            }
        }
        return initialStore();
    };

    const [store, dispatch] = useReducer(storeReducer, getInitialState());

    useEffect(() => {
        localStorage.setItem("starwars_store", JSON.stringify(store));
    }, [store]);

    return (
        <StoreContext.Provider value={{ store, dispatch }}>
            {children}
        </StoreContext.Provider>
    );
}

export default function useGlobalReducer() {
    const { dispatch, store } = useContext(StoreContext);
    return { dispatch, store };
}