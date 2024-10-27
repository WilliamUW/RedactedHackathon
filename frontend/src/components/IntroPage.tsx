"use client"
import React, { useContext } from "react";
import { Camera, Book, Eye, Users, Wallet } from "lucide-react";
import { NearContext } from "../context";

export default function IntroPage() {
  const { signedAccountId, wallet } = useContext(NearContext);

  const connectWallet = () => {
    // Implement wallet connection logic here
    console.log("Connecting wallet...");
    wallet.signIn();
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f0f8ff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes slideIn {
            from { transform: translateX(-50px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          .feature-icon {
            animation: float 3s ease-in-out infinite;
          }
          .feature-icon:nth-child(2) { animation-delay: 0.5s; }
          .feature-icon:nth-child(3) { animation-delay: 1s; }
          .feature-icon:nth-child(4) { animation-delay: 1.5s; }
        `}
      </style>
      <h1
        style={{
          fontSize: "48px",
          color: "#4a4a4a",
          marginBottom: "30px",
          animation: "pulse 2s infinite",
        }}
      >
        Welcome to Near Go! 🦁
      </h1>
      <p
        style={{
          fontSize: "24px",
          color: "#666",
          marginBottom: "40px",
          maxWidth: "600px",
        }}
      >
        Discover and document wildlife in your area!
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "40px",
          marginBottom: "50px",
          flexWrap: "wrap",
        }}
      >
        {[
          { icon: Wallet, text: "Connect NEAR wallet" },
          { icon: Camera, text: "Take picture of animal" },
          { icon: Book, text: "See it in your NearDex" },
          { icon: Users, text: "See others' wildlife spottings" },
        ].map((feature, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "200px",
              animation: `slideIn 0.5s ease-out ${index * 0.2}s both`,
            }}
          >
            <feature.icon
              size={64}
              className="feature-icon"
              style={{ color: "#4CAF50", marginBottom: "15px" }}
            />
            <p style={{ fontSize: "18px", color: "#4a4a4a" }}>{feature.text}</p>
          </div>
        ))}
      </div>
      <button
        onClick={connectWallet}
        style={{
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          padding: "15px 30px",
          fontSize: "20px",
          borderRadius: "50px",
          cursor: "pointer",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#45a049";
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#4CAF50";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <Wallet style={{ marginRight: "10px" }} />
        Connect Wallet
      </button>
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          animation: "rotate 20s linear infinite",
        }}
      >
        <Eye size={48} style={{ color: "#4CAF50" }} />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          animation: "float 4s ease-in-out infinite",
        }}
      >
        <Camera size={48} style={{ color: "#4CAF50" }} />
      </div>
    </div>
  );
}
