export const initialStore = () => {
  return {
    people: [],
    planets: [],
    vehicles: [],
    favorites: []
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case 'set_data':
      return {
        ...store,
        [action.payload.key]: action.payload.data
      };

    case 'toggle_favorite':
      const item = action.payload;
      const exists = store.favorites.some(fav => fav.uid === item.uid && fav.type === item.type);
      
      if (exists) {
        return {
          ...store,
          favorites: store.favorites.filter(fav => !(fav.uid === item.uid && fav.type === item.type))
        };
      } else {
        return {
          ...store,
          favorites: [...store.favorites, item]
        };
      }

    default:
      return store;
  }
}