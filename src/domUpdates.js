// Imports
import { fetchAPIcall } from "./apiCalls";
import {
  welcomeCustomerHeader,
  currentCustomersBookedRooms,
  currentCustomersRoomInfo,
  customersTotalSpending,
} from "./customers";

// Global Variables
let currentCustomer;
let allCustomers;
let allRooms;
let allBookings;

// Query Selectors
const welcomeHeader = document.querySelector("#header");
const totalAmountSpent = document.querySelector("p.spent");
const roomDetailsList = document.getElementById("roomDetailsList");

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

  const welcomeHeader = welcomeCustomerHeader(currentCustomer);
  const customersBookingsExpense = customersTotalSpending(customersRoomInfo);
  totalAmountSpent.innerText = `Total Amount Spent: $${customersBookingsExpense}`;

  updateRoomDetailsList(customersRoomInfo);
};

const updateRoomDetailsList = (roomInfo) => {
  roomDetailsList.innerHTML = "";
  roomInfo.forEach((room) => {
    const listItem = document.createElement("li");
    listItem.textContent = `Date: ${room.date}, Room Type: ${room.roomType}, Bed Size: ${room.bedSize}, Cost per Night: $${room.costPerNight}`;
    roomDetailsList.appendChild(listItem);
  });
};
