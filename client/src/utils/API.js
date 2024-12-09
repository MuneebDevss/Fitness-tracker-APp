// Helper function to handle errors
const handleError = (error) => {
  console.error("Error occurred:", error);
  alert("Something went wrong. Please try again.");
};

// Get logged in user's info


// Create a new user


// Login a user


// Create a cardio exercise


// Create a resistance exercise
export const createResistance = async (resistanceData, token) => {
  try {
    const response = await fetch("http://localhost:5000/api/exercise/resistance", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(resistanceData),
    });

    if (!response.ok) {
      throw new Error('Failed to create resistance exercise');
    }

    return await response.json();
  } catch (error) {
    handleError(error);
  }
};

// Get cardio exercise by ID
export const getCardioById = async (cardioId, token) => {
  try {
    const response = await fetch(`http://localhost:5000/api/exercise/cardio/${cardioId}`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch cardio exercise');
    }

    return await response.json();
  } catch (error) {
    handleError(error);
  }
};

// Get resistance exercise by ID
export const getResistanceById = async (resistanceId, token) => {
  try {
    const response = await fetch(`http://localhost:5000/api/exercise/resistance/${resistanceId}`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch resistance exercise');
    }

    return await response.json();
  } catch (error) {
    handleError(error);
  }
};

// Delete a cardio exercise
export const deleteCardio = async (cardioId, token) => {
  try {
    const response = await fetch(`http://localhost:5000/api/exercise/cardio/${cardioId}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete cardio exercise');
    }

    return await response.json();
  } catch (error) {
    handleError(error);
  }
};

// Delete a resistance exercise
export const deleteResistance = async (resistanceId, token) => {
  try {
    const response = await fetch(`http://localhost:5000/api/exercise/resistance/${resistanceId}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete resistance exercise');
    }

    return await response.json();
  } catch (error) {
    handleError(error);
  }
};
