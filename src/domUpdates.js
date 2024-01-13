// Imports
import { fetchAPIcall } from "./apiCalls";
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

dateSubmitForm.addEventListener("submit", handleFormSubmit);
function handleFormSubmit(e) {
  e.preventDefault();
  const fromDate = fromDateInput.value;
  const selectedRoomType = roomTypeFilter.value;

  if (fromDate) {
    availableRoomsText.classList.add("hidden");
    updateRoomDetailsList(allRooms, roomDetailsList);
  } else {
    calendarError.classList.remove("hidden");
    bookStayText.classList.add("hidden");
  }

  if (selectedRoomType !== "roomOptions") {
    const filteredRooms = filterRoomsByType(allRooms, selectedRoomType);
    updateRoomDetailsList(filteredRooms, filteredRoomDetailsList);
  }
}

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

const updateRoomDetailsList = (roomInfo) => {
  roomDetailsList.innerHTML = "";
  roomInfo.forEach((room) => {
    const listItem = document.createElement("li");
    listItem.textContent = `Date: ${room.date}, Room Type: ${room.roomType}, Bed Size: ${room.bedSize}, Cost per Night: $${room.costPerNight}`;
    roomDetailsList.appendChild(listItem);

    filteredRoomDetailsList.innerHTML += `
      <div class="bookings-card">
        <p class="descriptor"> Room Type: <span>${room.roomType}</span></p>
        <p class="descriptor"> Bed Size: <span>${room.bedSize}</span></p>
        <p class="descriptor"> Beds: <span>${room.numBeds}</span></p>
        <p class="descriptor"> Per Night: <span>$${room.costPerNight}</span></p>
        <button>View</button> 
      </div>
    `;
    roomDetailsList.appendChild(listItem);
  });
};

const updateFilteredRoomDetailsList = (filteredRoomInfo) => {
  filteredRoomDetailsList.innerHTML = "";
  filteredRoomInfo.forEach((room) => {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("bookings-card");
    cardDiv.innerHTML = `
      <p class="descriptor"> Room Type: <span>${room.roomType}</span></p>
      <p class="descriptor"> Bed Size: <span>${room.bedSize}</span></p>
      <p class="descriptor"> Beds: <span>${room.numBeds}</span></p>
      <p class="descriptor"> Per Night: <span>$${room.costPerNight}</span></p>
      <button>View</button>
    `;
    filteredRoomDetailsList.appendChild(cardDiv);
  });
};

const updateRoomTypeFilterOptions = (roomTypes) => {
  const roomTypeFilter = document.getElementById("roomTypeFilter");

  roomTypeFilter.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "roomOptions";
  defaultOption.textContent = "Rooms";
  roomTypeFilter.appendChild(defaultOption);

  roomTypes.forEach((roomType) => {
    const option = document.createElement("option");
    option.value = roomType;
    option.textContent = roomType;
    roomTypeFilter.appendChild(option);
  });
};
