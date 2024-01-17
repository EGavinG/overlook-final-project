// Imports
import { fetchAPIcall, bookRoom } from "./apiCalls";
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

// EventListeners

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
  searchRooms(selectedRoomType, selectedDate);
});

window.addEventListener("load", function () {
  if (window.currentUser) {
    displayCustomerData(window.currentUser, allCustomers, allRooms, allBookings);
  } else {
    console.log(
      "User not logged in. Display login form or redirect to login page."
    );
  }
});

// Dom Functions
const displayCustomerData = (currentCustomer, allRooms, allBookings) => {
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
        <button class ="booking-=">Book</button> 
      </div>
      <br>
    `;
  });
};

const searchRooms = (selectedRoomType, selectedDate) => {
  // find all rooms available on selected date
  const formattedSelectedDate = selectedDate.replace(/-/g, "/");

  let availableRooms = allRooms.filter((room) => {
    if (
      !allBookings.find(
        (booking) =>
          booking.roomNumber === room.number &&
          booking.date === formattedSelectedDate
      )
    ) {
      return room;
    }
  });

  if (selectedRoomType) {
    availableRooms = availableRooms.filter(
      (room) => room.roomType === selectedRoomType
    );
  }
  const filteredRoomDetailsList = document.getElementById(
    "filteredRoomDetailsList"
  );

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

export { displayCustomerData };
