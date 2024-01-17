// Imports
import { fetchAPIcall, bookRoom } from "./apiCalls";
import {
  customersBookingsInfo,
  customersTotalSpending,
  uniqueRoomTypes,
} from "./customers";

// Global Variables
let allRooms;
let allBookings;

// Query Selectors
const roomDetailsList = document.getElementById("roomDetailsList");
const availableRoomsList = document.getElementById("availableRooms");
const roomTypeFilter = document.getElementById("roomTypeFilter");
const calendarError = document.getElementById("calendarError");
const bookStayText = document.getElementById("bookStayText");
const searchRoomsButton = document.getElementById("searchRooms");

// EventListeners


function handleFormSubmit(e) {
  e.preventDefault();
  const fromDate = fromDateInput.value;
  const selectedRoomType = roomTypeFilter.value;

  if (fromDate) {
    const roomsConnectedToDate = availableRooms(date);

    const filteredRooms =
      selectedRoomType !== "roomOptions"
        ? filterRoomsByType(roomsConnectedToDate, selectedRoomType)
        : roomsConnectedToDate;

    displayBookedRoomInfo(filteredRooms);
  } else {
    calendarError.classList.remove("hidden");
    bookStayText.classList.add("hidden");
  }
}

// Dom Functions
const displayCustomerData = (customer, rooms, bookings) => {
  displayWelcomeHeader(customer);

  const bookedRoomsInfo = customersBookingsInfo(customer, rooms, bookings);
  displayTotalAmountSpent(bookedRoomsInfo)
  displayBookedRoomsInfo(bookedRoomsInfo);
};

function displayWelcomeHeader(customer) {
  header.textContent = `Welcome to Your Overlook Booking Dashboard, ${customer.name.split(" ")[0]}!`;
};

function displayTotalAmountSpent(bookedRoomsInfo) {
  const spendingInfoContainer = document.querySelector("p.spent");
  const amountSpent = customersTotalSpending(bookedRoomsInfo);

  spendingInfoContainer.innerText = `Total Amount Spent: $${amountSpent}`;
}

function filterRoomsByType(rooms, roomType) {
  return rooms.filter((room) => room.roomType === roomType);
}

// Function that updates the dom to show filtered room results
const displayRooms = (rooms) => {

}

const displayBookedRoomsInfo = (bookedRoomsInfo) => {
  availableRoomsList.innerHTML = ""; // Clear filtered room details list
  roomDetailsList.innerHTML = ""; // Clear original room details list

  bookedRoomsInfo.forEach((bookedRoomInfo) => {
    const listItem = document.createElement("li");
    listItem.textContent = `Date: ${bookedRoomInfo.date}, Info Type: ${bookedRoomInfo.roomType}, Bed Size: ${bookedRoomInfo.bedSize}, Cost per Night: $${bookedRoomInfo.costPerNight}`;
    roomDetailsList.appendChild(listItem);
  });
};

// Dom function that updates filtered results
const displayAvailableRooms = (availableRooms) => {

  if (availableRooms.length === 0) {
    availableRoomsList.innerHTML = `<p>No rooms available with the selected criteria. Please search again.</p>`;
  } else if (availableRooms.length > 0) {
    availableRoomsList.innerHTML = "";

    availableRooms.forEach((room) => {
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

      availableRoomsList.appendChild(cardDiv);
    });
  };
};

// provides room options
const updateRoomTypeFilterOptions = (rooms) => {
  const roomTypeFilter = document.getElementById("roomTypeFilter");
  roomTypeFilter.innerHTML = "";

  // Default option (not selectable)
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select Room Type";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  roomTypeFilter.appendChild(defaultOption);

  const roomTypes = uniqueRoomTypes(rooms);
  roomTypes.forEach((roomType) => {
    const option = document.createElement("option");
    option.value = roomType;
    option.textContent = roomType.charAt(0).toUpperCase() + roomType.slice(1);
    roomTypeFilter.appendChild(option);
  });
};

export { displayCustomerData, updateRoomTypeFilterOptions, displayAvailableRooms };
