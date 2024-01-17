// Imports for initial start of scripts.js
import "./css/styles.css";
import "./images/turing-logo.png";
import { fetchAPIcall, bookRoomFunction } from "./apiCalls";
import { displayCustomerData, updateRoomTypeFilterOptions } from "./domUpdates";
import { resolveCustomerId } from "./customers";

const loginButton = document.getElementById("login-form-submit");
loginButton.addEventListener("click", async (e) => {
  e.preventDefault();
  const loginForm = document.getElementById("login-form");
  const loginErrorMsg = document.getElementById("login-error-msg");

  const username = loginForm.username.value;
  const password = loginForm.password.value;

  // Extract the customer number from the username
  const customerId = resolveCustomerId(username); // Extract only digits

  if (typeof customerId === "number" && password === "1") {
    try {
      const allData = await Promise.all([
        fetchAPIcall(`customers/${customerId}`),
        fetchAPIcall("rooms"),
        fetchAPIcall("bookings"),
      ]);

      const customer = allData[0];
      const rooms = allData[1].rooms;
      const bookings = allData[2].bookings;

      displayCustomerData(customer, rooms, bookings);
      updateRoomTypeFilterOptions(rooms);

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

const dateSubmitForm = document.getElementById("customerInteraction");
dateSubmitForm.addEventListener("submit", handleFormSubmit);

function handleFormSubmit(e) {
  e.preventDefault();
  const dateSelector = document.getElementById("bookingDate");
  const roomTypeSelector = document.getElementById("roomTypeFilter");

  const selectedDate = dateSelector.value;
  const selectedRoomType = roomTypeSelector.value;

  kjj(selectedDate, selectedRoomType)
}

