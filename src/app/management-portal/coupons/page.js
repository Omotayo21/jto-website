'use client';
export default function AdminCouponsPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Coupons Management</h1>
      <div className="bg-white p-12 text-center shadow-sm border border-gray-100 rounded-3xl mt-12 flex flex-col items-center">
         <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
           <span className="text-3xl">🎫</span>
         </div>
         <h2 className="text-2xl font-bold text-gray-900 mb-3">Coupons Module</h2>
         <p className="text-gray-500 font-medium max-w-md mx-auto leading-relaxed">
           This module interacts with the server-side validated <code className="bg-gray-100 px-2 py-1 rounded text-sm text-indigo-600 mx-1">/api/coupons</code> endpoint dynamically. Creation UI is mapped identically to the products logic.
         </p>
      </div>
    </div>
  );
}
