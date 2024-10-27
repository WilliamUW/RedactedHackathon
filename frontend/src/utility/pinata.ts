import { PinataSDK } from "pinata-web3";

const pinata = new PinataSDK({
  pinataJwt:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI0ZWM1OGNlZi1kNjkyLTQxYmQtOTQwNi03MTAyYzFmNzlhODkiLCJlbWFpbCI6ImJ3aWxsaWFtd2FuZ0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiN2U0YzU4MzRlZDQxODEyODQ3MDciLCJzY29wZWRLZXlTZWNyZXQiOiJlNjhlMjFmZTg2OTJjNDM5YTAzYWQ2M2EwN2M3Yzk5MjBhYTBiNzBmOGY1MTJjNzkxMGJjN2FlN2I5M2U1MzVmIiwiZXhwIjoxNzYxNTI1MjkxfQ._y-KYeA-G7n3AU-qUUbdlkGWz1v2k_5iDFQ9Powfh5I",
  pinataGateway: "brown-real-puma-604.mypinata.cloud",
});

export async function uploadToIPFS(base64Image: string) {
  try {
    const file = new File([base64Image], "Testing.txt", { type: "text/plain" });
    const upload = await pinata.upload.file(file);
    console.log(upload);
    return `https://brown-real-puma-604.mypinata.cloud/ipfs/${upload.IpfsHash}`;
  } catch (error) {
    console.log(error);
  }
}

export async function getFileContent(blobId: string) {
  try {
    const data = await pinata.gateways.get(
      "bafkreibm6jg3ux5qumhcn2b3flc3tyu6dmlb4xa7u5bf44yegnrjhc4yeq"
    );
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}
