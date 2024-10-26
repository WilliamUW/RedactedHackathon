import { useState, useRef, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Camera, CameraIcon, Loader2, Upload, Wallet } from "lucide-react";
import Image from "next/image";
import { utils } from "near-api-js";
import { motion } from "framer-motion";
import { NearContext } from "@/context";
import Records from "@/components/Records";
import styles from "@/styles/app.module.css";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { storeStringAndGetBlobId } from "./utility/walrus"; // Your utility function for handling image uploads

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: 'Return what animal specie the picture is, followed by a description of the image.\n\nOutput Format:\nAnimal: [animal specie]\nDescription: [image description]\n\nIf there is no animal, return "No Animal"\n\n',
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
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }).catch((err) => console.error("Error accessing camera:", err));
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

      if (species === "Unknown" || species === "No Animal" || text.includes("No Animal")) {
        handleNonAnimal(description);
        return;
      }

      const imageBlobId = (await storeStringAndGetBlobId(image ?? "")) ?? "";

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
    setError(`This doesn't appear to be an animal. Please try again with an animal photo. \n\nDescription: ` + description);
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
      <div className="container">
        <h1>🦁 Wildlife Spotting Records</h1>
        {signedAccountId ? (
          <>
            {step === 1 && (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-64 object-cover rounded-lg mb-4" />
                <Button onClick={handleCapture} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-full">
                  <Camera className="mr-2 h-6 w-6" /> Capture
                </Button>
                <Button onClick={() => fileInputRef?.current?.click()} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
                  <Upload className="mr-2 h-4 w-4" /> Upload
                </Button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </>
            )}

            {step === 2 && image && (
              <Card className="bg-green-100 border-4 border-green-400 rounded-xl shadow-lg animate-fade-in">
                <CardHeader className="text-center text-xl font-bold text-purple-600">Confirm Animal Photo</CardHeader>
                <CardContent>
                  <Image src={image} alt="Captured" width={300} height={300} className="mb-4 max-w-full h-auto object-cover rounded-lg" />
                  <Button onClick={handleMintNFT} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : "Add Record"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card className="bg-purple-100 border-4 border-purple-400 rounded-xl shadow-lg animate-fade-in">
                <CardHeader className="text-center text-xl font-bold text-green-600">Record Added Successfully!</CardHeader>
                <Button onClick={resetApp} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105">
                  Capture Another
                </Button>
              </Card>
            )}

            {step === 5 && error && (
              <Alert variant="default" className="animate-shake">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
                <Button onClick={resetApp} className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105">
                  Try Again
                </Button>
              </Alert>
            )}
          </>
        ) : (
          <SignIn />
        )}
      </div>

      {!!records.length && <Records records={records} />}
    </main>
  );
}