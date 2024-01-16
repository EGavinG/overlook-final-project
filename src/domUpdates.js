// Imports
import { fetchAPIcall, bookRoomFunction } from "./apiCalls";
import {
  welcomeCustomerHeader,
  currentCustomersBookedRooms,
  currentCustomersRoomInfo,
  customersTotalSpending,
  uniqueRoomTypes,
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
const filteredRoomDetailsList = document.getElementById(
  "filteredRoomDetailsList"
);
const dateSubmitForm = document.getElementById("customerInteraction");
const fromDateInput = document.getElementById("bookingDate");
const roomTypeFilter = document.getElementById("roomTypeFilter");
const availableRoomsText = document.getElementById("availableRoomsText");
const calendarError = document.getElementById("calendarError");
const bookStayText = document.getElementById("bookStayText");
const bookRoomButton = document.getElementById("bookRoom");
const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");

// EventListeners

window.addEventListener("load", async function () {
  if (window.currentUser) {
    // If logged in, load data for the current user
    try {
      const allData = await Promise.all([
        fetchAPIcall(`customers/${window.currentUser}`),
        fetchAPIcall("customers"),
        fetchAPIcall("rooms"),
        fetchAPIcall("bookings"),
        bookRoomFunction("bookings"),
      ]);

      currentCustomer = allData[0];
      allCustomers = allData[1].customers;
      allRooms = allData[2].rooms;
      allBookings = allData[3].bookings;

      disperseAllData(currentCustomer, allCustomers, allRooms, allBookings);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  } else {
    // If not logged in, show login form or redirect to login page
    console.log(
      "User not logged in. Display login form or redirect to login page."
    );
  }
});

loginButton.addEventListener("click", async (e) => {
  e.preventDefault();
  const username = loginForm.username.value;
  const password = loginForm.password.value;

  // Extract the customer number from the username
  const customerNumber = parseInt(username.replace(/\D/g, "")); // Extract only digits

  if (!isNaN(customerNumber) && password === "overlook2021") {
    let id = customerNumber;

    try {
      const allData = await Promise.all([
        fetchAPIcall(`customers/${id}`),
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

dateSubmitForm.addEventListener("submit", handleFormSubmit);

function handleFormSubmit(e) {
  e.preventDefault();
  const fromDate = fromDateInput.value;
  const selectedRoomType = roomTypeFilter.value;

  if (fromDate) {
    availableRoomsText.classList.add("hidden");
    const roomsConnectedToDate = getRoomsConnectedToDate(fromDate);

    const filteredRooms =
      selectedRoomType !== "roomOptions"
        ? filterRoomsByType(roomsConnectedToDate, selectedRoomType)
        : roomsConnectedToDate;

    updateRoomDetailsList(filteredRooms);
  } else {
    calendarError.classList.remove("hidden");
    bookStayText.classList.add("hidden");
  }
}

bookRoomButton.addEventListener("click", () => {
  const selectedRoomType = roomTypeFilter.value;
  const selectedDate = fromDateInput.value;
  bookRoom(selectedRoomType, selectedDate);
});

window.addEventListener("load", function () {
  if (window.currentUser) {
    disperseAllData(window.currentUser, allCustomers, allRooms, allBookings);
  } else {
    console.log(
      "User not logged in. Display login form or redirect to login page."
    );
  }
});

// Dom Functions
const disperseAllData = (data) => {
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

  const roomTypes = uniqueRoomTypes(allRooms);
  updateRoomTypeFilterOptions(roomTypes);

  updateRoomDetailsList(customersRoomInfo);

  uniqueRoomTypes(allRooms);
};

function filterRoomsByType(rooms, roomType) {
  return rooms.filter((room) => room.roomType === roomType);
}

// Function that updates the dom to show filtered room results
const updateRoomDetailsList = (roomInfo) => {
  // if (window.currentUser) {
  filteredRoomDetailsList.innerHTML = ""; // Clear filtered room details list
  roomDetailsList.innerHTML = ""; // Clear original room details list

  roomInfo.forEach((room) => {
    const listItem = document.createElement("li");
    listItem.textContent = `Date: ${room.date}, Room Type: ${room.roomType}, Bed Size: ${room.bedSize}, Cost per Night: $${room.costPerNight}`;
    roomDetailsList.appendChild(listItem);

    filteredRoomDetailsList.innerHTML += `
      <div class="bookings-card">
        <p class="date"> Date: <span>${room.date}</span></p>
        <p class="descriptor"> Room Type: <span>${room.roomType}</span></p>
        <p class="descriptor"> Bed Size: <span>${room.bedSize}</span></p>
        <p class="descriptor"> Beds: <span>${room.numBeds}</span></p>
        <p class="descriptor"> Per Night: <span>$${room.costPerNight}</span></p>
        <button class ="booking-button">Book</button> 
      </div>
      <br>
    `;
  });
};

const bookRoom = (selectedRoomType, selectedDate) => {
  const formattedSelectedDate = selectedDate.replace(/-/g, "/");
  const bookedRoomsForSeletedDate = allBookings.filter(
    (booking) => booking.date === formattedSelectedDate
  );

  console.log(bookedRoomsForSeletedDate);

  function isRoomAvailable(roomId) {
    const room = bookedRoomsForSeletedDate.find(
      (availableRoom) => availableRoom.roomNumber === roomId
    );
    if (room) {
      return false;
    } else {
      return true;
    }
  }
  console.log(allRooms);
  let availableRooms = allRooms.filter((room) => {
    if (isRoomAvailable(room.number)) {
      return room;
    }
  });
  if (selectedRoomType) {
    availableRooms = availableRooms.filter(
      (room) => room.roomType === selectedRoomType
    );
  }
  console.log(availableRooms);
  const filteredRoomDetailsList = document.getElementById(
    "filteredRoomDetailsList"
  );

  // console.log(availableRooms);
  // const roomDates = allBookings.filter((booking) => {
  //   return booking.date === selectedDate.replace(/-/g, "/");
  // });
  // console.log(selectedDate);
  // console.log(roomDates);

  // Display available rooms for the specified date on the DOM
  updateFilteredRoomDetailsList(availableRooms);

  console.log(availableRooms.length);
  if (availableRooms.length === 0) {
    filteredRoomDetailsList.innerHTML = `
        <p>No rooms available with the selected criteria. Please search again.</p>`;
  } else if (availableRooms.length > 0) {
    updateFilteredRoomDetailsList(availableRooms);
  }
};

// Dom function that updates filtered results
const updateFilteredRoomDetailsList = (filteredRoomInfo, selectedDate) => {
  filteredRoomDetailsList.innerHTML = "";

  filteredRoomInfo.forEach((room) => {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("bookings-card");

    const detailsList = document.createElement("ul");

    for (const [key, value] of Object.entries(room)) {
      const listItem = document.createElement("li");
      listItem.textContent = `${
        key.charAt(0).toUpperCase() + key.slice(1)
      }: ${value}`;
      detailsList.appendChild(listItem);
    }

    const bookButton = document.createElement("button");
    bookButton.textContent = "Book";

    cardDiv.appendChild(detailsList);
    cardDiv.appendChild(bookButton);

    filteredRoomDetailsList.appendChild(cardDiv);
  });
};

// provides room options
const updateRoomTypeFilterOptions = (roomTypes) => {
  const roomTypeFilter = document.getElementById("roomTypeFilter");

  roomTypeFilter.innerHTML = "";

  // Default option (not selectable)
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select Room Type";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  roomTypeFilter.appendChild(defaultOption);

  // Capitalize the first letter of each room type
  roomTypes.forEach((roomType) => {
    const option = document.createElement("option");
    option.value = roomType;
    option.textContent = roomType.charAt(0).toUpperCase() + roomType.slice(1);
    roomTypeFilter.appendChild(option);
  });
};
