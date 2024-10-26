// Records.js
export default function Records({ records }) {
    return (
      <ul>
        {records.map((record, index) => (
          <li key={index}>
            <h3>Species: {record.species}</h3>
            <p>Latitude: {record.latitude}</p>
            <p>Longitude: {record.longitude}</p>
            <p>Time Captured: {record.time_captured}</p>
            <p>Description: {record.description}</p>
            <p>User Address: {record.user_address}</p>
          </li>
        ))}
      </ul>
    );
  }
  