// Imports for initial start of scripts.js
import "./css/styles.css";
import "./images/turing-logo.png";
import { fetchAPIcall, bookRoomFunction } from "./apiCalls";
import "./domUpdates";


window.addEventListener("load", async function () {
    if (window.currentUser) {
      // If logged in, load data for the current user
      try {
        const allData = await Promise.all([
          fetchAPIcall(`customers/${window.currentUser}`),
          fetchAPIcall("customers"),
          fetchAPIcall("rooms"),
          fetchAPIcall("bookings"),
        //   bookRoomFunction("bookings"),
        ]);
  
        currentCustomer = allData[0];
        allCustomers = allData[1].customers;
        allRooms = allData[2].rooms;
        allBookings = allData[3].bookings;
  
        disperseAllData(currentCustomer, allCustomers, allRooms, allBookings);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  });
  