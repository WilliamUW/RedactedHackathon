import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
export const DEFAULT_IMAGE =
  "https://static.bangkokpost.com/media/content/20240913/c1_2865088.jpg";

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
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [images, setImages] = useState({});
  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        center: [-74, 40.71], // Optionally, set a default center and zoom level
        zoom: 0,
      });
    }

    // Add markers for all records
    mapRef.current.on("load", () => {
      // Prepare GeoJSON data from records
      const geojsonData = {
        type: "FeatureCollection",
        features: records.map((record) => ({
          type: "Feature",
          properties: {
            description: `
                <div>
                  <h3>${record.species}</h3>
                  <img src="${
                    record.image_blob_id.length > 30
                      ? record.image_blob_id
                      : DEFAULT_IMAGE
                  }" alt="${
              record.species
            }" style="width: 100px; height: 100px; object-fit: cover; border-radius: 5px;"/>
                  <p><strong>Latitude:</strong> ${record.latitude}</p>
                  <p><strong>Longitude:</strong> ${record.longitude}</p>
                  <p><strong>Time Captured:</strong> ${record.time_captured}</p>
                  <p><strong>Description:</strong> ${record.description}</p>
                  <p><strong>User Address:</strong> ${record.user_address}</p>
                </div>
              `,
          },
          geometry: {
            type: "Point",
            coordinates: [
              parseFloat(record.longitude),
              parseFloat(record.latitude),
            ],
          },
        })),
      };

      // Add the source to the map
      mapRef.current.addSource("places", {
        type: "geojson",
        // @ts-ignore
        data: geojsonData,
      });

      // Add a layer for the markers
      mapRef.current.addLayer({
        id: "places",
        type: "circle",
        source: "places",
        paint: {
          "circle-radius": 6,
          "circle-color": "#B42222",
        },
      });
    });

    // Add a click event for popups
    mapRef.current.on("click", "places", (e) => {
      // @ts-ignore
      const coordinates = e.features[0].geometry.coordinates.slice();
      const description = e.features[0].properties.description;

      // Ensure the popup stays at the same point
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(mapRef.current);
    });

    return () => {
      if (mapRef.current) {
        // Ensure the event listeners are removed properly
        // @ts-ignore
        mapRef.current.off("load");
        // @ts-ignore
        mapRef.current.off("click", "places");

        // Finally, remove the map instance
        mapRef.current.remove();
        mapRef.current = null; // Optional cleanup step
      }
    };
  }, [records]); // Add `records` to the dependency array

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
            src={`${
              images[record.image_blob_id]?.length > 10
                ? images[record.image_blob_id]
                : DEFAULT_IMAGE
            }`}
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
