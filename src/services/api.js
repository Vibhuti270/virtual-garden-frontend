import axios from 'axios';
// Fetch all herbs
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "./firebase"; 
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/herbs`;

const headers = {
  "Content-Type": "application/json",
};

export const fetchHerbs = async () => {
  const herbsCol = collection(firestore, "herbs");
  const herbsSnapshot = await getDocs(herbsCol);
  const herbsList = herbsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  return herbsList;
};

// Create a new herb
export const createHerb = async (herbData) => {
  try {
    const response = await axios.post(BASE_URL, herbData, { headers });
    return response.data;
  } catch (error) {
    console.error('Error creating herb:', error.message);
    throw new Error('Failed to create herb');
  }
};

// Update an existing herb
export const updateHerb = async (id, herbData) => {
  try {
    const response = await axios.patch(`${BASE_URL}/${id}`, herbData, { headers });
    return response.data;
  } catch (error) {
    console.error('Error updating herb:', error.message);
    throw new Error('Failed to update herb');
  }
};

// Delete an herb
export const deleteHerb = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error deleting herb:', error.message);
    console.error('Error details:', error.response ? error.response.data : error);
    throw new Error('Failed to delete herb');
  }
};
