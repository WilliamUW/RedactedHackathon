import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";
export async function getFileContent(url) {
  try {
    const response = await fetch(url);
    const content = await response.text();
    return content;
  } catch (error) {
    console.error("Failed to fetch image from IPFS:", error);
    return null;
  }
}

export default function Records({ records }) {
  const mapRef = useRef();
  const mapContainerRef = useRef();
  const [images, setImages] = useState({});
  useEffect(() => {
    mapboxgl.accessToken =
      process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
    });

    return () => {
      mapRef.current.remove();
    };
  }, []);
  useEffect(() => {
    const fetchImages = async () => {
      const newImages = {};
      for (const record of records) {
        if (record.image_blob_id && !images[record.image_blob_id]) {
          const imageContent = await getFileContent(`${record.image_blob_id}`);
          newImages[record.image_blob_id] = imageContent;
        }
      }
      setImages((prev) => ({ ...prev, ...newImages }));
    };
    fetchImages();
  }, [records]);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        id="map-container"
        ref={mapContainerRef}
        style={{ width: "100%", height: "600px" }}
      />

      {records.map((record, index) => (
        <div
          key={index}
          style={{
            width: "300px",
            margin: "10px",
            padding: "15px",
            borderRadius: "15px",
            backgroundColor: "#ffffff",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            transition: "transform 0.3s ease",
            cursor: "pointer",
          }}
          onClick={async () => {
            console.log(record);
          }}
        >
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#333",
              marginBottom: "10px",
            }}
          >
            Species: {record.species}
          </h3>
          <img
            src={`${images[record.image_blob_id]}`}
            alt={record.species}
            style={{
              width: "100%",
              height: "180px",
              objectFit: "cover",
              borderRadius: "10px",
              marginBottom: "10px",
            }}
          />
          <p style={{ fontSize: "14px", color: "#666" }}>
            <strong>Latitude:</strong> {record.latitude}
          </p>
          <p style={{ fontSize: "14px", color: "#666" }}>
            <strong>Longitude:</strong> {record.longitude}
          </p>
          <p style={{ fontSize: "14px", color: "#666" }}>
            <strong>Time Captured:</strong> {record.time_captured}
          </p>
          <p style={{ fontSize: "14px", color: "#666" }}>
            <strong>Description:</strong> {record.description}
          </p>
          <p style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>
            <strong>User Address:</strong> {record.user_address}
          </p>
        </div>
      ))}
    </div>
  );
}
