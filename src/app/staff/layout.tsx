import React from 'react';

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Staff-specific layout wrapper */}
      {/* You can add staff role authentication checks here */}
      {children}
    </>
  );
}
