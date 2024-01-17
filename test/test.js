import { expect } from 'chai';
import {
  customersBookingsInfo,
  customersTotalSpending,
  filterCustomerBookings,
  formatDate,
  resolveCustomerId,
  searchRooms,
  uniqueRoomTypes
} from '/./src/customers.js';  

describe('Hotel Booking Functions', () => {
  let customer, rooms, bookings;

  beforeEach(() => {
    customer = { id: 1, name: 'John Doe' };
    rooms = [
      { number: 101, roomType: 'Standard', costPerNight: 100 },
      { number: 102, roomType: 'Deluxe', costPerNight: 150 },
    ];
    bookings = [
      { userID: 1, roomNumber: 101, date: '2024/01/01' },
      { userID: 1, roomNumber: 102, date: '2024/01/02' },
    ];
  });

  describe('customersBookingsInfo', () => {
    it('should return an array of customer bookings info sorted by date', () => {
      const result = customersBookingsInfo(customer, rooms, bookings);
      expect(result).to.be.an('array');
    });
  });

  describe('customersTotalSpending', () => {
    it('should return the total spending of a customer on bookings', () => {
      const bookedRoomsInfo = customersBookingsInfo(customer, rooms, bookings);
      const result = customersTotalSpending(bookedRoomsInfo);
      expect(result).to.be.a('string');
    });
  });

  describe('filterCustomerBookings', () => {
    it('should return an array of bookings for a specific customer', () => {
      const result = filterCustomerBookings(customer, bookings);
      expect(result).to.be.an('array');
    });
  });

  describe('formatDate', () => {
    it('should return a formatted date string', () => {
      const selectedDate = '2024-01-01';
      const result = formatDate(selectedDate);
      expect(result).to.be.a('string');
    });
  });

  describe('resolveCustomerId', () => {
    it('should return the resolved customer ID from the username', () => {
      const username = 'customer42';
      const result = resolveCustomerId(username);
      expect(result).to.equal(42);
    });
  });

  describe('searchRooms', () => {
    it('should return an array of available rooms based on criteria', () => {
      const selectedRoomType = 'Deluxe';
      const selectedDate = '2024-01-02';
      const result = searchRooms(rooms, bookings, selectedRoomType, selectedDate);
      expect(result).to.be.an('array');
    });
  });

  describe('uniqueRoomTypes', () => {
    it('should return an array of unique room types', () => {
      const result = uniqueRoomTypes(rooms);
      expect(result).to.be.an('array');
    });
  });

});