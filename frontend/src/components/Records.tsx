import {getFileContent} from "../utility/pinata";
import {storeStringAndGetBlobId} from "../utility/walrus";
import { uploadToIPFS } from "../utility/web3storage";

// Records.js
export default function Records({ records }) {
  return (
    <ul>
      {records.map((record, index) => (
        <li
          key={index}
          onClick={async () => {
            console.log(record);
            
            // const response = await storeStringAndGetBlobId("test");
          }}
        >
          <h3>Species: {record.species}</h3>
          <p>Latitude: {record.latitude}</p>
          <p>Longitude: {record.longitude}</p>
          <p>Time Captured: {record.time_captured}</p>
          <p>Description: {record.description}</p>
          <p>User Address: {record.user_address}</p>
          <p>Image Blob: {record.image_blob_id}</p>
        </li>
      ))}
    </ul>
  );
}
