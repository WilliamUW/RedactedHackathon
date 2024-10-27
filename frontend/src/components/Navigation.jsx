"use client"
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useContext } from "react";
import { Wallet } from "lucide-react";

import { NearContext } from "../context";
import NearLogo from "/public/near-logo.svg";

export const Navigation = () => {
  const { signedAccountId, wallet } = useContext(NearContext);
  const [action, setAction] = useState(() => {});
  const [label, setLabel] = useState("Loading...");

  useEffect(() => {
    if (!wallet) return;

    if (signedAccountId) {
      setAction(() => wallet.signOut);
      setLabel(`Logout ${signedAccountId}`);
    } else {
      setAction(() => wallet.signIn);
      setLabel("Login");
    }
  }, [signedAccountId, wallet]);

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{ backgroundColor: "#f0f8ff" }}
    >
      <div className="container-fluid">
        <Link href="/" passHref legacyBehavior>
          <Image
            priority
            src={NearLogo}
            alt="NEAR"
            width="30"
            height="24"
            className="d-inline-block align-text-top"
          />
        </Link>
        <button
          onClick={action}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            padding: "15px 30px",
            fontSize: "15px",
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
          <Wallet style={{ marginRight: "10px" }} /> {label}{" "}
        </button>
      </div>
    </nav>
  );
};
