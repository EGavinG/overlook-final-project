// Imports
import { fetchAPIcall } from "./apiCalls";
import {
  currentCustomersBookedRooms,
  currentCustomersRoomInfo,
  customersTotalSpending,
} from "./customers";

// Global Variables
let currentCustomer;
let allCustomers;
let allRooms;
let allBookings;

// EventListeners
// Unsure of how the specific user by login will function with it so will assign a const id to 1 to get that specified user.
window.addEventListener("load", function () {
  const id = 1;
  Promise.all([
    fetchAPIcall(`customers/${id}`),
    fetchAPIcall("customers"),
    fetchAPIcall("rooms"),
    fetchAPIcall("bookings"),
  ]).then((allData) => {
    currentCustomer = allData[0];
    allCustomers = allData[1].customers;
    allRooms = allData[2].rooms;
    allBookings = allData[3].bookings;
    disperseAllData(currentCustomer, allCustomers, allRooms, allBookings);
  });
});

// Dom Functions
const disperseAllData = () => {
  const customersBookedRooms = currentCustomersBookedRooms(
    currentCustomer,
    allBookings
  );
  const customersRoomInfo = currentCustomersRoomInfo(
    customersBookedRooms,
    allRooms
  );
  const customersBookingsExpense = customersTotalSpending(customersRoomInfo);
};
