'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import NavigationBar from '@/components/dashboard/NavigationBar';
import Sidebar from '@/components/layout/Sidebar';
import VehicleCard from '@/components/dashboard/VehicleCard';
import FloatingActionButton from '@/components/dashboard/FloatingActionButton';
import InquiryCard, { type Inquiry } from '@/components/dashboard/InquiryCard';
import DisputeCard, { type Dispute } from '@/components/dashboard/DisputeCard';
import RaiseDisputeOverlay from '@/components/overlays/RaiseDisputeOverlay';
import RequestPartOverlay from '@/components/overlays/RequestPartOverlay';
import EstimationOverlay from '@/components/overlays/EstimationOverlay';
import NewJobCardOverlay from '@/components/overlays/NewJobCardOverlay';
import GateOutOverlay from '@/components/overlays/GateOutOverlay';
import OrderCard, { type Order } from '@/components/dashboard/OrderCard';
import QuoteCard, { type Quote } from '@/components/dashboard/QuoteCard';
import JobCard from '@/components/dashboard/JobCard';
import { getVehicleById, getJobCardsByVehicle, type VehicleResponse, type JobCardResponse } from '@/services/api';

// Mock data for Raise Dispute overlay
const orderSuggestions = [
  { id: '1', orderId: 'ord/esoft/5420012/25-26', date: '24 Dec 2025' },
  { id: '2', orderId: 'ord/esoft/5489812/25-26', date: '24 Dec 2025' },
  { id: '3', orderId: 'ord/esoft/5490711/25-26', date: '24 Dec 2025' },
  { id: '4', orderId: 'ord/esoft/5445324/25-26', date: '22 Dec 2025' },
];

const partsOptions = [
  { id: '1', name: 'Oil Filter' },
  { id: '2', name: 'Rear Brake Pads' },
  { id: '3', name: 'Replace Order' },
  { id: '4', name: 'Front Brake Pads' },
  { id: '5', name: 'Air Filter' },
];

const reasonsOptions = [
  { id: '1', name: 'Part Damaged' },
  { id: '2', name: 'Wrong Part Delivered' },
  { id: '3', name: 'Quality Issue' },
  { id: '4', name: 'Missing Parts' },
  { id: '5', name: 'Defective Part' },
];

// Mock data for Orders
const mockOrders: Order[] = [
  {
    id: '1',
    vehicleName: 'Toyota Crysta',
    plateNumber: 'MP09-GP4567',
    orderId: 'ET/ORD/24-25/01255',
    placedDate: '5 dec 2025',
    deliveryDate: '12 dec 2025',
    totalAmount: 2750.50,
    status: 'in-process',
    orderedParts: [
      { id: '1', name: 'Brake Pad Set (Front)', brand: 'Bosch OEM', price: 500, quantity: 2 },
      { id: '2', name: 'Oil Filter (Synthetic)', brand: 'Aftra Modval', price: 1650.50, quantity: 4 },
      { id: '3', name: 'Wiper Blade - Driver Side', brand: 'Bosch OEM', price: 600, quantity: 1 },
      { id: '4', name: 'Air Filter', brand: 'K&N', price: 850, quantity: 1 },
      { id: '5', name: 'Spark Plug Set', brand: 'NGK', price: 400, quantity: 4 },
      { id: '6', name: 'Coolant', brand: 'Castrol', price: 350, quantity: 2 },
      { id: '7', name: 'Brake Fluid', brand: 'Motul', price: 280, quantity: 1 },
      { id: '8', name: 'Engine Oil 5W-30', brand: 'Shell', price: 1200, quantity: 2 },
      { id: '9', name: 'Cabin Filter', brand: 'Mann', price: 450, quantity: 1 },
      { id: '10', name: 'Transmission Oil', brand: 'Castrol', price: 680, quantity: 1 },
    ],
  },
  {
    id: '2',
    vehicleName: 'Toyota Crysta',
    plateNumber: 'MP09-GP4567',
    orderId: 'ET/ORD/24-25/01256',
    placedDate: '3 dec 2025',
    deliveryDate: '12 dec 2025',
    totalAmount: 2750.50,
    status: 'shipped',
    orderedParts: [
      { id: '1', name: 'Brake Pad Set (Front)', brand: 'Bosch OEM', price: 500, quantity: 2 },
      { id: '2', name: 'Oil Filter (Synthetic)', brand: 'Aftra Modval', price: 1650.50, quantity: 4 },
      { id: '3', name: 'Wiper Blade - Driver Side', brand: 'Bosch OEM', price: 600, quantity: 1 },
    ],
  },
  {
    id: '3',
    vehicleName: 'Toyota Crysta',
    plateNumber: 'MP09-GP4567',
    orderId: 'ET/ORD/24-25/01244',
    placedDate: '1 dec 2025',
    deliveryDate: '12 dec 2025',
    totalAmount: 2750.50,
    status: 'delivered',
    orderedParts: [
      { id: '1', name: 'Brake Pad Set (Front)', brand: 'Bosch OEM', price: 500, quantity: 2 },
      { id: '2', name: 'Oil Filter (Synthetic)', brand: 'Aftra Modval', price: 1650.50, quantity: 4 },
      { id: '3', name: 'Wiper Blade - Driver Side', brand: 'Bosch OEM', price: 600, quantity: 1 },
    ],
  },
];

// Mock data for Quotes
const mockVehicleQuotes: Quote[] = [
  {
    id: 'quote-v1',
    vehicleName: 'Toyota Crysta',
    plateNumber: 'MP09-GP4567',
    quoteId: 'ET/QUOTE/24-25/01255',
    submittedDate: '5 dec 2025',
    status: 'pending_review',
    estimatedTotal: 920.82,
    items: [
      {
        id: 'vqi-1',
        itemName: 'Brake Pad Set (Front)',
        brand: 'OEM',
        mrp: 750.50,
        price: 500.00,
        quantity: 2,
        isAvailable: true,
      },
      {
        id: 'vqi-2',
        itemName: 'Wiper Blade',
        brand: 'OEM',
        mrp: 1200.70,
        price: 899.00,
        quantity: 2,
        isAvailable: true,
      },
      {
        id: 'vqi-3',
        itemName: 'Brake Pad Set (Rear)',
        brand: 'OEM',
        price: 0,
        quantity: 2,
        isAvailable: false,
      },
      {
        id: 'vqi-4',
        itemName: 'Wiper Blade - Driver side',
        brand: 'OEM',
        price: 0,
        quantity: 2,
        isAvailable: false,
      },
    ],
  },
  {
    id: 'quote-v2',
    vehicleName: 'Toyota Crysta',
    plateNumber: 'MP09-GP4567',
    quoteId: 'ET/QUOTE/24-25/01256',
    submittedDate: '3 dec 2025',
    status: 'accepted',
    estimatedTotal: 1520.50,
    items: [
      {
        id: 'vqi-5',
        itemName: 'Oil Filter (Synthetic)',
        brand: 'Aftra Modval',
        mrp: 1800.00,
        price: 1520.50,
        quantity: 4,
        isAvailable: true,
      },
    ],
  },
  {
    id: 'quote-v3',
    vehicleName: 'Toyota Crysta',
    plateNumber: 'MP09-GP4567',
    quoteId: 'ET/QUOTE/24-25/01257',
    submittedDate: '1 dec 2025',
    status: 'pending_review',
    estimatedTotal: 2350.00,
    items: [
      {
        id: 'vqi-6',
        itemName: 'AC Compressor',
        brand: 'Denso',
        mrp: 2800.00,
        price: 2350.00,
        quantity: 1,
        isAvailable: true,
      },
      {
        id: 'vqi-7',
        itemName: 'AC Condenser',
        brand: 'Denso',
        price: 0,
        quantity: 1,
        isAvailable: false,
      },
    ],
  },
];

// Mock vehicle data - same as in vehicles page
const vehicleData: { [key: string]: any } = {
  '1': {
    id: '1',
    plateNumber: 'MP O9 CY 1321',
    year: 2018,
    make: 'Toyota',
    model: 'Crysta',
    specs: '2.4L ZX MT/Diesel',
    services: ['General Service', 'Headlight Change'],
    additionalServices: 2,
    status: 'Active',
    basicInfo: {
      makeYear: 'Mar 2025',
      regYear: 'Mar 2025',
      chassisNo: 'JNKCV54E06M721114',
      fuel: 'Petrol (BSVI)',
      transmission: 'Manual',
      variant: 'ZX',
      ownerName: 'Mr. Dev Patel',
      contactNumber: '+91-78692 82962',
      odometerReading: '40,000Km',
    },
    observations: 'Audible squealing when braked applied',
    jobs: [
      {
        id: 'job-1',
        title: 'Brake System',
        assignedTo: 'Rizwan',
        date: '11 Dec 2025',
        issue: 'Issue with brake pad',
        images: 2,
        videos: 1,
        additionalMedia: 2,
      },
    ],
    inquiries: [
      {
        id: 'ET/SALES/24-25/01255',
        vehicleName: 'Toyota Crysta',
        numberPlate: 'MP09-GP4567',
        placedDate: '5 dec 2025',
        status: 'open' as const,
        inquiryBy: 'Sohan',
        jobCategory: 'Brake Parts',
        items: [
          { id: 'item-1', itemName: 'Brake Pad Set (Front)', preferredBrand: 'OEM', notes: 'TVS bike', quantity: 2 },
          { id: 'item-2', itemName: 'Oil Filter (Synthetic)', preferredBrand: 'OEM', notes: 'TVS bike', quantity: 2 },
          { id: 'item-3', itemName: 'Wiper Blade', preferredBrand: 'OEM', notes: 'TVS bike', quantity: 2 },
          { id: 'item-4', itemName: 'Air Filter', preferredBrand: 'OEM', notes: 'TVS bike', quantity: 1 },
          { id: 'item-5', itemName: 'Spark Plug', preferredBrand: 'NGK', notes: 'Iridium', quantity: 4 },
          { id: 'item-6', itemName: 'Brake Disc (Front)', preferredBrand: 'Brembo', notes: 'High performance', quantity: 2 },
          { id: 'item-7', itemName: 'Clutch Plate', preferredBrand: 'Valeo', notes: 'Standard', quantity: 1 },
          { id: 'item-8', itemName: 'Timing Belt', preferredBrand: 'Gates', notes: 'Reinforced', quantity: 1 },
          { id: 'item-9', itemName: 'Water Pump', preferredBrand: 'OEM', notes: 'With gasket', quantity: 1 },
          { id: 'item-10', itemName: 'Thermostat', preferredBrand: 'OEM', notes: 'Standard temp', quantity: 1 },
        ],
        media: [],
      },
      {
        id: 'ET/SALES/24-25/01256',
        vehicleName: 'Toyota Crysta',
        numberPlate: 'MP09-GP4567',
        placedDate: '3 dec 2025',
        declinedDate: '5 dec 2025',
        status: 'declined' as const,
        inquiryBy: 'Sohan',
        jobCategory: 'Brake Parts',
        items: [
          { id: 'item-11', itemName: 'Brake Pad Set (Front)', preferredBrand: 'OEM', notes: 'TVS bike', quantity: 2 },
          { id: 'item-12', itemName: 'Oil Filter (Synthetic)', preferredBrand: 'OEM', notes: 'TVS bike', quantity: 2 },
          { id: 'item-13', itemName: 'Wiper Blade', preferredBrand: 'OEM', notes: 'TVS bike', quantity: 2 },
          { id: 'item-14', itemName: 'Brake Disc (Rear)', preferredBrand: 'After Market', notes: 'Economy', quantity: 2 },
          { id: 'item-15', itemName: 'Brake Fluid', preferredBrand: 'Castrol', notes: 'DOT 4', quantity: 1 },
          { id: 'item-16', itemName: 'Wheel Bearing', preferredBrand: 'SKF', notes: 'Front left', quantity: 1 },
          { id: 'item-17', itemName: 'CV Joint', preferredBrand: 'OEM', notes: 'With boot', quantity: 1 },
          { id: 'item-18', itemName: 'Tie Rod End', preferredBrand: 'Moog', notes: 'Outer', quantity: 2 },
          { id: 'item-19', itemName: 'Ball Joint', preferredBrand: 'OEM', notes: 'Lower', quantity: 2 },
          { id: 'item-20', itemName: 'Shock Absorber', preferredBrand: 'Monroe', notes: 'Front pair', quantity: 2 },
        ],
        media: [],
      },
      {
        id: 'ET/SALES/24-25/01257',
        vehicleName: 'Toyota Crysta',
        numberPlate: 'MP09-GP4567',
        placedDate: '5 dec 2025',
        status: 'open' as const,
        inquiryBy: 'Sohan',
        jobCategory: 'Engine Parts',
        items: [
          { id: 'item-21', itemName: 'Brake Pad Set (Front)', preferredBrand: 'OEM', notes: 'TVS bike', quantity: 2 },
          { id: 'item-22', itemName: 'Oil Filter (Synthetic)', preferredBrand: 'OEM', notes: 'TVS bike', quantity: 2 },
          { id: 'item-23', itemName: 'Wiper Blade', preferredBrand: 'OEM', notes: 'TVS bike', quantity: 2 },
          { id: 'item-24', itemName: 'Engine Oil', preferredBrand: 'Castrol', notes: '5W-30 Synthetic', quantity: 5 },
          { id: 'item-25', itemName: 'Oil Drain Plug', preferredBrand: 'OEM', notes: 'With gasket', quantity: 1 },
          { id: 'item-26', itemName: 'Fuel Filter', preferredBrand: 'Bosch', notes: 'Diesel', quantity: 1 },
          { id: 'item-27', itemName: 'Cabin Filter', preferredBrand: 'Mann', notes: 'Carbon activated', quantity: 1 },
          { id: 'item-28', itemName: 'Drive Belt', preferredBrand: 'Gates', notes: 'Serpentine', quantity: 1 },
          { id: 'item-29', itemName: 'Tensioner', preferredBrand: 'INA', notes: 'Complete assembly', quantity: 1 },
          { id: 'item-30', itemName: 'Idler Pulley', preferredBrand: 'OEM', notes: 'Standard', quantity: 1 },
        ],
        media: [],
      },
      {
        id: 'ET/SALES/24-25/01258',
        vehicleName: 'Toyota Crysta',
        numberPlate: 'MP09-GP4567',
        placedDate: '1 dec 2025',
        closedDate: '5 dec 2025',
        status: 'closed' as const,
        inquiryBy: 'Sohan',
        jobCategory: 'Brake Parts',
        items: [
          { id: 'item-31', itemName: 'Brake Pad Set (Front)', preferredBrand: 'OEM', notes: 'Installed', quantity: 2 },
          { id: 'item-32', itemName: 'Brake Disc (Front)', preferredBrand: 'OEM', notes: 'Installed', quantity: 2 },
        ],
        media: [],
      },
    ],
    disputes: [
      {
        id: 'ET/DISP/24-25/01255',
        vehicleName: 'Toyota Crysta',
        plateNumber: 'MP09-GP4567',
        receivedDate: '5 dec 2025',
        status: 'open' as const,
        disputeRaised: 'Broken Oil Filter',
        action: 'edit' as const,
        showVehicleInfo: true,
      },
      {
        id: 'ET/DISP/24-25/01256',
        vehicleName: 'Toyota Crysta',
        plateNumber: 'MP09-GP4567',
        receivedDate: '5 dec 2025',
        status: 'declined' as const,
        disputeRaised: 'Broken Oil Filter',
        showVehicleInfo: true,
      },
      {
        id: 'ET/DISP/24-25/01257',
        vehicleName: 'Toyota Crysta',
        plateNumber: 'MP09-GP4567',
        receivedDate: '5 dec 2025',
        status: 'open' as const,
        disputeRaised: 'Broken Oil Filter',
        action: 'accept' as const,
        showVehicleInfo: true,
      },
      {
        id: 'ET/DISP/24-25/01258',
        vehicleName: 'Toyota Crysta',
        plateNumber: 'MP09-GP4567',
        openedDate: '5 dec 2025',
        status: 'open' as const,
        disputeRaised: 'Broken Oil Filter',
        resolutionStatus: 'Refund initiated',
        action: 'chat' as const,
        newNotifications: 3,
        newMessages: 2,
        showVehicleInfo: true,
        media: [
          { id: 'med-1', type: 'image' as const, url: '/placeholder.jpg' },
          { id: 'med-2', type: 'image' as const, url: '/placeholder.jpg' },
          { id: 'med-3', type: 'image' as const, url: '/placeholder.jpg' },
          { id: 'med-4', type: 'image' as const, url: '/placeholder.jpg' },
          { id: 'med-5', type: 'image' as const, url: '/placeholder.jpg' },
          { id: 'med-6', type: 'image' as const, url: '/placeholder.jpg' },
          { id: 'med-7', type: 'audio' as const, url: '/audio.mp3', duration: 5 },
        ],
      },
      {
        id: 'ET/DISP/24-25/01259',
        vehicleName: 'Toyota Crysta',
        plateNumber: 'MP09-GP4567',
        closedDate: '5 dec 2025',
        status: 'closed' as const,
        disputeRaised: 'Broken Oil Filter',
        resolutionStatus: 'Oil filter replaced',
        showVehicleInfo: true,
      },
    ],
  },
  '2': {
    id: '2',
    plateNumber: 'MH 12 AB 5678',
    year: 2020,
    make: 'Tata',
    model: 'Nexon',
    specs: '1.5L XZ+ AT/Petrol',
    services: ['Brake System', 'Engine Service'],
    additionalServices: 1,
    status: 'Active',
    basicInfo: {
      makeYear: 'Jan 2020',
      regYear: 'Feb 2020',
      chassisNo: 'MA1TA2MK0J6B12345',
      fuel: 'Petrol (BSVI)',
      transmission: 'Automatic',
      variant: 'XZ+',
      ownerName: 'Mr. Rajesh Kumar',
      contactNumber: '+91-98765 43210',
      odometerReading: '25,000Km',
    },
    observations: 'Engine making unusual noise during startup',
    jobs: [
      {
        id: 'job-2',
        title: 'Engine Service',
        assignedTo: 'Amit',
        date: '15 Dec 2025',
        issue: 'Oil change and filter replacement needed',
        images: 3,
        videos: 0,
        additionalMedia: 1,
      },
    ],
    inquiries: [
      {
        id: 'ET/SALES/24-25/01300',
        vehicleName: 'Tata Nexon',
        numberPlate: 'MH 12 AB 5678',
        placedDate: '10 dec 2025',
        status: 'requested' as const,
        inquiryBy: 'Rajesh',
        jobCategory: 'Engine Service',
        items: [
          {
            id: 'item-6',
            itemName: 'Oil Filter',
            preferredBrand: 'Mann Filter',
            notes: 'High efficiency filter required',
            quantity: 1,
          },
          {
            id: 'item-7',
            itemName: 'Engine Oil',
            preferredBrand: 'Castrol',
            notes: '5W-30 grade synthetic',
            quantity: 4,
          },
        ],
        media: [
          { id: 'm12', type: 'image' as const, url: '/placeholder.jpg' },
        ],
      },
    ],
    disputes: [
      {
        id: 'ET/DISP/24-25/01350',
        vehicleName: 'Tata Nexon',
        plateNumber: 'MH 12 AB 5678',
        receivedDate: '12 dec 2025',
        status: 'open' as const,
        disputeRaised: 'Engine Service Overcharge',
        action: 'accept' as const,
        showVehicleInfo: true,
      },
      {
        id: 'ET/DISP/24-25/01351',
        vehicleName: 'Tata Nexon',
        plateNumber: 'MH 12 AB 5678',
        closedDate: '10 dec 2025',
        status: 'closed' as const,
        disputeRaised: 'Air Filter Quality Issue',
        resolutionStatus: 'Replacement provided',
        showVehicleInfo: true,
      },
    ],
  },
   '3': {
    id: '2',
    plateNumber: 'MH 12 AB 5678',
    year: 2020,
    make: 'Tata',
    model: 'Nexon',
    specs: '1.5L XZ+ AT/Petrol',
    services: ['Brake System', 'Engine Service'],
    additionalServices: 1,
    status: 'Active',
    basicInfo: {
      makeYear: 'Jan 2020',
      regYear: 'Feb 2020',
      chassisNo: 'MA1TA2MK0J6B12345',
      fuel: 'Petrol (BSVI)',
      transmission: 'Automatic',
      variant: 'XZ+',
      ownerName: 'Mr. Rajesh Kumar',
      contactNumber: '+91-98765 43210',
      odometerReading: '25,000Km',
    },
    observations: 'Engine making unusual noise during startup',
    jobs: [
      {
        id: 'job-2',
        title: 'Engine Service',
        assignedTo: 'Amit',
        date: '15 Dec 2025',
        issue: 'Oil change and filter replacement needed',
        images: 3,
        videos: 0,
        additionalMedia: 1,
      },
    ],
    inquiries: [
      {
        id: 'ET/SALES/24-25/01300',
        vehicleName: 'Tata Nexon',
        numberPlate: 'MH 12 AB 5678',
        placedDate: '10 dec 2025',
        status: 'requested' as const,
        inquiryBy: 'Rajesh',
        jobCategory: 'Engine Service',
        items: [
          {
            id: 'item-6',
            itemName: 'Oil Filter',
            preferredBrand: 'Mann Filter',
            notes: 'High efficiency filter required',
            quantity: 1,
          },
          {
            id: 'item-7',
            itemName: 'Engine Oil',
            preferredBrand: 'Castrol',
            notes: '5W-30 grade synthetic',
            quantity: 4,
          },
        ],
        media: [
          { id: 'm12', type: 'image' as const, url: '/placeholder.jpg' },
        ],
      },
    ],
    disputes: [
      {
        id: 'ET/DISP/24-25/01350',
        vehicleName: 'Tata Nexon',
        plateNumber: 'MH 12 AB 5678',
        receivedDate: '12 dec 2025',
        status: 'open' as const,
        disputeRaised: 'Engine Service Overcharge',
        action: 'accept' as const,
        showVehicleInfo: true,
      },
      {
        id: 'ET/DISP/24-25/01351',
        vehicleName: 'Tata Nexon',
        plateNumber: 'MH 12 AB 5678',
        closedDate: '10 dec 2025',
        status: 'closed' as const,
        disputeRaised: 'Air Filter Quality Issue',
        resolutionStatus: 'Replacement provided',
        showVehicleInfo: true,
      },
    ],
  },
   '4': {
    id: '2',
    plateNumber: 'MH 12 AB 5678',
    year: 2020,
    make: 'Tata',
    model: 'Nexon',
    specs: '1.5L XZ+ AT/Petrol',
    services: ['Brake System', 'Engine Service'],
    additionalServices: 1,
    status: 'Active',
    basicInfo: {
      makeYear: 'Jan 2020',
      regYear: 'Feb 2020',
      chassisNo: 'MA1TA2MK0J6B12345',
      fuel: 'Petrol (BSVI)',
      transmission: 'Automatic',
      variant: 'XZ+',
      ownerName: 'Mr. Rajesh Kumar',
      contactNumber: '+91-98765 43210',
      odometerReading: '25,000Km',
    },
    observations: 'Engine making unusual noise during startup',
    jobs: [
      {
        id: 'job-2',
        title: 'Engine Service',
        assignedTo: 'Amit',
        date: '15 Dec 2025',
        issue: 'Oil change and filter replacement needed',
        images: 3,
        videos: 0,
        additionalMedia: 1,
      },
    ],
    inquiries: [
      {
        id: 'ET/SALES/24-25/01300',
        vehicleName: 'Tata Nexon',
        numberPlate: 'MH 12 AB 5678',
        placedDate: '10 dec 2025',
        status: 'requested' as const,
        inquiryBy: 'Rajesh',
        jobCategory: 'Engine Service',
        items: [
          {
            id: 'item-6',
            itemName: 'Oil Filter',
            preferredBrand: 'Mann Filter',
            notes: 'High efficiency filter required',
            quantity: 1,
          },
          {
            id: 'item-7',
            itemName: 'Engine Oil',
            preferredBrand: 'Castrol',
            notes: '5W-30 grade synthetic',
            quantity: 4,
          },
        ],
        media: [
          { id: 'm12', type: 'image' as const, url: '/placeholder.jpg' },
        ],
      },
    ],
    disputes: [
      {
        id: 'ET/DISP/24-25/01350',
        vehicleName: 'Tata Nexon',
        plateNumber: 'MH 12 AB 5678',
        receivedDate: '12 dec 2025',
        status: 'open' as const,
        disputeRaised: 'Engine Service Overcharge',
        action: 'accept' as const,
        showVehicleInfo: true,
      },
      {
        id: 'ET/DISP/24-25/01351',
        vehicleName: 'Tata Nexon',
        plateNumber: 'MH 12 AB 5678',
        closedDate: '10 dec 2025',
        status: 'closed' as const,
        disputeRaised: 'Air Filter Quality Issue',
        resolutionStatus: 'Replacement provided',
        showVehicleInfo: true,
      },
    ],
  },
};

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const vehicleId = params.id as string;
  
  // Use mock data if available, otherwise use a default structure
  // This allows the page to work with both mock IDs (1,2,3,4) and real database IDs
  const vehicle = vehicleData[vehicleId] || {
    id: vehicleId,
    plateNumber: '',
    year: 2020,
    make: '',
    model: '',
    specs: '',
    services: [],
    additionalServices: 0,
    status: 'Active',
    basicInfo: {
      makeYear: '',
      regYear: '',
      chassisNo: '',
      fuel: '',
      transmission: '',
      variant: '',
      ownerName: '',
      contactNumber: '',
      odometerReading: '',
    },
    observations: '',
    jobs: [],
    inquiries: [],
    disputes: [],
  };

  const [activeTab, setActiveTab] = useState<'jobcard' | 'inquiry' | 'disputes' | 'quotes' | 'orders'>('jobcard');
  const [expandedSections, setExpandedSections] = useState<{
    basicInfo: boolean;
    observations: boolean;
    jobs: boolean;
  }>({
    basicInfo: false,
    observations: false,
    jobs: true, // Jobs expanded by default
  });
  const [expandedInquiries, setExpandedInquiries] = useState<{
    [key: string]: boolean;
  }>({});
  const [showRaiseDisputeOverlay, setShowRaiseDisputeOverlay] = useState(false);
  const [showRequestPartOverlay, setShowRequestPartOverlay] = useState(false);
  const [showEstimationOverlay, setShowEstimationOverlay] = useState(false);
  const [showNewJobCardOverlay, setShowNewJobCardOverlay] = useState(false);
  const [showGateOutOverlay, setShowGateOutOverlay] = useState(false);
  const [expandedQuotes, setExpandedQuotes] = useState<{ [key: string]: boolean }>({});

  // State for real API data
  const [realVehicleData, setRealVehicleData] = useState<VehicleResponse | null>(null);
  const [jobCards, setJobCards] = useState<JobCardResponse[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  
  const [loading, setLoading] = useState(true);

  // Fetch real vehicle data from API
  useEffect(() => {  
    async function fetchVehicleData() {
      try {
        setLoading(true);
        const result = await getVehicleById(parseInt(vehicleId));
        console.log(result.data);
        
        if (result.success && result.data) {
          setRealVehicleData(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch vehicle data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (vehicleId) {
      fetchVehicleData();
    }
  }, [vehicleId]);

  // Fetch job cards for this vehicle
  useEffect(() => {
    async function fetchJobCards() {
      try {
        setLoadingJobs(true);
        const result = await getJobCardsByVehicle(parseInt(vehicleId));
        
        if (result.success && result.data) {
          setJobCards(result.data.jobCards);
        }
      } catch (error) {
        console.error('Failed to fetch job cards:', error);
      } finally {
        setLoadingJobs(false);
      }
    }

    if (vehicleId) {
      fetchJobCards();
    }
  }, [vehicleId]);

  // Fetch inquiries for this vehicle
  const fetchInquiries = async () => {
    try {
      setLoadingInquiries(true);
      const { getInquiriesByVehicleId } = await import('@/services/api');
      const result = await getInquiriesByVehicleId(parseInt(vehicleId));
      
      if (result.success && result.data) {
        setInquiries(result.data.inquiries);
      }
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
    } finally {
      setLoadingInquiries(false);
    }
  };

  useEffect(() => {
    if (vehicleId) {
      fetchInquiries();
    }
  }, [vehicleId]);

  // Show loading or error state
  if (loading) {
    return (
      <div className="bg-[#f5f3f4] relative min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e5383b] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (!realVehicleData) {
    return (
      <div className="bg-[#f5f3f4] relative min-h-screen w-full flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-6xl mb-4">🚗</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Vehicle Not Found</h2>
          <p className="text-gray-600 mb-6">The vehicle you're looking for doesn't exist.</p>
          <button
            onClick={() => router.back()}
            className="bg-[#e5383b] text-white px-6 py-2 rounded-lg hover:bg-[#d32f2f] transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const toggleSection = (section: 'basicInfo' | 'observations' | 'jobs') => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleInquiry = (inquiryId: string) => {
    setExpandedInquiries((prev) => ({
      ...prev,
      [inquiryId]: !prev[inquiryId],
    }));
  };

  const toggleQuote = (quoteId: string) => {
    setExpandedQuotes((prev) => ({
      ...prev,
      [quoteId]: !prev[quoteId],
    }));
  };

  return (
    <div className="bg-[#f5f3f4] relative min-h-screen w-full overflow-x-hidden">
      {/* Sidebar for desktop/tablet */}
      <Sidebar />
      
      {/* Main content area with padding for sidebar on desktop */}
      <div className="md:pl-[240px] lg:pl-[280px]">
        {/* Inner container for mobile centering */}
        <div className="max-w-[440px] md:max-w-none mx-auto md:mx-0 bg-white md:bg-[#f5f3f4]">
          
          {/* Header - only on mobile */}
          <div className="md:hidden sticky top-0 w-full bg-white h-[55px] z-50 shadow-sm">
            {/* Status Bar */}
            <div className="h-[15px] bg-white" />
            {/* Navigation Bar */}
            <div className="h-[24px] flex items-start justify-between px-[16px]">
              <button
                onClick={() => router.back()}
                className="w-[24px] h-[24px] flex items-center justify-center"
              >
                <Image
                src="/assets/icons/arrow-back.svg"
                alt="Back"
                width={24}
                height={24}
                />
              </button>

              <h1 className="font-semibold text-[19px] text-[#E5383B] tracking-[-0.64px]">
                Vehicle Details
              </h1>

              <button className="w-[24px] h-[24px] flex items-center justify-center">
                <Image
                  src="/assets/icons/search.svg"
                  alt="Search"
                  width={24}
                  height={24}
                />
              </button>
            </div>
          </div>

          {/* Main Content */}
        <div className="pt-[0px] pb-[117px] md:pb-[24px] px-[16px] md:px-[24px] lg:px-[32px] bg-[#f5f3f4]">
        <div className="flex flex-col gap-[16px] w-full py-[16px]">
          {/* Vehicle Card */}
          <VehicleCard
            plateNumber={realVehicleData?.plateNumber as string}
            year={realVehicleData?.year as number}
            make={realVehicleData?.brand as string}
            model={realVehicleData?.model as string}
            specs={realVehicleData?.specs as string}
            services={vehicle.services}
            additionalServices={vehicle.additionalServices}
          />

          {/* Tab Navigation */}
          <div className="flex items-center bg-[#e5e5e5]">
            <button
              onClick={() => setActiveTab('jobcard')}
              className={`flex-1 h-[36px] rounded-l-[7px] font-medium text-[13px] transition-colors ${
                activeTab === 'jobcard'
                  ? 'bg-[#e5383b] text-white rounded-[7px]'
                  : 'bg-[#e5e5e5] text-[#525252]'
              }`}
            >
              Job card
            </button>
            <button
              onClick={() => setActiveTab('quotes')}
              className={`flex-1 h-[36px] font-medium text-[13px] transition-colors ${
                activeTab === 'quotes'
                  ? 'bg-[#e5383b] text-white rounded-[7px]'
                  : 'bg-[#e5e5e5] text-[#525252]'
              }`}
            >
              Quotes
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 h-[36px] font-medium text-[13px] transition-colors ${
                activeTab === 'orders'
                  ? 'bg-[#e5383b] text-white rounded-[7px]'
                  : 'bg-[#e5e5e5] text-[#525252]'
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab('inquiry')}
              className={`flex-1 h-[36px] font-medium text-[13px] transition-colors ${
                activeTab === 'inquiry'
                  ? 'bg-[#e5383b] text-white rounded-[7px]'
                  : 'bg-[#e5e5e5] text-[#525252]'
              }`}
            >
              Inquiry
            </button>
            <button
              onClick={() => setActiveTab('disputes')}
              className={`flex-1 h-[36px] rounded-r-[7px] font-medium text-[13px] transition-colors ${
                activeTab === 'disputes'
                  ? 'bg-[#e5383b] text-white rounded-[7px]'
                  : 'bg-[#e5e5e5] text-[#525252]'
              }`}
            >
              Disputes
            </button>
          </div>

          {/* Expandable Sections - Only show for Job card tab */}
          {activeTab === 'jobcard' && (
            <div className="flex flex-col gap-[12px]">
              {/* Basic Info Accordion */}
              <div className="bg-white rounded-[12px] overflow-hidden">
                <button
                  onClick={() => toggleSection('basicInfo')}
                  className="w-full px-[16px] py-[14px] flex items-center justify-between"
                >
                  <span className="font-semibold text-[15px] text-[#2b2b2b]">
                    Basic Info
                  </span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transition-transform ${
                      expandedSections.basicInfo ? 'rotate-180' : ''
                    }`}
                  >
                    <path
                      d="M5 7.5l5 5 5-5"
                      stroke="#2b2b2b"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {expandedSections.basicInfo && (
                  <div className="px-[16px] pb-[16px] border-t border-[#e5e5e5]">
                    <div className="grid grid-cols-3 gap-[16px] pt-[16px]">
                      <div>
                        <p className="text-[10px] text-[#99a2b6] mb-[4px]">Make Year</p>
                        <p className="text-[12px] text-[#2b2b2b] font-medium">
                          {vehicle.basicInfo.makeYear}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#99a2b6] mb-[4px]">Reg. Year</p>
                        <p className="text-[12px] text-[#2b2b2b] font-medium">
                          {vehicle.basicInfo.regYear}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#99a2b6] mb-[4px]">Chassis No.</p>
                        <p className="text-[12px] text-[#2b2b2b] font-medium">
                          {realVehicleData?.chassisNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#99a2b6] mb-[4px]">Fuel</p>
                        <p className="text-[12px] text-[#2b2b2b] font-medium">
                          {vehicle.basicInfo.fuel}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#99a2b6] mb-[4px]">Transmission</p>
                        <p className="text-[12px] text-[#2b2b2b] font-medium">
                          {vehicle.basicInfo.transmission}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#99a2b6] mb-[4px]">Variant</p>
                        <p className="text-[12px] text-[#2b2b2b] font-medium">
                          {realVehicleData?.specs}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#99a2b6] mb-[4px]">Owner Name</p>
                        <p className="text-[12px] text-[#2b2b2b] font-medium">
                          {realVehicleData?.ownerName}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#99a2b6] mb-[4px]">Contact Number</p>
                        <p className="text-[12px] text-[#2b2b2b] font-medium">
                          {realVehicleData?.contactNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#99a2b6] mb-[4px]">Odometer</p>
                        <p className="text-[12px] text-[#2b2b2b] font-medium">
                          {realVehicleData?.odometerReading}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Observations Accordion */}
              <div className="bg-white rounded-[12px] overflow-hidden">
                <button
                  onClick={() => toggleSection('observations')}
                  className="w-full px-[16px] py-[14px] flex items-center justify-between"
                >
                  <span className="font-semibold text-[15px] text-[#2b2b2b]">
                    Problems Shared
                  </span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transition-transform ${
                      expandedSections.observations ? 'rotate-180' : ''
                    }`}
                  >
                    <path
                      d="M5 7.5l5 5 5-5"
                      stroke="#2b2b2b"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {expandedSections.observations && (
                  <div className="px-[16px] pb-[16px] border-t border-[#e5e5e5]">
                    <p className="text-[13px] text-[#525252] pt-[16px]">
                      {vehicle.observations}
                    </p>
                  </div>
                )}
              </div>

              {/* Jobs Accordion */}
              <div className="bg-white rounded-[12px] overflow-hidden">
                <button
                  onClick={() => toggleSection('jobs')}
                  className="w-full px-[16px] py-[14px] flex items-center justify-between"
                >
                  <span className="font-semibold text-[15px] text-[#2b2b2b]">
                    Jobs
                  </span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transition-transform ${
                      expandedSections.jobs ? 'rotate-180' : ''
                    }`}
                  >
                    <path
                      d="M5 7.5l5 5 5-5"
                      stroke="#2b2b2b"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {expandedSections.jobs && (
                  <div className="px-[16px] pb-[16px] border-t border-[#e5e5e5] pt-[16px]">
                    {loadingJobs ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e5383b] mx-auto"></div>
                        <p className="text-[12px] text-[#99a2b6] mt-2">Loading jobs...</p>
                      </div>
                    ) : jobCards.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-[14px] text-[#99a2b6]">No jobs found</p>
                        <p className="text-[12px] text-[#99a2b6] mt-1">Create a new job card to get started</p>
                      </div>
                    ) : (
                      <div className="space-y-[12px]">
                        {jobCards.map((job) => (
                          <JobCard
                            key={job.id}
                            id={job.id}
                            jobCategory={job.jobCategory}
                            assignedStaffName={job.assignedStaffName}
                            remark={job.remark}
                            audioUrl={job.audioUrl}
                            images={job.images}
                            videos={job.videos}
                            createdAt={job.createdAt}
                            status={job.status}
                            onClick={() => console.log('Job card clicked:', job.id)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}


          {/* Orders Tab Content */}
          {activeTab === 'orders' && (
            <div className="rounded-[12px] ">
              <div className='space-y-4'>
                {mockOrders.map((order: Order) => (
                  <OrderCard key={order.id} 
                   order={order}
                   defaultExpanded={false}
                   onTrackOrder={(orderId: string) => console.log('Track order:', orderId)}
                   onDownloadInvoice={(orderId: string) => console.log('Download invoice:', orderId)} 
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quotes Tab Content */}
          {activeTab === 'quotes' && (
            <div className="flex flex-col gap-[12px]">
              {mockVehicleQuotes.length > 0 ? (
                mockVehicleQuotes.map((quote: Quote) => (
                  <QuoteCard
                    key={quote.id}
                    quote={quote}
                    isExpanded={expandedQuotes[quote.id] || false}
                    onToggle={() => toggleQuote(quote.id)}
                    showNumberPlate={false}
                    onAccept={(id) => console.log('Accept quote:', id)}
                    onView={(id) => console.log('View quote:', id)}
                  />
                ))
              ) : (
                <div className="bg-white rounded-[12px] p-[16px]">
                  <p className="text-[14px] text-[#99a2b6] text-center">
                    No quotes found for this vehicle
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Inquiry Tab Content */}
          {activeTab === 'inquiry' && (
            <div className="flex flex-col gap-[12px]">
              {loadingInquiries ? (
                <div className="bg-white rounded-[12px] p-[16px]">
                  <p className="text-[14px] text-[#99a2b6] text-center">
                    Loading inquiries...
                  </p>
                </div>
              ) : inquiries && inquiries.length > 0 ? (
                inquiries.map((inquiry: any) => (
                  <InquiryCard
                    key={inquiry.id}
                    inquiry={{
                      id: inquiry.inquiryNumber,
                      vehicleName: inquiry.vehicleName || `${realVehicleData?.brand} ${realVehicleData?.model}`,
                      numberPlate: inquiry.numberPlate || realVehicleData?.plateNumber,
                      placedDate: new Date(inquiry.placedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toLowerCase(),
                      closedDate: inquiry.closedDate ? new Date(inquiry.closedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toLowerCase() : undefined,
                      status: inquiry.status as 'open' | 'closed' | 'approved' | 'requested' | 'declined',
                      inquiryBy: inquiry.requestedByName || 'Owner',
                      jobCategory: inquiry.jobCategory,
                      items: inquiry.items.map((item: any) => ({
                        id: item.id.toString(),
                        itemName: item.partName,
                        preferredBrand: item.preferredBrand,
                        notes: item.remark,
                        quantity: item.quantity
                      })),
                      media: inquiry.items.flatMap((item: any) => 
                        [item.audioUrl, item.image1Url, item.image2Url, item.image3Url].filter(Boolean)
                      )
                    }}
                    isExpanded={expandedInquiries[inquiry.inquiryNumber] || false}
                    onToggle={() => toggleInquiry(inquiry.inquiryNumber)}
                    onEdit={(id) => console.log('Edit inquiry:', id)}
                    onView={(id) => console.log('View inquiry:', id)}
                    onReRequest={(id) => console.log('Re-request inquiry:', id)}
                    onApprove={(id) => console.log('Approve inquiry:', id)}
                    action={inquiry.status === 'closed' ? 'none' : 'edit'}
                  />
                ))
              ) : (
                <div className="bg-white rounded-[12px] p-[16px]">
                  <p className="text-[14px] text-[#99a2b6] text-center">
                    No inquiries found for this vehicle
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Disputes Tab Content */}
          {activeTab === 'disputes' && (
            <div className="flex flex-col gap-[12px]">
              {vehicle.disputes && vehicle.disputes.length > 0 ? (
                vehicle.disputes.map((dispute: Dispute) => (
                  <DisputeCard
                    key={dispute.id}
                    dispute={dispute}
                    onEdit={(id) => console.log('Edit dispute:', id)}
                    onAccept={(id) => console.log('Accept dispute:', id)}
                    onView={(id) => console.log('View dispute details:', id)}
                    onChat={(id) => console.log('Open chat for dispute:', id)}
                  />
                ))
              ) : (
                <div className="bg-white rounded-[12px] p-[16px]">
                  <p className="text-[14px] text-[#99a2b6] text-center">
                    No disputes found for this vehicle
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton
        navigationOptions={[
          {
            label: 'Gate out',
            onClick: () => setShowGateOutOverlay(true),
          },
         {
            label: 'Generate Estimate',
            onClick: () => setShowEstimationOverlay(true),
          },
          {
            label: 'Create New Job',
            onClick: () => setShowNewJobCardOverlay(true),
          },
          {
            label: 'Raise Dispute',
            onClick: () => setShowRaiseDisputeOverlay(true),
          },
          {
            label: 'Request Part',
            onClick: () => setShowRequestPartOverlay(true),
          },
          
        ]}
      />

      {/* Raise Dispute Overlay */}
      <RaiseDisputeOverlay
        isOpen={showRaiseDisputeOverlay}
        onClose={() => setShowRaiseDisputeOverlay(false)}
        onConfirm={(data) => {
          console.log('Dispute submitted:', data);
          // setShowRaiseDisputeOverlay(false);
        }}
        onChatWithUs={() => console.log('Open chat')}
        orderSuggestions={orderSuggestions}
        parts={partsOptions}
        reasons={reasonsOptions}
        vehicleInfo={{
          year: vehicle.year,
          make: vehicle.make,
          model: vehicle.model,
          specs: vehicle.specs,
          plateNumber: vehicle.plateNumber,
        }}
        buttonText="SEND REQUEST"
      />

      {/* Request Part Overlay */}
      <RequestPartOverlay
        isOpen={showRequestPartOverlay}
        onClose={() => setShowRequestPartOverlay(false)}
        onSubmitPartNumber={(partNumber) => {
          console.log('Part number submitted:', partNumber);
          // Form will be shown automatically by the overlay
        }}
        onScanPart={() => {
          console.log('Open scanner');
          // Would typically open camera/scanner here
        }}
        onRequestManually={() => {
          console.log('Request part manually');
          // Form will be shown automatically by the overlay
        }}
        onSendRequest={(data) => {
          console.log('Part request submitted:', data);
          setShowRequestPartOverlay(false);
        }}
        onAddAnotherRequest={() => {
          console.log('Adding another request');
        }}
        onInquiryCreated={() => {
          // Refresh inquiries list after creating a new one
          fetchInquiries();
        }}
        vehicleId={parseInt(vehicleId)}
      />

      {/* Estimation Overlay */}
      <EstimationOverlay
        isOpen={showEstimationOverlay}
        onClose={() => setShowEstimationOverlay(false)}
        onReviewEstimate={(data) => {
          console.log('Estimation data:', data);
          // Don't close - let the overlay handle navigation to review view
        }}
        onGeneratePDF={(data) => {
          console.log('Generate PDF with data:', data);
          // setShowEstimationOverlay(false);
        }}
        vehicleInfo={{
          plateNumber: vehicle.plateNumber,
          year: vehicle.year,
          make: vehicle.make,
          model: vehicle.model,
          specs: vehicle.specs,
        }}
      />

      {/* New Job Card Overlay */}
      <NewJobCardOverlay
        isOpen={showNewJobCardOverlay}
        onClose={() => setShowNewJobCardOverlay(false)}
        vehicleId={parseInt(vehicleId)}
        onAddJob={(data) => {
          console.log('New job created:', data);
          setShowNewJobCardOverlay(false);
          // Optionally refresh job cards list here
        }}
      />

      {/* Gate Out Overlay */}
      <GateOutOverlay
        isOpen={showGateOutOverlay}
        onClose={() => setShowGateOutOverlay(false)}
        onComplete={(data) => {
          console.log('Gate Out completed:', data);
          setShowGateOutOverlay(false);
          // Redirect to vehicles page after gate out
          router.push('/owner/vehicles');
        }}
        vehicleId={parseInt(vehicleId)}
        vehicleData={{
          plateNumber: realVehicleData?.plateNumber || vehicle.plateNumber,
          year: realVehicleData?.year || vehicle.year,
          make: realVehicleData?.brand || vehicle.make,
          model: realVehicleData?.model || vehicle.model,
          specs: realVehicleData?.specs || vehicle.specs,
          imageUrl: '/assets/images/car-suv.png',
        }}
      />

      {/* Navigation Bar */}
      <NavigationBar role='owner' />
        </div>
      </div>
    </div>
  );
}
