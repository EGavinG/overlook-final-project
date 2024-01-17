const fetchAPIcall = (data) => {
  return fetch(`http://localhost:3001/api/v1/${data}`)
    .then((response) => response.json())
    .catch((error) => console.log(error));
};

const bookRoom = async (roomNumber, date, customerId) => {
  try {
    const response = await fetch("http://localhost:3001/api/v1/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomNumber: roomNumber,
        date: date,
        userID: customerId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error in bookRoom: ${response.statusText}`);
    }
    const jsonResponse = await response.json();

    return jsonResponse; 
  } catch (error) {
    console.error("Error in bookRoom:", error);
    throw error; 
  }
};


export { fetchAPIcall, bookRoom };
