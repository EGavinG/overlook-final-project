const welcomeCustomerHeader = (customer) => {
  return (header.textContent = `Welcome to Your Overlook Booking Dashboard, ${
    customer.name.split(" ")[0]
  }!`);
};

const filterCustomerBookings = (customer, bookings) => {
  return bookings.filter((booking) => booking.userID === customer.id);
};

const customersBookingsInfo = (customer, rooms, bookings) => {
  const customerBookings = filterCustomerBookings(customer, bookings)

  const bookingsInfo = customerBookings.map((booking) => {
    const room = rooms.find((room) => room.number === booking.roomNumber);
    return {
      date: booking.date,
      bedSize: room.bedSize,
      bidet: room.bidet,
      costPerNight: room.costPerNight,
      numBeds: room.numBeds,
      number: room.number,
      roomType: room.roomType
    }
  })

  return bookingsInfo.sort((a, b) => b.date.localeCompare(a.date));
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
};

export {
  uniqueRoomTypes,
  welcomeCustomerHeader,
  customersBookingsInfo,
  customersTotalSpending,
  resolveCustomerId,
};
