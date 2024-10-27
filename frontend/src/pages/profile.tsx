import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { Home, Book, User, Award, Activity, Clock } from "lucide-react";
import { NearContext } from "../context";
import { Animal } from "./neardex";

type UserStats = {
  totalSightings: number;
  uniqueSpecies: number;
  topSpecies: { name: string; count: number }[];
  recentActivity: { action: string; date: string }[];
};

const mockUserStats: UserStats = {
  totalSightings: 42,
  uniqueSpecies: 15,
  topSpecies: [
    { name: "Pygmy Hippo", count: 8 },
    { name: "King Penguin", count: 6 },
    { name: "Panda", count: 5 },
  ],
  recentActivity: [
    { action: "Spotted a Pygmy Hippo", date: "2026-10-26" },
    { action: "Spotted a King Penguin", date: "2024-10-26" },
    { action: "Updated profile", date: "2024-10-26" },
  ],
};

export default function ProfilePage() {
  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f0f8ff",
        minHeight: "100vh",
        color: "black",
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
        👤 User Profile
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
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "25px",
          padding: "20px",
          marginBottom: "20px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          animation: "slideIn 0.5s ease-out",
        }}
      >
        <h2
          style={{
            fontSize: "24px",
            marginBottom: "15px",
            color: "#4a4a4a",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Award style={{ marginRight: "10px" }} /> Stats
        </h2>
        <p style={{ fontSize: "18px", marginBottom: "10px" }}>
          Total Sightings: {mockUserStats.totalSightings}
        </p>
        <p style={{ fontSize: "18px" }}>
          Unique Species: {mockUserStats.uniqueSpecies}
        </p>
      </div>
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "25px",
          padding: "20px",
          marginBottom: "20px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          animation: "slideIn 0.5s ease-out 0.2s",
        }}
      >
        <h2
          style={{
            fontSize: "24px",
            marginBottom: "15px",
            color: "#4a4a4a",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Activity style={{ marginRight: "10px" }} /> Top Species
        </h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {mockUserStats.topSpecies.map((species, index) => (
            <li
              key={index}
              style={{
                marginBottom: "10px",
                fontSize: "18px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>{species.name}</span>
              <span>{species.count}</span>
            </li>
          ))}
        </ul>
      </div>
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "25px",
          padding: "20px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          animation: "slideIn 0.5s ease-out 0.4s",
        }}
      >
        <h2
          style={{
            fontSize: "24px",
            marginBottom: "15px",
            color: "#4a4a4a",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Clock style={{ marginRight: "10px" }} /> Recent Activity
        </h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {mockUserStats.recentActivity.map((activity, index) => (
            <li
              key={index}
              style={{
                marginBottom: "10px",
                fontSize: "18px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>{activity.action}</span>
              <span>{activity.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
