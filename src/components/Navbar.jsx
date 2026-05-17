import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    
    const searchRef = useRef(null);

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setSuggestions([]);
            return;
        }

        const combinedData = [
            ...(store.people || []).map(item => ({ ...item, type: "people", categoryName: "Character" })),
            ...(store.planets || []).map(item => ({ ...item, type: "planets", categoryName: "Planet" })),
            ...(store.vehicles || []).map(item => ({ ...item, type: "vehicles", categoryName: "Vehicle" }))
        ];

        const filtered = combinedData.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setSuggestions(filtered.slice(0, 8));
    }, [searchQuery, store]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectResult = (type, uid) => {
        setSearchQuery("");
        setShowSuggestions(false);
        navigate(`/single/${type}/${uid}`);
    };

    return (
        <nav className="navbar navbar-light bg-light mb-3 px-md-5 px-3 shadow-sm">
            <div className="container-fluid d-flex justify-content-between align-items-center gap-3">
                
                <Link to="/">
                    <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/6/6c/Star_Wars_Logo.svg" 
                        alt="Star Wars" 
                        style={{ width: "90px" }} 
                    />
                </Link>
                
                <div className="flex-grow-1 mx-md-5 mx-2 position-relative" ref={searchRef} style={{ maxWidth: "450px" }}>
                    <div className="input-group input-group-sm">
                        <span className="input-group-text bg-white border-end-0 text-muted">
                            <i className="fas fa-magnifying-glass"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control border-start-0"
                            placeholder="Buscar personajes, planetas..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowSuggestions(true);
                            }}
                            onFocus={() => setShowSuggestions(true)}
                        />
                    </div>

                    {showSuggestions && suggestions.length > 0 && (
                        <ul className="list-group position-absolute w-100 shadow mt-1" style={{ zIndex: 1050, maxHeight: "300px", overflowY: "auto" }}>
                            {suggestions.map((item) => (
                                <li 
                                    key={`${item.type}-${item.uid}`}
                                    className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleSelectResult(item.type, item.uid)}
                                >
                                    <span className="fw-bold text-dark">{item.name}</span>
                                    <span className="badge rounded-pill bg-secondary text-uppercase" style={{ fontSize: "0.65rem" }}>
                                        {item.categoryName}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}

                    {showSuggestions && searchQuery.trim() !== "" && suggestions.length === 0 && (
                        <ul className="list-group position-absolute w-100 shadow mt-1" style={{ zIndex: 1050 }}>
                            <li className="list-group-item text-muted text-center py-2 small">
                                No se encontraron resultados galácticos
                            </li>
                        </ul>
                    )}
                </div>
                
                <div className="dropdown">
                    <button 
                        className="btn btn-primary dropdown-toggle btn-sm d-flex align-items-center gap-2" 
                        type="button" 
                        id="favoritesDropdown" 
                        data-bs-toggle="dropdown" 
                        aria-expanded="false"
                    >
                        Favoritos
                        <span className="badge bg-warning text-dark rounded-pill">
                            {store.favorites ? store.favorites.length : 0}
                        </span>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="favoritesDropdown" style={{ minWidth: "220px" }}>
                        {!store.favorites || store.favorites.length === 0 ? (
                            <li><span className="dropdown-item text-muted text-center py-2">Lista vacía</span></li>
                        ) : (
                            store.favorites.map((fav, index) => (
                                <li key={index} className="d-flex justify-content-between align-items-center px-3 py-1">
                                    <Link to={`/single/${fav.type}/${fav.uid}`} className="dropdown-item text-truncate p-0 me-2" style={{ maxWidth: "150px" }}>
                                        {fav.name}
                                    </Link>
                                    <i 
                                        className="fas fa-trash text-danger" 
                                        style={{ cursor: "pointer" }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            dispatch({ type: "toggle_favorite", payload: fav });
                                        }}
                                    ></i>
                                </li>
                            ))
                        )}
                    </ul>
                </div>

            </div>
        </nav>
    );
};