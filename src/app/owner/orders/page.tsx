'use client';

import { useState, useEffect } from 'react';
import NavigationBar from '@/components/dashboard/NavigationBar';
import Sidebar from '@/components/layout/Sidebar';
import OrderCard, { Order, OrderStatus } from '@/components/dashboard/OrderCard';
import { getOrdersByWorkshopId, getOrderById, getStoredUser } from '@/services/api';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function mapStatus(backendStatus: string): OrderStatus {
  switch (backendStatus) {
    case 'shipped':
      return 'shipped';
    case 'delivered':
      return 'delivered';
    default:
      return 'in-process';
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      setLoading(false);
      return;
    }

    getOrdersByWorkshopId(user.id).then(async (res) => {
      if (!res.success || !res.data) {
        setError(res.error ?? 'Failed to load orders.');
        setLoading(false);
        return;
      }

      // Fetch full details for all orders in parallel to get items
      const detailResults = await Promise.all(
        res.data.orders.map((o) => getOrderById(o.id))
      );

      const mapped: Order[] = res.data.orders.map((o, idx) => {
        const detail = detailResults[idx];
        const items = detail.success && detail.data ? detail.data.items : [];
        const estimatedDelivery = detail.success && detail.data?.estimatedDeliveryDate
          ? formatDate(detail.data.estimatedDeliveryDate)
          : '–';

        return {
          id: String(o.id),
          vehicleName: o.vehicleName ?? o.orderNumber,
          plateNumber: o.plateNumber ?? '',
          orderId: o.orderNumber,
          placedDate: formatDate(o.createdAt),
          deliveryDate: estimatedDelivery,
          totalAmount: o.totalAmount,
          status: mapStatus(o.status),
          orderedParts: items.map((item) => ({
            id: String(item.id),
            name: item.partName,
            brand: item.brand,
            price: item.unitPrice,
            quantity: item.quantity,
          })),
        };
      });

      setOrders(mapped);
      setLoading(false);
    });
  }, []);

  const handleDownloadInvoice = (orderId: string) => {
    console.log('Download invoice:', orderId);
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
            {loading ? (
              <div className="bg-white rounded-[12px] p-[32px] text-center">
                <p className="text-[14px] text-[#757575]">Loading orders...</p>
              </div>
            ) : error ? (
              <div className="bg-white rounded-[12px] p-[32px] text-center">
                <p className="text-[14px] text-[#e5383b]">{error}</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-[12px] p-[32px] text-center">
                <p className="text-[16px] font-medium text-[#2b2b2b] mb-[8px]">No Orders Found</p>
                <p className="text-[14px] text-[#99a2b6]">Your orders will appear here</p>
              </div>
            ) : (
              orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onDownloadInvoice={handleDownloadInvoice}
                />
              ))
            )}
          </div>

          {/* Navigation Bar */}
          <NavigationBar role='owner' />
        </div>
      </div>
    </div>
  );
}
