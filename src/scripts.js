// Imports for initial start of scripts.js
import "./css/styles.css";
import "./images/turing-logo.png";

// Created the intial structure of Promise.all to run on load so the data is populated initially.
// Unsure of how the specific user by login will function so will with this so refactoring will be created
// after Api functions are created.
// window.addEventListener("load", function () {
//     const id = 1;
//     Promise.all([
//       fetchAPIcall(`customers/${id}`),
//       fetchAPIcall("customers"),
//       fetchAPIcall("rooms"),
//       fetchAPIcall("bookings"),
//     ]).then((allData) => {
//     //   currentCustomer = allData[0]
//     //   allCustomers = allData[1].customers
//     //   allRooms = allData[2].rooms
//     //   allBookings = allData[3].bookings
//     });
//   });
