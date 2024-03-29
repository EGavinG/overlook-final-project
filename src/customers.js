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

const customersTotalSpending = (bookedRoomsInfo) => {
  const totalExpense = bookedRoomsInfo.reduce((acc, cur) => {
    acc += cur.costPerNight;
    return acc;
  }, 0);

  return totalExpense.toFixed();
};

const filterCustomerBookings = (customer, bookings) => {
  return bookings.filter((booking) => booking.userID === customer.id);
};

const formatDate = (selectedDate) => {
  return selectedDate.replace(/-/g, "/")
};

const resolveCustomerId = (username) => {
  const customerId = parseInt(username.replace('customer', ''), 10);
  return isNaN(customerId) ? null : customerId;
};

const searchRooms = (rooms, bookings, selectedRoomType, selectedDate) => {
  const formattedSelectedDate = formatDate(selectedDate)

  let availableRooms = rooms.filter((room) => {
    if (!bookings.find((booking) => booking.roomNumber === room.number && booking.date === formattedSelectedDate)) {
      return room;
    };
  });

  if (selectedRoomType) {
    availableRooms = availableRooms.filter((room) => room.roomType === selectedRoomType);
  };

  return availableRooms;
};

const uniqueRoomTypes = (allRooms) => {
  return [...new Set(allRooms.map((room) => room.roomType))];
};

export {
  customersBookingsInfo,
  customersTotalSpending,
  filterCustomerBookings,
  formatDate,
  resolveCustomerId,
  searchRooms,
  uniqueRoomTypes
};
