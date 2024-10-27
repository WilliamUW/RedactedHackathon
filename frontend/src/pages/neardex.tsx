import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { Home, Book, User, Map } from "lucide-react";
import Records from "../components/Records";

export type Animal = {
  id: number;
  species: string;
  latitude: string;
  longitude: string;
  time_captured: string;
  image_blob_id: string;
  description: string;
  user_address: string;
};

import { NearContext } from "../context";

export default function NeardexPage() {
  const { wallet } = useContext(NearContext);
  const [animals, setAnimals] = useState<Animal[]>([]);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    const totalRecords = await wallet.viewMethod({
      contractId: "neargoredacted.testnet",
      method: "total_records",
      args: {},
    });
    const fromIndex = 0;
    const fetchedRecords = await wallet.viewMethod({
      contractId: "neargoredacted.testnet",
      method: "get_records",
      args: { from_index: String(fromIndex), limit: String(totalRecords) },
    });
    setAnimals(fetchedRecords.reverse() as Animal[]);
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f0f8ff",
        minHeight: "100vh",
      }}
    >
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideIn {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
      <h1
        style={{
          textAlign: "center",
          fontSize: "36px",
          fontWeight: "bold",
          color: "#4a4a4a",
          marginBottom: "20px",
          animation: "fadeIn 1s ease-in",
        }}
      >
        🦁 Neardex
      </h1>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginBottom: "20px",
          backgroundColor: "#ffffff",
          padding: "10px",
          borderRadius: "25px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Link
          href="/"
          style={{
            color: "#4a4a4a",
            textDecoration: "none",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Home style={{ marginRight: "5px" }} /> Home
        </Link>
        <Link
          href="/neardex"
          style={{
            color: "#4a4a4a",
            textDecoration: "none",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Book style={{ marginRight: "5px" }} /> Neardex
        </Link>
        <Link
          href="/profile"
          style={{
            color: "#4a4a4a",
            textDecoration: "none",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
          }}
        >
          <User style={{ marginRight: "5px" }} /> Profile
        </Link>
      </nav>
      <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
        <div style={{ flex: 1, animation: "slideIn 0.5s ease-out" }}>
          <h2
            style={{ fontSize: "24px", marginBottom: "15px", color: "#4a4a4a" }}
          >
            Animal Sightings
          </h2>
          <Records records={animals} />
        </div>
      </div>
    </div>
  );
}
