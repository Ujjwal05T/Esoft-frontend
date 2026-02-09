'use client';

import React, { useState } from 'react';
import NavigationBar from '@/components/dashboard/NavigationBar';
import Sidebar from '@/components/layout/Sidebar';
import OrderCard, { Order } from '@/components/dashboard/OrderCard';

// Dummy mockup data for orders
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
      {
        id: 'p1',
        name: 'Brake Pad Set (Front)',
        brand: 'Brembo OEM',
        price: 500.00,
        quantity: 2,
      },
      {
        id: 'p2',
        name: 'Oil Filter (Synthetic)',
        brand: 'Bosch After Market',
        price: 1650.50,
        quantity: 4,
      },
      {
        id: 'p3',
        name: 'Wiper Blade - Driver Side',
        brand: 'Bosch OEM',
        price: 600.00,
        quantity: 1,
      },
      {
        id: 'p4',
        name: 'Air Filter',
        brand: 'Mann Filter',
        price: 450.00,
        quantity: 1,
      },
      {
        id: 'p5',
        name: 'Spark Plugs Set',
        brand: 'NGK',
        price: 800.00,
        quantity: 4,
      },
      {
        id: 'p6',
        name: 'Coolant',
        brand: 'Castrol',
        price: 350.00,
        quantity: 2,
      },
      {
        id: 'p7',
        name: 'Brake Fluid',
        brand: 'Continental',
        price: 280.00,
        quantity: 1,
      },
    ],
  },
  {
    id: '2',
    vehicleName: 'Toyota Crysta',
    plateNumber: 'MP09-GP4567',
    orderId: 'ET/ORD/24-25/01255',
    placedDate: '5 dec 2025',
    deliveryDate: '12 dec 2025',
    totalAmount: 2750.50,
    status: 'shipped',
    orderedParts: [
      {
        id: 'p1',
        name: 'Brake Pad Set (Front)',
        brand: 'Brembo OEM',
        price: 500.00,
        quantity: 2,
      },
      {
        id: 'p2',
        name: 'Oil Filter (Synthetic)',
        brand: 'Bosch After Market',
        price: 1650.50,
        quantity: 4,
      },
      {
        id: 'p3',
        name: 'Wiper Blade - Driver Side',
        brand: 'Bosch OEM',
        price: 600.00,
        quantity: 1,
      },
    ],
  },
  {
    id: '3',
    vehicleName: 'Honda City',
    plateNumber: 'MH02-AB1234',
    orderId: 'ET/ORD/24-25/01256',
    placedDate: '3 dec 2025',
    deliveryDate: '10 dec 2025',
    totalAmount: 4500.00,
    status: 'delivered',
    orderedParts: [
      {
        id: 'p1',
        name: 'Brake Pad Set (Front)',
        brand: 'Brembo OEM',
        price: 500.00,
        quantity: 2,
      },
      {
        id: 'p2',
        name: 'Oil Filter (Synthetic)',
        brand: 'Bosch After Market',
        price: 1650.50,
        quantity: 4,
      },
      {
        id: 'p3',
        name: 'Wiper Blade - Driver Side',
        brand: 'Bosch OEM',
        price: 600.00,
        quantity: 1,
      },
      {
        id: 'p4',
        name: 'Clutch Kit',
        brand: 'Valeo',
        price: 3200.00,
        quantity: 1,
      },
      {
        id: 'p5',
        name: 'Timing Belt',
        brand: 'Gates',
        price: 1800.00,
        quantity: 1,
      },
    ],
  },
  {
    id: '4',
    vehicleName: 'Maruti Swift',
    plateNumber: 'DL08-CX9876',
    orderId: 'ET/ORD/24-25/01257',
    placedDate: '1 dec 2025',
    deliveryDate: '8 dec 2025',
    totalAmount: 1850.00,
    status: 'delivered',
    orderedParts: [
      {
        id: 'p1',
        name: 'Engine Oil 5W-30',
        brand: 'Castrol',
        price: 850.00,
        quantity: 4,
      },
      {
        id: 'p2',
        name: 'Oil Filter',
        brand: 'Bosch',
        price: 250.00,
        quantity: 1,
      },
    ],
  },
  {
    id: '5',
    vehicleName: 'Hyundai Creta',
    plateNumber: 'KA05-MN5678',
    orderId: 'ET/ORD/24-25/01258',
    placedDate: '6 dec 2025',
    deliveryDate: '13 dec 2025',
    totalAmount: 5200.00,
    status: 'in-process',
    orderedParts: [
      {
        id: 'p1',
        name: 'Suspension Kit - Front',
        brand: 'Monroe',
        price: 3500.00,
        quantity: 1,
      },
      {
        id: 'p2',
        name: 'Wheel Bearing',
        brand: 'SKF',
        price: 850.00,
        quantity: 2,
      },
      {
        id: 'p3',
        name: 'Ball Joint',
        brand: 'Moog',
        price: 450.00,
        quantity: 2,
      },
    ],
  },
];

export default function OrdersPage() {
  const [orders] = useState<Order[]>(mockOrders);

  const handleTrackOrder = (orderId: string) => {
    console.log('Track order:', orderId);
    // TODO: Navigate to order tracking page
  };

  const handleDownloadInvoice = (orderId: string) => {
    console.log('Download invoice:', orderId);
    // TODO: Trigger invoice download
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col justify-between overflow-x-hidden">
      {/* Sidebar for desktop/tablet */}
      <Sidebar />
      
      {/* Main content area with padding for sidebar on desktop */}
      <div className="md:pl-[240px] lg:pl-[280px] flex-1">
        {/* Inner container for mobile centering */}
        <div className="max-w-[500px] md:max-w-none mx-auto md:mx-0 flex-1 flex flex-col">
          
          {/* Header */}
          <div className="bg-white px-4 py-4 border-b border-[#e0e0e0]">
            <h1 
              className="text-[24px] font-bold text-[#1a1a1a]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Orders
            </h1>
            <p 
              className="text-[14px] text-[#757575] mt-1"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Track and manage your orders
            </p>
          </div>

          {/* Orders List */}
          <div className="flex-1 p-4 pb-[100px] md:pb-4 space-y-4">
            {/* No orders found message */}
            <div className="bg-white rounded-[12px] p-[32px] text-center">
              <p className="text-[16px] font-medium text-[#2b2b2b] mb-[8px]">No Orders Found</p>
              <p className="text-[14px] text-[#99a2b6]">Your orders will appear here</p>
            </div>
            {/* Keeping orders for future use - uncomment below when ready
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onTrackOrder={handleTrackOrder}
                onDownloadInvoice={handleDownloadInvoice}
              />
            ))}
            */}
          </div>

          {/* Navigation Bar */}
          <NavigationBar role='owner' />
        </div>
      </div>
    </div>
  );
}