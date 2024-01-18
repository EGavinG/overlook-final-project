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
      { number: 103, roomType: 'Suite', costPerNight: 200 }
    ];
    bookings = [
      { userID: 1, roomNumber: 101, date: '2024/01/01' },
      { userID: 1, roomNumber: 102, date: '2024/01/02' },
    ];
  });

  describe('customersBookingsInfo', () => {
    it('should return an array of customer bookings info sorted by date', () => {
      const result = customersBookingsInfo(customer, rooms, bookings);
      expect(result).to.be.an('array').and.to.have.lengthOf(2);
      expect(result[0]).to.include({ date: '2024/01/02', roomType: 'Deluxe' });
      expect(result[1]).to.include({ date: '2024/01/01', roomType: 'Standard' });
    });
  });

  describe('customersTotalSpending', () => {
    it('should return the total spending of a customer on bookings', () => {
      const bookedRoomsInfo = customersBookingsInfo(customer, rooms, bookings);
      const result = customersTotalSpending(bookedRoomsInfo);
      expect(result).to.be.a('string').and.to.equal('250'); 
    });

    it('should return "0" for a customer with no bookings', () => {
      const result = customersTotalSpending([]);
      expect(result).to.be.a('string').and.to.equal('0');
    });
  });

  describe('filterCustomerBookings', () => {
    it('should return an array of bookings for a specific customer', () => {
      const result = filterCustomerBookings(customer, bookings);
      expect(result).to.be.an('array').and.to.have.lengthOf(2);
    });

    it('should return an empty array for a customer with no bookings', () => {
      const result = filterCustomerBookings({ id: 2, name: 'Jane Doe' }, bookings);
      expect(result).to.be.an('array').and.to.be.empty;
    });
  });

  describe('formatDate', () => {
    it('should return a formatted date string', () => {
      const selectedDate = '2024-01-01';
      const result = formatDate(selectedDate);
      expect(result).to.be.a('string').and.to.equal('2024/01/01');
    });
  });

  describe('resolveCustomerId', () => {
    it('should return the resolved customer ID from the username', () => {
      const username = 'customer42';
      const result = resolveCustomerId(username);
      expect(result).to.be.a('number').and.to.equal(42);
    });

    it('should return null for an invalid username format', () => {
      const username = 'invalidUsername';
      const result = resolveCustomerId(username);
      expect(result).to.equal(null);
    });
  });

  describe('searchRooms', () => {
    it('should return an array of available rooms based on criteria', () => {
      const selectedRoomType = 'Suite';
      const selectedDate = '2023-01-02';
      const result = searchRooms(rooms, bookings, selectedRoomType, selectedDate);
      expect(result).to.be.an('array').and.to.have.lengthOf(1);
      expect(result[0]).to.include({ roomType: 'Suite' });
    });

    it('should return an empty array if no rooms are available', () => {
      const selectedRoomType = 'Standard';
      const selectedDate = '2024-01-01';
      const result = searchRooms(rooms, bookings, selectedRoomType, selectedDate);
      expect(result).to.be.an('array').and.to.be.empty;
    });
  });

  describe('uniqueRoomTypes', () => {
    it('should return an array of unique room types', () => {
      const result = uniqueRoomTypes(rooms);
      expect(result).to.be.an('array').and.to.have.members(['Standard', 'Deluxe', 'Suite']);
    });
  });

});