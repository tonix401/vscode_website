use std::collections::HashMap;
use std::error::Error;
use std::fmt;

/// Custom error type for library operations
#[derive(Debug)]
pub enum LibraryError {
    NotFound(String),
    AlreadyExists(String),
    InvalidInput(String),
}

impl fmt::Display for LibraryError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            LibraryError::NotFound(msg) => write!(f, "Not found: {}", msg),
            LibraryError::AlreadyExists(msg) => write!(f, "Already exists: {}", msg),
            LibraryError::InvalidInput(msg) => write!(f, "Invalid input: {}", msg),
        }
    }
}

impl Error for LibraryError {}

/// Book structure with derive macros
#[derive(Debug, Clone)]
pub struct Book {
    pub id: u32,
    pub title: String,
    pub author: String,
    pub year: u32,
}

/// Generic library manager with trait bounds
pub struct Library<T>
where
    T: Clone + std::fmt::Debug,
{
    items: HashMap<u32, T>,
    next_id: u32,
}

impl<T> Library<T>
where
    T: Clone + std::fmt::Debug,
{
    /// Create a new library instance
    pub fn new() -> Self {
        Library {
            items: HashMap::new(),
            next_id: 1,
        }
    }

    /// Add item and return its ID
    pub fn add(&mut self, item: T) -> u32 {
        let id = self.next_id;
        self.items.insert(id, item);
        self.next_id += 1;
        id
    }

    /// Find item by ID using pattern matching
    pub fn find(&self, id: u32) -> Option<&T> {
        self.items.get(&id)
    }

    /// Find all items matching a predicate
    pub fn filter<F>(&self, predicate: F) -> Vec<&T>
    where
        F: Fn(&T) -> bool,
    {
        self.items
            .values()
            .filter(|item| predicate(item))
            .collect()
    }

    /// Iterate over all items
    pub fn iter(&self) -> impl Iterator<Item = (&u32, &T)> {
        self.items.iter()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_library_operations() {
        let mut lib = Library::new();
        let book = Book {
            id: 1,
            title: "Rust Book".to_string(),
            author: "Steve Klabnik".to_string(),
            year: 2023,
        };
        lib.add(book);
        assert!(lib.find(1).is_some());
    }
}
