import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {
    const { store, dispatch } = useGlobalReducer();

    useEffect(() => {
        const endpoints = ["people", "planets", "vehicles"];
        
        endpoints.forEach(endpoint => {
            if (store[endpoint] && store[endpoint].length > 0) return;

            fetch(`https://www.swapi.tech/api/${endpoint}/`)
                .then(res => {
                    if (!res.ok) throw new Error(`Error en fetch de ${endpoint}`);
                    return res.json();
                })
                .then(data => {
                    dispatch({
                        type: "set_data",
                        payload: { key: endpoint, data: data.results }
                    });
                })
                .catch(err => console.error(err));
        });
    }, [store, dispatch]);

    const getImageUrl = (type, uid) => {
        const category = type === "people" ? "characters" : type;
        return `https://starwars-visualguide.com/assets/img/${category}/${uid}.jpg`;
    };

    const renderSection = (title, type, dataArray) => (
        <div className="my-4">
            <h2 className="text-danger mb-3 font-weight-bold">{title}</h2>
            <div className="d-flex flex-row flex-nowrap overflow-auto gap-3 pb-2" style={{ scrollbarWidth: "thin" }}>
                {dataArray && dataArray.length > 0 ? (
                    dataArray.map((item) => {
                        const isFav = store.favorites.some(fav => fav.uid === item.uid && fav.type === type);
                        return (
                            <div className="card" style={{ minWidth: "18rem", maxWidth: "18rem" }} key={item.uid}>
                                <div style={{ height: "250px", backgroundColor: "#e9ecef", overflow: "hidden" }} className="d-flex align-items-center justify-content-center">
                                    <img 
                                        src={getImageUrl(type, item.uid)} 
                                        className="card-img-top object-fit-cover h-100 w-100" 
                                        alt={item.name}
                                        onError={(e) => { 
                                            e.target.onerror = null; 
                                            e.target.src = `https://placehold.co/400x500/212529/ffffff?text=${encodeURIComponent(item.name)}`; 
                                        }}
                                    />
                                </div>
                                <div className="card-body d-flex flex-column justify-content-between">
                                    <h5 className="card-title text-truncate">{item.name}</h5>
                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <Link to={`/single/${type}/${item.uid}`} className="btn btn-outline-primary btn-sm">
                                            Leer más
                                        </Link>
                                        <button 
                                            className={`btn btn-sm ${isFav ? "btn-warning text-white" : "btn-outline-warning"}`}
                                            onClick={() => dispatch({
                                                type: "toggle_favorite",
                                                payload: { uid: item.uid, name: item.name, type: type }
                                            })}
                                        >
                                            <i className="fas fa-heart"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="spinner-border text-primary m-3" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="container mt-4">
            {renderSection("Characters", "people", store.people)}
            {renderSection("Planets", "planets", store.planets)}
            {renderSection("Vehicles", "vehicles", store.vehicles)}
        </div>
    );
};