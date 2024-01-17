const fetchAPIcall = (data) => {
  return fetch(`http://localhost:3001/api/v1/${data}`)
    .then((response) => response.json())
    .catch((error) => console.log(error));
};

//Not in use yet
const bookRoomFunction = (roomNumber, fromDate, userID) => {
  return fetch("http://localhost:3001/api/v1/${data}", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userID: userID,
      date: fromDate,
      roomNumber: roomNumber,
    }),
  })
    .then((res) => {
      if (res.ok) {
        allBookings.push({
          userID: userID,
          date: fromDate,
          roomNumber: roomNumber,
        });
        return res.json();
      } else {
        console.log("status", res.status);
        return res.json().then((errorData) => {
          throw new Error(
            errorData.message ||
              "Unable to reserve the room. Please give us a call"
          );
        });
      }
    })
    .then((data) => console.log(data))
    .catch((error) => {
      console.log(error.message);
    });
};

export {fetchAPIcall, bookRoomFunction}