import React, { createContext, useState, useContext } from 'react';

// Create a UserContext
const UserContext = createContext();

// UserProvider Component
export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    age: null,
    countryCode: '',
    dob: '',
    emailId: '',
    emailIdVerified: false,
    gender: '',
    name: '',
    phoneNumber: '',
    showGenderOnProfile: false,
    // Add more fields if needed
  });

  /**
   * Function to update user data.
   * Supports updating a single field or merging an object.
   * @param {string|object} keyOrData - Key of the field to update or an object of fields.
   * @param {any} value - Value for the single field (ignored if an object is passed).
   */
  const updateUser = (keyOrData, value) => {
    if (typeof keyOrData === 'object' && !Array.isArray(keyOrData)) {
      // Validate object keys and merge only valid fields
      const validData = {};
      Object.entries(keyOrData).forEach(([key, val]) => {
        if (typeof key === 'string') {
          validData[key] = val;
        }
      });
      setUserData((prevData) => ({
        ...prevData,
        ...validData,
      }));
    } else if (typeof keyOrData === 'string') {
      // Update a single field
      setUserData((prevData) => ({
        ...prevData,
        [keyOrData]: value,
      }));
    } else {
      console.warn('Invalid keyOrData passed to updateUser:', keyOrData);
    }
  };

  return (
    <UserContext.Provider value={{ userData, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom Hook for accessing UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
