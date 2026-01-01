// Track Order page - exact Figma implementation
// Based on Figma design - Track Order Page

import { Link } from 'react-router-dom';

// Icon Assets
const imgArrowDown = "https://www.figma.com/api/mcp/asset/11c6c4cc-49be-4c6e-beee-5f1767680185";

// Order Progress Icons
const imgDocumentIcon = "https://www.figma.com/api/mcp/asset/document-icon"; // TODO: Get actual Figma asset ID
const imgBoxIcon = "https://www.figma.com/api/mcp/asset/box-icon"; // TODO: Get actual Figma asset ID
const imgTruckIcon = "https://www.figma.com/api/mcp/asset/44bb4a15-1b33-43cb-b03c-a87b32237591"; // From Header img1
const imgHandshakeIcon = "https://www.figma.com/api/mcp/asset/handshake-icon"; // TODO: Get actual Figma asset ID

// Activity Icons
const imgCheckmarkGreen = "https://www.figma.com/api/mcp/asset/checkmark-green"; // TODO: Get actual Figma asset ID
const imgPersonIcon = "https://www.figma.com/api/mcp/asset/person-icon"; // TODO: Get actual Figma asset ID
const imgLocationPin = "https://www.figma.com/api/mcp/asset/location-pin"; // TODO: Get actual Figma asset ID
const imgCheckmarkCircle = "https://www.figma.com/api/mcp/asset/checkmark-circle"; // TODO: Get actual Figma asset ID

// Product Images
const imgProduct1 = "https://www.figma.com/api/mcp/asset/31331607-e3da-4091-a87f-d673768d08a0";
const imgProduct2 = "https://www.figma.com/api/mcp/asset/397ef9d6-e230-46dc-a591-71cc82d81a35";

export default function TrackOrder() {
  // Sample order data
  const orderData = {
    orderId: "#96459761",
    orderDate: "17 Jan, 2021 at 7:32 PM",
    productCount: 4,
    totalPrice: "$1199.00",
    expectedArrival: "23 Jan, 2021",
    currentStage: "Order Placed", // Order Placed, Packaging, On The Road, Delivered
    products: [
      {
        id: 1,
        name: "Google Pixel 6 Pro - 5G Android Phone",
        image: imgProduct1,
        price: "$899",
        quantity: 1,
        subtotal: "$899"
      },
      {
        id: 2,
        name: "Tech21 Evo Clear for Google Pixel 6 Pro - Crystal Clear Phone Case",
        image: imgProduct2,
        price: "$39",
        quantity: 1,
        subtotal: "$39"
      }
    ],
    billingAddress: {
      name: "Kevin Gilbert",
      address: "Dhaka, Bangladesh",
      phone: "+1-202-555-0118",
      email: "kevin.gilbert@gmail.com"
    },
    shippingAddress: {
      name: "Kevin Gilbert",
      address: "Dhaka, Bangladesh",
      phone: "+1-202-555-0118",
      email: "kevin.gilbert@gmail.com"
    },
    orderNotes: "Donec ac vehicula turpis. Aenean sagittis est eu arcu ornare, eget venenatis purus lobortis. Aliquam erat volutpat. Aliquam magna odio."
  };

  const progressStages = [
    { id: 1, name: "Order Placed", icon: imgDocumentIcon, active: true },
    { id: 2, name: "Packaging", icon: imgBoxIcon, active: false },
    { id: 3, name: "On The Road", icon: imgTruckIcon, active: false },
    { id: 4, name: "Delivered", icon: imgHandshakeIcon, active: false }
  ];

  const activityLog = [
    {
      id: 1,
      icon: imgCheckmarkGreen,
      description: "Your order has been delivered. Thank you for shopping at Clicon!",
      date: "23 Jan, 2021 at 7:32 PM"
    },
    {
      id: 2,
      icon: imgPersonIcon,
      description: "Our delivery man (John Wick) Has picked-up your order for delvery.",
      date: "23 Jan, 2021 at 2:00 PM"
    },
    {
      id: 3,
      icon: imgLocationPin,
      description: "Your order has reached at last mile hub.",
      date: "22 Jan, 2021 at 8:00 AM"
    },
    {
      id: 4,
      icon: imgDocumentIcon,
      description: "Your order on the way to (last mile) hub.",
      date: "21, 2021 at 5:32 AM"
    },
    {
      id: 5,
      icon: imgCheckmarkCircle,
      description: "Your order is successfully verified.",
      date: "20 Jan, 2021 at 7:32 PM"
    },
    {
      id: 6,
      icon: imgDocumentIcon,
      description: "Your order has been confirmed.",
      date: "19 Jan, 2021 at 2:61 PM"
    }
  ];

  return (
    <div className="bg-white dark:bg-[#0f172a] relative w-full min-h-screen transition-colors duration-300">
      <div className="flex flex-col gap-[24px] sm:gap-[32px] md:gap-[40px] items-start relative w-full max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-[12px] sm:px-[16px] md:px-[24px] lg:px-[40px] xl:px-[100px] py-[24px] sm:py-[32px] md:py-[40px]">
        
        {/* Breadcrumb */}
        <div className="flex gap-[8px] items-center relative w-full" data-name="Breadcrumb">
          <Link to="/" className="font-['Poppins'] font-normal leading-[20px] text-[#666] dark:text-white text-[14px] hover:text-[#eea137] transition-colors cursor-pointer">
            Home
          </Link>
          <div className="flex items-center justify-center relative size-[18px]">
            <div className="flex-none rotate-[270deg]">
              <div className="relative size-[18px]" data-name="arrow-down">
                <div className="absolute contents inset-0">
                  <img alt="" className="block max-w-none size-full" src={imgArrowDown} onError={(e) => e.target.style.display = 'none'} />
                </div>
              </div>
            </div>
          </div>
          <p className="font-['Poppins'] font-normal leading-[20px] text-[#eea137] text-[14px] lowercase">
            track order
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white dark:bg-[#1e293b] border border-[#e6e6e6] dark:border-[#334155] border-solid rounded-[4px] p-[20px] sm:p-[24px] md:p-[32px] w-full shadow-sm transition-colors duration-300">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-[16px] sm:gap-[24px] mb-[24px] sm:mb-[32px]">
            <div className="flex flex-col gap-[8px]">
              <h1 className="font-['Poppins'] font-bold text-[24px] sm:text-[28px] md:text-[32px] text-[#0e1c47] dark:text-white">
                {orderData.orderId}
              </h1>
              <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] dark:text-[#e5e7eb]">
                {orderData.productCount} Products • Order Placed in {orderData.orderDate}
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-[8px]">
              <p className="font-['Poppins'] font-bold text-[24px] sm:text-[28px] md:text-[32px] text-[#0e1c47] dark:text-white">
                {orderData.totalPrice}
              </p>
              <Link to="#" className="font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#eea137] hover:underline">
                Leave a Rating +
              </Link>
            </div>
          </div>

          {/* Order Progress */}
          <div className="mb-[24px] sm:mb-[32px]">
            <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] dark:text-[#e5e7eb] mb-[16px] sm:mb-[20px]">
              Order expected arrival {orderData.expectedArrival}
            </p>
            
            {/* Progress Bar */}
            <div className="relative w-full">
              {/* Progress Line */}
              <div className="absolute top-[24px] left-0 right-0 h-[2px] bg-[#e6e6e6] dark:bg-[#334155] z-0 transition-colors duration-300">
                <div className="h-full bg-[#eea137] transition-all" style={{ width: '25%' }}></div>
              </div>
              
              {/* Progress Stages */}
              <div className="relative flex justify-between items-start z-10">
                {progressStages.map((stage, index) => (
                  <div key={stage.id} className="flex flex-col items-center gap-[8px] sm:gap-[12px] flex-1 max-w-[25%]">
                    <div className={`relative z-10 size-[48px] rounded-full flex items-center justify-center transition-all ${stage.active ? 'bg-[#eea137]' : 'bg-white dark:bg-[#0f172a] border-2 border-[#e6e6e6] dark:border-[#334155]'}`}>
                      {stage.active ? (
                        <svg className="w-[24px] h-[24px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <img 
                          alt={stage.name} 
                          className="w-[20px] h-[20px] opacity-30 dark:opacity-50 dark:brightness-0 dark:invert" 
                          src={stage.icon}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                    </div>
                    <p className={`font-['Poppins'] font-medium text-[14px] text-center whitespace-nowrap ${stage.active ? 'text-[#eea137]' : 'text-[#666] dark:text-white'}`}>
                      {stage.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Order Activity Log */}
        <div className="bg-white dark:bg-[#1e293b] border border-[#e6e6e6] dark:border-[#334155] border-solid rounded-[4px] p-[20px] sm:p-[24px] md:p-[32px] w-full shadow-sm transition-colors duration-300">
          <h2 className="font-['Poppins'] font-semibold text-[20px] sm:text-[24px] md:text-[28px] text-[#0e1c47] dark:text-white mb-[20px] sm:mb-[24px]">
            Order Activity
          </h2>
          
          <div className="flex flex-col gap-[16px] sm:gap-[20px]">
            {activityLog.map((activity, index) => (
              <div key={activity.id} className="flex gap-[12px] sm:gap-[16px] items-start">
                <div className="relative shrink-0 size-[24px] sm:size-[28px] mt-[2px]">
                  <div className="w-full h-full rounded-full bg-[#eea137] flex items-center justify-center">
                    <svg className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#0e1c47] dark:text-white mb-[4px] leading-relaxed">
                    {activity.description}
                  </p>
                  <p className="font-['Poppins'] font-normal text-[12px] sm:text-[14px] text-[#666] dark:text-[#e5e7eb]">
                    {activity.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product List */}
        <div className="bg-white dark:bg-[#1e293b] border border-[#e6e6e6] dark:border-[#334155] border-solid rounded-[4px] p-[20px] sm:p-[24px] md:p-[32px] w-full shadow-sm transition-colors duration-300">
          <h2 className="font-['Poppins'] font-semibold text-[20px] sm:text-[24px] md:text-[28px] text-[#0e1c47] dark:text-white mb-[20px] sm:mb-[24px]">
            Product (0{orderData.products.length})
          </h2>
          
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e6e6e6] dark:border-[#334155] transition-colors duration-300">
                  <th className="text-left py-[12px] px-[16px] font-['Poppins'] font-semibold text-[14px] sm:text-[16px] text-[#0e1c47] dark:text-white">PRODUCTS</th>
                  <th className="text-left py-[12px] px-[16px] font-['Poppins'] font-semibold text-[14px] sm:text-[16px] text-[#0e1c47] dark:text-white">PRICE</th>
                  <th className="text-left py-[12px] px-[16px] font-['Poppins'] font-semibold text-[14px] sm:text-[16px] text-[#0e1c47] dark:text-white">QUANTITY</th>
                  <th className="text-left py-[12px] px-[16px] font-['Poppins'] font-semibold text-[14px] sm:text-[16px] text-[#0e1c47] dark:text-white">SUB-TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {orderData.products.map((product) => (
                  <tr key={product.id} className="border-b border-[#e6e6e6] dark:border-[#334155] last:border-b-0 transition-colors duration-300">
                    <td className="py-[16px] px-[16px]">
                      <div className="flex items-center gap-[12px] sm:gap-[16px]">
                        <img 
                          alt={product.name} 
                          className="w-[60px] sm:w-[80px] h-[60px] sm:h-[80px] object-cover rounded-[4px]" 
                          src={product.image}
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop';
                          }}
                        />
                        <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#0e1c47] dark:text-white">
                          {product.name}
                        </p>
                      </div>
                    </td>
                    <td className="py-[16px] px-[16px] font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#0e1c47] dark:text-white">
                      {product.price}
                    </td>
                    <td className="py-[16px] px-[16px] font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#0e1c47] dark:text-white">
                      x{product.quantity}
                    </td>
                    <td className="py-[16px] px-[16px] font-['Poppins'] font-semibold text-[14px] sm:text-[16px] text-[#0e1c47] dark:text-white">
                      {product.subtotal}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col gap-[16px]">
            {orderData.products.map((product) => (
              <div key={product.id} className="border border-[#e6e6e6] dark:border-[#334155] rounded-[4px] p-[16px] transition-colors duration-300">
                <div className="flex gap-[12px] mb-[12px]">
                  <img 
                    alt={product.name} 
                    className="w-[80px] h-[80px] object-cover rounded-[4px] shrink-0" 
                    src={product.image}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop';
                    }}
                  />
                  <div className="flex-1">
                    <p className="font-['Poppins'] font-normal text-[14px] text-[#0e1c47] dark:text-white mb-[8px]">
                      {product.name}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="font-['Poppins'] font-medium text-[14px] text-[#0e1c47] dark:text-white">
                        {product.price}
                      </span>
                      <span className="font-['Poppins'] font-medium text-[14px] text-[#666] dark:text-[#e5e7eb]">
                        Qty: {product.quantity}
                      </span>
                    </div>
                    <p className="font-['Poppins'] font-semibold text-[14px] text-[#0e1c47] dark:text-white mt-[8px]">
                      Sub-total: {product.subtotal}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Address and Notes Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] sm:gap-[24px] w-full">
          {/* Billing Address */}
          <div className="bg-white dark:bg-[#1e293b] border border-[#e6e6e6] dark:border-[#334155] border-solid rounded-[4px] p-[20px] sm:p-[24px] shadow-sm transition-colors duration-300">
            <h3 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] dark:text-white mb-[16px] sm:mb-[20px]">
              Billing Address
            </h3>
            <div className="flex flex-col gap-[8px] font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] dark:text-[#e5e7eb]">
              <p className="text-[#0e1c47] dark:text-white font-medium">{orderData.billingAddress.name}</p>
              <p>{orderData.billingAddress.address}</p>
              <p>{orderData.billingAddress.phone}</p>
              <p>{orderData.billingAddress.email}</p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white dark:bg-[#1e293b] border border-[#e6e6e6] dark:border-[#334155] border-solid rounded-[4px] p-[20px] sm:p-[24px] shadow-sm transition-colors duration-300">
            <h3 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] dark:text-white mb-[16px] sm:mb-[20px]">
              Shipping Address
            </h3>
            <div className="flex flex-col gap-[8px] font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] dark:text-[#e5e7eb]">
              <p className="text-[#0e1c47] dark:text-white font-medium">{orderData.shippingAddress.name}</p>
              <p>{orderData.shippingAddress.address}</p>
              <p>{orderData.shippingAddress.phone}</p>
              <p>{orderData.shippingAddress.email}</p>
            </div>
          </div>

          {/* Order Notes */}
          <div className="bg-white dark:bg-[#1e293b] border border-[#e6e6e6] dark:border-[#334155] border-solid rounded-[4px] p-[20px] sm:p-[24px] shadow-sm transition-colors duration-300">
            <h3 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] dark:text-white mb-[16px] sm:mb-[20px]">
              Order Notes
            </h3>
            <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] dark:text-[#e5e7eb] leading-relaxed">
              {orderData.orderNotes}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

