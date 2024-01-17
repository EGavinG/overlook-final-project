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

const loginButton = document.getElementById("login-form-submit");

loginButton.addEventListener("click", async (e) => {
  e.preventDefault();
  const loginForm = document.getElementById("login-form");
  const loginErrorMsg = document.getElementById("login-error-msg");

  const username = loginForm.username.value;
  const password = loginForm.password.value;

  // Extract the customer number from the username
  const customerId = parseInt(username.replace(/\D/g, "")); // Extract only digits

  if (!isNaN(customerNumber) && password === "overlook2021") {

    try {
      const allData = await Promise.all([
        fetchAPIcall(`customers/${customerId}`),
        fetchAPIcall("customers"),
        fetchAPIcall("rooms"),
        fetchAPIcall("bookings"),
      ]);

      currentCustomer = allData[0];
      allCustomers = allData[1].customers;
      allRooms = allData[2].rooms;
      allBookings = allData[3].bookings;

      disperseAllData(currentCustomer, allCustomers, allRooms, allBookings);

      alert("You have successfully logged in.");

      document.getElementById("main-holder").style.display = "none";

      document.querySelector(".main-container").style.display = "flex";
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  } else {
    loginErrorMsg.style.opacity = 1;
  }
});
