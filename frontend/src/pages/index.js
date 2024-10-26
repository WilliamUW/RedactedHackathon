import { utils } from "near-api-js";
import { useState, useEffect, useContext } from "react";

import Form from "@/components/Form";
import SignIn from "@/components/SignIn";
import Records from "@/components/Records";
import styles from "@/styles/app.module.css";

import { NearContext } from "@/context";
import { WildlifeContract } from "@/config";

export default function Home() {
  const { signedAccountId, wallet } = useContext(NearContext);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchRecords().then((records) => setRecords(records.reverse()));
  }, []);

  const fetchRecords = async () => {
    const total_records = await wallet.viewMethod({
      contractId: WildlifeContract,
      method: "total_records",
    });

    // Fetch records starting from the latest, limiting to 10 records
    const from_index = total_records >= 10 ? total_records - 10 : 0;
    return wallet.viewMethod({
      contractId: WildlifeContract,
      method: "get_records",
      args: { from_index: String(from_index), limit: "10" },
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const { fieldset, species, latitude, longitude, time_captured, image_blob_id, description } = e.target.elements;

    // Add record to the wildlife contract
    await wallet.callMethod({
      contractId: WildlifeContract,
      method: "add_record",
      args: {
        species: species.value,
        latitude: latitude.value,
        longitude: longitude.value,
        time_captured: time_captured.value,
        image_blob_id: image_blob_id.value,
        description: description.value,
      },
    });

    // Get updated records
    const updatedRecords = await fetchRecords();
    setRecords(updatedRecords.reverse());

    // Clear the form fields and re-enable the fieldset
    species.value = "";
    latitude.value = "";
    longitude.value = "";
    time_captured.value = "";
    image_blob_id.value = "";
    description.value = "";
    fieldset.disabled = false;
  };

  return (
    <main className={styles.main}>
      <div className="container">
        <h1>🦁 Wildlife Spotting Records</h1>
        {signedAccountId ? (
          <form onSubmit={onSubmit}>
            <fieldset>
              <input name="species" placeholder="Species" required />
              <input name="latitude" placeholder="Latitude" required />
              <input name="longitude" placeholder="Longitude" required />
              <input name="time_captured" placeholder="Time Captured (ISO format)" required />
              <input name="image_blob_id" placeholder="Image Blob ID" required />
              <input name="description" placeholder="Description" required />
              <button type="submit">Add Record</button>
            </fieldset>
          </form>
        ) : (
          <SignIn />
        )}
      </div>

      {!!records.length && <Records records={records} />}
    </main>
  );
}
