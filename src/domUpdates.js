// Imports
import { customersBookingsInfo, customersTotalSpending, uniqueRoomTypes } from "./customers";

const displayAvailableRooms = (availableRooms) => {
  const availableRoomsList = document.getElementById("availableRooms");

  if (availableRooms.length === 0) {
    availableRoomsList.innerHTML = `<p>No rooms available with the selected criteria. Please search again.</p>`;
  } else if (availableRooms.length > 0) {
    availableRoomsList.innerHTML = "";

    availableRooms.forEach((room) => {
      const cardDiv = document.createElement("div");
      cardDiv.classList.add("bookings-card");

      cardDiv.dataset.number = room.number;

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
  }
};


const displayBookedRoomsInfo = (bookedRoomsInfo) => {
  const roomDetailsList = document.getElementById("roomDetailsList");

  roomDetailsList.innerHTML = ""; // Clear original room details list

  bookedRoomsInfo.forEach((bookedRoomInfo) => {
    const listItem = document.createElement("li");
    listItem.textContent = `Date: ${bookedRoomInfo.date}, Info Type: ${bookedRoomInfo.roomType}, Bed Size: ${bookedRoomInfo.bedSize}, Cost per Night: $${bookedRoomInfo.costPerNight}`;
    roomDetailsList.appendChild(listItem);
  });
};

const displayCustomerData = (customer, rooms, bookings) => {
  displayWelcomeHeader(customer);

  const bookedRoomsInfo = customersBookingsInfo(customer, rooms, bookings);
  displayTotalAmountSpent(bookedRoomsInfo)
  displayBookedRoomsInfo(bookedRoomsInfo);
};

function displayTotalAmountSpent(bookedRoomsInfo) {
  const spendingInfoContainer = document.querySelector("p.spent");
  const amountSpent = customersTotalSpending(bookedRoomsInfo);

  spendingInfoContainer.innerText = `Total Amount Spent: $${amountSpent}`;
};

function displayWelcomeHeader(customer) {
  header.textContent = `Welcome to Your Overlook Booking Dashboard, ${customer.name.split(" ")[0]}!`;
};

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

export { displayAvailableRooms, displayCustomerData, updateRoomTypeFilterOptions };
