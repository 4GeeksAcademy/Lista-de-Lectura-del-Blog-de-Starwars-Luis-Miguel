import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

export const Single = () => {
  const { type, theId } = useParams();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`https://www.swapi.tech/api/${type}/${theId}`)
      .then(res => {
        if (!res.ok) throw new Error("Error obteniendo detalles");
        return res.json();
      })
      .then(data => {
        setDetail(data.result.properties);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [type, theId]);

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Cargando detalles...</span>
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="container text-center mt-5">
        <h3>No se pudieron cargar los detalles del elemento.</h3>
        <Link to="/" className="btn btn-primary mt-3">Volver al inicio</Link>
      </div>
    );
  }

  const cleanId = theId ? theId.trim() : "1";
  const category = type === "people" ? "characters" : type;
  const imageUrl = `https://starwars-visualguide.com/assets/img/${category}/${cleanId}.jpg`;

  return (
    <div className="container mt-5">
      <div className="card mb-4 border-0 shadow-sm p-3">
        <div className="row g-0 align-items-center">
          
          <div className="col-md-4 text-center">
            <div 
              style={{ 
                minHeight: "350px", 
                backgroundColor: "#e9ecef", 
                borderRadius: "8px",
                overflow: "hidden"
              }} 
              className="d-flex align-items-center justify-content-center shadow-sm position-relative"
            >
              <img 
                src={imageUrl} 
                className="img-fluid object-fit-cover" 
                alt={detail.name}
                style={{ maxHeight: "350px", width: "100%", display: "block" }}
                onError={(e) => { 
                  e.target.onerror = null; 
                  e.target.src = `https://placehold.co/400x500/212529/ffffff?text=${encodeURIComponent(detail.name)}`; 
                }}
              />
            </div>
          </div>
          
          <div className="col-md-8">
            <div className="card-body px-md-4">
              <h1 className="card-title border-bottom pb-2 display-5 font-weight-bold">{detail.name}</h1>
              
              <p className="card-text text-secondary mt-3" style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
                {type === "people" && (
                  <>
                    Descubre el registro galáctico oficial y las especificaciones técnicas de <strong>{detail.name}</strong>. 
                    Este individuo presenta rasgos únicos dentro del universo de Star Wars, incluyendo una altura de {detail.height} cm 
                    y un color de ojos {detail.eye_color} distintivo. Explora el registro biométrico completo a continuación.
                  </>
                )}
                {type === "planets" && (
                  <>
                    Archivos de exploración y parámetros orbitales del planeta <strong>{detail.name}</strong>. 
                    Este cuerpo celeste cuenta con un clima característico {detail.climate} y un terreno compuesto principalmente de {detail.terrain}. 
                    Revisa los archivos demográficos y ambientales completos abajo.
                  </>
                )}
                {type === "vehicles" && (
                  <>
                    Revisión técnica y planos de fabricación del vehículo <strong>{detail.name}</strong>. 
                    Clasificado bajo la categoría de {detail.vehicle_class}, este modelo requiere una tripulación de {detail.crew} personas para su operación. 
                    Los detalles del costo y métricas estructurales se detallan a continuación.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <hr className="text-danger my-4" />

      <div className="row text-danger text-center font-weight-bold g-3 mb-5">
        <div className="col-6 col-sm-4 col-md-2 border-end">
          <h6 className="text-uppercase text-muted small m-0">Nombre</h6>
          <p className="text-dark fs-5 m-0">{detail.name}</p>
        </div>
        
        {type === "people" && (
          <>
            <div className="col-6 col-sm-4 col-md-2 border-end">
              <h6 className="text-uppercase text-muted small m-0">Año de Nacimiento</h6>
              <p className="text-dark fs-5 m-0">{detail.birth_year}</p>
            </div>
            <div className="col-6 col-sm-4 col-md-2 border-end">
              <h6 className="text-uppercase text-muted small m-0">Género</h6>
              <p className="text-dark fs-5 m-0">{detail.gender}</p>
            </div>
            <div className="col-6 col-sm-4 col-md-2 border-end">
              <h6 className="text-uppercase text-muted small m-0">Altura</h6>
              <p className="text-dark fs-5 m-0">{detail.height} cm</p>
            </div>
            <div className="col-6 col-sm-4 col-md-2 border-end">
              <h6 className="text-uppercase text-muted small m-0">Color de Piel</h6>
              <p className="text-dark fs-5 m-0">{detail.skin_color}</p>
            </div>
            <div className="col-6 col-sm-4 col-md-2">
              <h6 className="text-uppercase text-muted small m-0">Color de Ojos</h6>
              <p className="text-dark fs-5 m-0">{detail.eye_color}</p>
            </div>
          </>
        )}

        {type === "planets" && (
          <>
            <div className="col-6 col-sm-4 col-md-2 border-end">
              <h6 className="text-uppercase text-muted small m-0">Clima</h6>
              <p className="text-dark fs-5 m-0">{detail.climate}</p>
            </div>
            <div className="col-6 col-sm-4 col-md-2 border-end">
              <h6 className="text-uppercase text-muted small m-0">Población</h6>
              <p className="text-dark fs-5 m-0">{detail.population}</p>
            </div>
            <div className="col-6 col-sm-4 col-md-2 border-end">
              <h6 className="text-uppercase text-muted small m-0">Terreno</h6>
              <p className="text-dark fs-5 m-0">{detail.terrain}</p>
            </div>
            <div className="col-6 col-sm-4 col-md-2 border-end">
              <h6 className="text-uppercase text-muted small m-0">Diámetro</h6>
              <p className="text-dark fs-5 m-0">{detail.diameter}</p>
            </div>
            <div className="col-6 col-sm-4 col-md-2">
              <h6 className="text-uppercase text-muted small m-0">Gravedad</h6>
              <p className="text-dark fs-5 m-0">{detail.gravity}</p>
            </div>
          </>
        )}

        {type === "vehicles" && (
          <>
            <div className="col-6 col-sm-4 col-md-2 border-end">
              <h6 className="text-uppercase text-muted small m-0">Modelo</h6>
              <p className="text-dark fs-5 m-0 text-truncate px-1">{detail.model}</p>
            </div>
            <div className="col-6 col-sm-4 col-md-2 border-end">
              <h6 className="text-uppercase text-muted small m-0">Clase</h6>
              <p className="text-dark fs-5 m-0 text-truncate px-1">{detail.vehicle_class}</p>
            </div>
            <div className="col-6 col-sm-4 col-md-2 border-end">
              <h6 className="text-uppercase text-muted small m-0">Costo</h6>
              <p className="text-dark fs-5 m-0">{detail.cost_in_credits}</p>
            </div>
            <div className="col-6 col-sm-4 col-md-2 border-end">
              <h6 className="text-uppercase text-muted small m-0">Longitud</h6>
              <p className="text-dark fs-5 m-0">{detail.length}</p>
            </div>
            <div className="col-6 col-sm-4 col-md-2">
              <h6 className="text-uppercase text-muted small m-0">Tripulación</h6>
              <p className="text-dark fs-5 m-0">{detail.crew}</p>
            </div>
          </>
        )}
      </div>

      <div className="d-flex justify-content-start mb-5">
        <Link to="/" className="btn btn-outline-primary">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};