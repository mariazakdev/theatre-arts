import axios from 'axios';

// Define the base URL for your API
const baseURL = 'http://localhost:8080';

// Create an Axios instance with common settings
const axiosInstance = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to fetch a story by ID
const getStoryById = async (storyId) => {
  try {
    const response = await axiosInstance.get(`/stories/${storyId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching story:', error);
    throw error;
  }
};

// Function to fetch stories without an ID
const getStories = async () => {
  try {
    const response = await axiosInstance.get('/stories');
    return response.data;
  } catch (error) {
    console.error('Error fetching stories:', error);
    throw error;
  }
};

// Function to fetch a list of users
const getUsers = async () => {
  try {
    const response = await axiosInstance.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Function to add a user
const addUser = async (user) => {
  try {
    const response = await axiosInstance.post('/users', user);
    return response.data;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

// Function to fetch a user by their ID
const getUserById = async (userId) => {
  try {
    const response = await axiosInstance.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
};

// Function to add a new story with an ID
const addStory = async (storyId, newStory) => {
  try {
    const response = await axiosInstance.post(`/stories/${storyId}`, newStory);
    return response.data;
  } catch (error) {
    console.error('Error adding new story:', error);
    throw error;
  }
};

// Function to update a story with an ID
const updateStoryById = async (storyId, updatedStory) => {
  try {
    const response = await axiosInstance.put(`/stories/${storyId}`, updatedStory);
    return response.data;
  } catch (error) {
    console.error('Error updating story:', error);
    throw error;
  }
};
// Function to fetch half stories
const getHalfStories = async () => {
  try {
    const response = await axiosInstance.get('/halfstories');
    return response.data;
  } catch (error) {
    console.error('Error fetching half stories:', error);
    throw error;
  }
};

// Function to fetch a half story by ID
const getHalfStoryById = async (halfStoryId) => {
  try {
    const response = await axiosInstance.get(`/halfstories/${halfStoryId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching half story by ID:', error);
    throw error;
  }
};

// Function to add a new half story
const addHalfStory = async (newHalfStory) => {
  try {
    const response = await axiosInstance.post('/halfstories', newHalfStory);
    return response.data;
  } catch (error) {
    console.error('Error adding new half story:', error);
    throw error;
  }
};

// Function to update a half story by ID
const updateHalfStoryById = async (halfStoryId, updatedHalfStory) => {
  try {
    const response = await axiosInstance.put(`/halfstories/${halfStoryId}`, updatedHalfStory);
    return response.data;
  } catch (error) {
    console.error('Error updating half story:', error);
    throw error;
  }
};

// Function to delete a half story by ID
const deleteHalfStoryById = async (halfStoryId) => {
  try {
    const response = await axiosInstance.delete(`/halfstories/${halfStoryId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting half story:', error);
    throw error;
  }
};
export {
  getStoryById,
  getStories,
  getUsers,
  addUser,
  getUserById,
  addStory,
  updateStoryById,
  getHalfStories,
  getHalfStoryById,
  addHalfStory,
  updateHalfStoryById,
  deleteHalfStoryById,
};
