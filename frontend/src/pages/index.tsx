"use client"
import { useState, useRef, useEffect, useContext } from "react";
import { utils } from "near-api-js";
import { NearContext } from "../context";
import Records from "../components/Records";
import styles from "../styles/app.module.css";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { uploadToIPFS } from "../utility/pinata";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    'Return what animal specie the picture is, followed by a description of the image.\n\nOutput Format:\nAnimal: [animal specie]\nDescription: [image description]\n\nIf there is no animal, return "No Animal"\n\n',
});

export default function Home() {
  const { signedAccountId, wallet } = useContext(NearContext);
  const [records, setRecords] = useState([]);
  const [step, setStep] = useState(1);
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => console.error("Error accessing camera:", err));
    }
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    const totalRecords = await wallet.viewMethod({
      contractId: "neargoredacted.testnet",
      method: "total_records",
    });
    const fromIndex = totalRecords >= 10 ? totalRecords - 10 : 0;
    const fetchedRecords = await wallet.viewMethod({
      contractId: "neargoredacted.testnet",
      method: "get_records",
      args: { from_index: String(fromIndex), limit: "10" },
    });
    setRecords(fetchedRecords.reverse());
  };

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
      const imageDataUrl = canvas.toDataURL("image/jpeg");
      setImage(imageDataUrl);
      setStep(2);
    }
  };

  const handleMintNFT = async () => {
    setIsLoading(true);
    try {
      const format = image?.split(";")[0].slice(5);
      const base64Image = image?.split(",")[1];

      const result = await model.generateContent([
        "Analyze this image and tell me what animal species it is, followed by a description of the image.",
        {
          inlineData: {
            mimeType: format ?? "image/jpeg",
            data: base64Image ?? "",
          },
        },
      ]);

      const geminiResponse = await result.response;
      const text = geminiResponse.text();

      // Parse the response to extract species and description
      const lines = text.split("\n");
      let species = "Unknown";
      let description = "";

      for (const line of lines) {
        if (line.startsWith("Animal:")) {
          species = line.split(":")[1].trim();
        } else if (line.startsWith("Description:")) {
          description = line.split(":")[1].trim();
        }
      }

      if (
        species === "Unknown" ||
        species === "No Animal" ||
        text.includes("No Animal")
      ) {
        handleNonAnimal(description);
        return;
      }

      const imageBlobId = await uploadToIPFS(image);

      const formattedDate = new Date().toISOString();

      // Add the record to the NEAR contract
      await wallet.callMethod({
        contractId: "neargoredacted.testnet",
        method: "add_record",
        args: {
          species,
          latitude: "40.7468733", // Replace with actual data if available
          longitude: "-73.9947449", // Replace with actual data if available
          time_captured: formattedDate,
          image_blob_id: imageBlobId,
          description,
        },
      });

      fetchRecords();
      setStep(3);
    } catch (error) {
      console.error(error);
      setError("Error. Please try again. " + error);
      setStep(5);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNonAnimal = (description?: string) => {
    setError(
      `This doesn't appear to be an animal. Please try again with an animal photo. \n\nDescription: ` +
        description
    );
    setStep(5);
  };

  const resetApp = () => {
    setStep(1);
    setImage(null);
    setError(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImage(result);
        setStep(2);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className={styles.main}>
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        <h1
          style={{ textAlign: "center", fontSize: "28px", fontWeight: "bold" }}
        >
          🦁 Near Go!
        </h1>
        {/* <button
          onClick={async () => {
          }}
        >
          Upload to Pinata
        </button> */}
        {signedAccountId ? (
          <>
            {step === 1 && (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: "100%",
                    height: "300px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: "10px",
                  }}
                />
                <button
                  onClick={handleCapture}
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#d32f2f",
                    color: "white",
                    fontWeight: "bold",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Capture
                </button>
                <button
                  onClick={() => fileInputRef?.current?.click()}
                  style={{
                    width: "100%",
                    marginTop: "10px",
                    padding: "12px",
                    backgroundColor: "#f57c00",
                    color: "white",
                    fontWeight: "bold",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Upload
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: "none" }}
                />
              </>
            )}

            {step === 2 && image && (
              <div
                style={{
                  backgroundColor: "#e8f5e9",
                  border: "2px solid #4caf50",
                  borderRadius: "10px",
                  padding: "20px",
                  marginTop: "20px",
                }}
              >
                <h3 style={{ textAlign: "center", color: "#4caf50" }}>
                  Confirm Animal Photo
                </h3>
                <img
                  src={image}
                  alt="Captured"
                  style={{
                    width: "100%",
                    borderRadius: "10px",
                    marginBottom: "10px",
                  }}
                />
                <button
                  onClick={handleMintNFT}
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#1976d2",
                    color: "white",
                    fontWeight: "bold",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Add Record"}
                </button>
              </div>
            )}

            {step === 3 && (
              <div
                style={{
                  backgroundColor: "#ede7f6",
                  border: "2px solid #673ab7",
                  borderRadius: "10px",
                  padding: "20px",
                  marginTop: "20px",
                }}
              >
                <h3 style={{ textAlign: "center", color: "#673ab7" }}>
                  Record Added Successfully!
                </h3>
                <button
                  onClick={resetApp}
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#ff9800",
                    color: "white",
                    fontWeight: "bold",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Capture Another
                </button>
              </div>
            )}

            {step === 5 && error && (
              <div
                style={{
                  backgroundColor: "#ffebee",
                  border: "2px solid #d32f2f",
                  borderRadius: "10px",
                  padding: "20px",
                  marginTop: "20px",
                }}
              >
                <h3 style={{ textAlign: "center", color: "#d32f2f" }}>Error</h3>
                <p>{error}</p>
                <button
                  onClick={resetApp}
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#d32f2f",
                    color: "white",
                    fontWeight: "bold",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Try Again
                </button>
              </div>
            )}
          </>
        ) : (
          <p>Please sign in to continue.</p>
        )}
      </div>

      {!!records.length && <Records records={records} />}
    </main>
  );
}
