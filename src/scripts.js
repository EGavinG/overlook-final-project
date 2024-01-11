// Imports for initial start of scripts.js
import "./css/styles.css";
import "./images/turing-logo.png";
import "./apiCalls";
import { fetchAPIcall } from "./apiCalls";

// Created the intial structure of Promise.all to run on load so the data is populated initially.
// Unsure of how the specific user by login will function with it so will assign a const id to 1 to get that specified user.
window.addEventListener("load", function () {
  const id = 1;
  Promise.all([
    fetchAPIcall(`customers/${id}`),
    fetchAPIcall("customers"),
    fetchAPIcall("rooms"),
    fetchAPIcall("bookings"),
  ]).then((allData) => {
    console.log(allData);
    // currentCustomer = allData[0];
    // allCustomers = allData[1].customers;
    // allRooms = allData[2].rooms;
    // allBookings = allData[3].bookings;
  });
});
