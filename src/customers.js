const welcomeCustomerHeader = (currentCustomer) => {
  return (header.textContent = `Welcome to Your Overlook Booking Dashboard, ${
    currentCustomer.name.split(" ")[0]
  }!`);
};

const currentCustomersBookedRooms = (currentCustomer, bookedRooms) => {
  const customerID = currentCustomer.id;
  return bookedRooms.filter((booking) => booking.userID === customerID);
};

const currentCustomersRoomInfo = (customersBookedRooms, allRooms) => {
  const findRoomNumbers = customersBookedRooms.map(
    (bookedRoom) => bookedRoom.roomNumber
  );

  const bookedDates = customersBookedRooms.map((bookedRoom) => bookedRoom.date);

  const filteredRooms = allRooms.filter((room) =>
    findRoomNumbers.includes(room.number)
  );

  const filteredRoomsAndDates = filteredRooms.map((room, index) => {
    return {
      date: bookedDates[index],
      bedSize: room.bedSize,
      bidet: room.bidet,
      costPerNight: room.costPerNight,
      numBeds: room.numBeds,
      number: room.number,
      roomType: room.roomType,
    };
  });

  return filteredRoomsAndDates.sort((a, b) => b.date.localeCompare(a.date))
};

const customersTotalSpending = (roomInfo) => {
  const totalExpense = roomInfo.reduce((acc, cur) => {
    acc += cur.costPerNight;
    return acc;
  }, 0);

  return totalExpense.toFixed();
};

const uniqueRoomTypes = (allRooms) => {
  return [...new Set(allRooms.map((room) => room.roomType))];
};

const resolveCustomerId = (username) => {
  return parseInt(username.replace(/\D/g, ""));
}

export {
  uniqueRoomTypes,
  welcomeCustomerHeader,
  currentCustomersBookedRooms,
  currentCustomersRoomInfo,
  customersTotalSpending,
  resolveCustomerId,
};
