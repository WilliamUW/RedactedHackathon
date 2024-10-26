use near_sdk::json_types::U64;
use near_sdk::store::Vector;
use near_sdk::{env, near, AccountId};

#[near(serializers = [borsh, json])]
pub struct SpottingRecord {
    pub species: String,
    pub latitude: String,
    pub longitude: String,
    pub time_captured: String,
    pub image_blob_id: String,
    pub description: String,
    pub user_address: AccountId,
}

// Define the contract structure
#[near(contract_state)]
pub struct Contract {
    records: Vector<SpottingRecord>,
}

// Define the default, which automatically initializes the contract
impl Default for Contract {
    fn default() -> Self {
        Self {
            records: Vector::new(b"r"),
        }
    }
}

// Implement the contract structure
#[near]
impl Contract {
    // Public Method - Adds a new spotting record
    pub fn add_record(
        &mut self,
        species: String,
        latitude: String,
        longitude: String,
        time_captured: String,
        image_blob_id: String,
        description: String,
    ) {
        let user_address = env::predecessor_account_id();

        let record = SpottingRecord {
            species,
            latitude,
            longitude,
            time_captured,
            image_blob_id,
            description,
            user_address,
        };

        self.records.push(record);
    }

    // Public Method - Returns a slice of the records
    pub fn get_records(&self, from_index: Option<U64>, limit: Option<U64>) -> Vec<&SpottingRecord> {
        let from = u64::from(from_index.unwrap_or(U64(0)));
        let limit = u64::from(limit.unwrap_or(U64(10)));

        self.records
            .iter()
            .skip(from as usize)
            .take(limit as usize)
            .collect()
    }

    pub fn total_records(&self) -> u32 {
        self.records.len()
    }
}

/*
 * The rest of this file holds the inline tests for the code above
 * Learn more about Rust tests: https://doc.rust-lang.org/book/ch11-01-writing-tests.html
 */
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn add_record() {
        let mut contract = Contract::default();
        contract.add_record(
            "Elephant".to_string(),
            "45.0N".to_string(),
            "30.0E".to_string(),
            "2024-10-26T15:30:00Z".to_string(),
            "blob1".to_string(),
            "An elephant in the wild".to_string(),
        );

        let posted_record = &contract.get_records(None, None)[0];
        assert_eq!(posted_record.species, "Elephant");
        assert_eq!(posted_record.latitude, "45.0N");
        assert_eq!(posted_record.longitude, "30.0E");
        assert_eq!(posted_record.time_captured, "2024-10-26T15:30:00Z");
        assert_eq!(posted_record.image_blob_id, "blob1");
        assert_eq!(posted_record.description, "An elephant in the wild");
    }

    #[test]
    fn iter_records() {
        let mut contract = Contract::default();
        contract.add_record(
            "Elephant".to_string(),
            "45.0N".to_string(),
            "30.0E".to_string(),
            "2024-10-26T15:30:00Z".to_string(),
            "blob1".to_string(),
            "An elephant in the wild".to_string(),
        );
        contract.add_record(
            "Lion".to_string(),
            "46.0N".to_string(),
            "31.0E".to_string(),
            "2024-10-27T15:30:00Z".to_string(),
            "blob2".to_string(),
            "A lion roaming the savannah".to_string(),
        );

        let total = &contract.total_records();
        assert!(*total == 2);

        let second_record = &contract.get_records(Some(U64::from(1)), Some(U64::from(1)))[0];
        assert_eq!(second_record.species, "Lion");
        assert_eq!(second_record.latitude, "46.0N");
        assert_eq!(second_record.longitude, "31.0E");
        assert_eq!(second_record.time_captured, "2024-10-27T15:30:00Z");
        assert_eq!(second_record.image_blob_id, "blob2");
        assert_eq!(second_record.description, "A lion roaming the savannah");
    }
}
