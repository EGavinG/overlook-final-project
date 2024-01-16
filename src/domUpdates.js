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
const bookRoomButton = document.getElementById("bookRoom");

// EventListeners
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

bookRoomButton.addEventListener("click", () => {
  const selectedRoomType = roomTypeFilter.value;
  const selectedDate = fromDateInput.value;
  bookRoom(selectedRoomType, selectedDate);
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

// Function that updates the dom to show filtered room results
const updateRoomDetailsList = (roomInfo) => {
  roomDetailsList.innerHTML = "";
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
        <button>Book</button> 
      </div>
    `;
    roomDetailsList.appendChild(listItem);
  });
};

function bookRoom(selectedRoomType, selectedDate) {
  const formattedSelectedDate = selectedDate.replace(/-/g, "/");
  const filteredRooms = allRooms.filter(
    (room) => room.roomType === selectedRoomType
  );

  const bookedRooms = allBookings.filter(
    (booking) => booking.date === formattedSelectedDate
  );

  const availableRooms = filteredRooms.filter((room) => {
    return bookedRooms.find(
      (availableRoom) => availableRoom.roomNumber === room.number
    );
  });

  const filteredRoomDetailsList = document.getElementById(
    "filteredRoomDetailsList"
  );

  console.log(availableRooms);
  if (availableRooms.length > 0) {
    updateFilteredRoomDetailsList(availableRooms, formattedSelectedDate);
  } else {
    filteredRoomDetailsList.innerHTML = `
      <p>No rooms available with the selected criteria. Please search again.</p>`;
  }
}

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
