import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../api/api";

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  
  const [phone, setPhone] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");

  const [street, setStreet] = useState("");
const [city, setCity] = useState("");
const [state, setState] = useState("");
const [pincode, setPincode] = useState("");
const [country, setCountry] = useState("India");

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(Number(value));

  const coupons = {
  BABY10:   { type: "%", value: 10, label: "10% off your order" },
  SAVE50:   { type: "₹", value: 50, label: "₹50 flat discount" },
  WELCOME5: { type: "%", value: 5,  label: "5% off for new users" },
};
  useEffect(() => {
    if (!user) navigate("/login");
    if (cart.length === 0 && !orderPlaced) navigate("/products");
  }, [user, cart, navigate, orderPlaced]);

  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.05;

  let discountAmount = 0;
  if (discountType === "%") discountAmount = (subtotal * discount) / 100;
  else if (discountType === "₹") discountAmount = discount;

  const total = subtotal + shipping + tax - discountAmount;

const applyCouponByCode = (code) => {
  if (couponApplied) {
    toast.error("Coupon already applied!");
    return;
  }
  setCouponCode(code);
  const coupon = coupons[code];
  setDiscount(coupon.value);
  setDiscountType(coupon.type);
  setCouponApplied(true);
  toast.success("Coupon applied!");
};

 const validateForm = () => {
    if (!street.trim() || !city.trim() || !state.trim() || !pincode.trim() || !country.trim()) {
      toast.error("Please fill all address fields");
      return false;
    }
    if (!phone.trim()) {
      toast.error("Please enter a phone number");
      return false;
    }
    return true;
  };

  const buildOrderData = () => ({
    phone,
    shippingAddress: { street, city, state, pincode, country },
    items: cart.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      price: item.productDetails.price,
    })),
    subtotal,
    shipping,
    tax,
    discountAmount,
    totalAmount: total,
    status: "Pending",
    paymentMethod,
  });

  const handleCOD = async () => {
    if (!validateForm()) return;
    try {
      setPlacing(true);
      const { data } = await api.post("/orders", {
        ...buildOrderData(),
        paymentStatus: "Pending",
      });
      console.log("full response data:", data);
      if (data.success) {
        setOrderPlaced(true)
        await clearCart()
        const uiOrder = {
      
          ...data.data,
          customer: { name: user.name },
          subtotal, shipping, tax, total,
          items: cart.map((item) => ({
            name: item.productDetails?.name,
            price: item.productDetails?.price,
            quantity: item.quantity,
          })),
        };
        toast.success("Order placed! Pay on delivery.")
        console.log("data.order:", data.order);
        navigate("/order-success", { state: { order: uiOrder } });
      }
    } catch {
      toast.error("Could not place order. Try again.");
    } finally {
      setPlacing(false);
    }
  };

  const handleRazorpay = async () => {
    console.log("Key:", import.meta.env.VITE_RAZORPAY_KEY_ID);
    if (!validateForm()) return;
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKey) {
      toast.error("Payment configuration error. Please contact support.");
      console.error("Missing VITE_RAZORPAY_KEY_ID in frontend .env");
      return;
    }
    try {
      setPlacing(true);
      const { data } = await api.post("/payment/create-order", { amount: total });
      const options = {
        key: razorpayKey,
        amount: data.order.amount,
        currency: "INR",
        name: "Mom & Baby Care Essentials",
        description: "Order Payment",
        order_id: data.order.id,
        handler: async function (response) {
          try {
            const verify = await api.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderData: buildOrderData(),
            });
            if (verify.data.success) {
              setOrderPlaced(true);
              await clearCart();
              const uiOrder = {
                ...verify.data.data,
                customer: { name: user.name },
                subtotal, shipping, tax, total,
                items: cart.map((item) => ({
                  name: item.productDetails?.name,
                  price: item.productDetails?.price,
                  quantity: item.quantity,
                })),
              };
              toast.success("Payment successful! Order placed.");
              navigate("/order-success", { state: { order: uiOrder } });
            }
          } catch {
            toast.error("Payment verification failed. Contact support.");
          }
        },
        prefill: { name: user?.name, email: user?.email, contact: phone },
        theme: { color: "#3B82F6" },
      };
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        toast.error("Payment failed: " + response.error.description);
      });
      rzp.open();
    } catch {
      toast.error("Could not initiate payment. Try again.");
    } finally {
      setPlacing(false);
    }
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === "cod") handleCOD();
    else handleRazorpay();
  };
// const handlePlaceOrder = async () => {
//    console.log("Key:", import.meta.env.VITE_RAZORPAY_KEY_ID);
//   if (!street.trim() || !city.trim() || !state.trim() || !pincode.trim() || !country.trim()) {
//     toast.error("Please fill all address fields");
//     return;
//   }
//   if (!phone.trim()) {
//     toast.error("Please enter a phone number");
//     return;
//   }
//   const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
//   if (!razorpayKey) {
//     toast.error("Payment configuration error. Please contact support.");
//     console.error("Missing VITE_RAZORPAY_KEY_ID in frontend .env");
//     return;
//   }

//   try {
//     setPlacing(true);

//     // Step 1: Create Razorpay order from backend
//     const { data } = await api.post("/payment/create-order", {
//       amount: total,
//     });

//     // Step 2: Open Razorpay popup
//     const options = {
//       key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//       amount: data.order.amount,
//       currency: "INR",
//       name: "Mom & Baby Care Essentials",
//       description: "Order Payment",
//       order_id: data.order.id,

//       handler: async function (response) {
//         try {
//           const orderData = {
//             phone,
//             shippingAddress: { street, city, state, pincode, country },
//             items: cart.map((item) => ({
//               product: item.product,
//               quantity: item.quantity,
//               price: item.productDetails.price,
//             })),
//             subtotal,
//             shipping,
//             tax,
//             discountAmount,
//             totalAmount: total,
//             status: "Pending",
//           };

//           // Step 3: Verify payment + save order
//           const verify = await api.post("/payment/verify", {
//             razorpay_order_id: response.razorpay_order_id,
//             razorpay_payment_id: response.razorpay_payment_id,
//             razorpay_signature: response.razorpay_signature,
//             orderData,
//           });

//           if (verify.data.success) {
//             setOrderPlaced(true);
//             await clearCart();

//             const backendOrder = verify.data.order;
//             const uiOrder = {
//               ...backendOrder,
//               customer: { name: user.name },
//               subtotal,
//               shipping,
//               tax,
//               total,
//               items: cart.map((item) => ({
//                 name: item.productDetails?.name,
//                 price: item.productDetails?.price,
//                 quantity: item.quantity,
//               })),
//             };

//             toast.success("Payment successful! Order placed.");
//             navigate("/order-success", { state: { order: uiOrder } });
//           }
//         } catch {
//           toast.error("Payment verification failed. Contact support.");
//         }
//       },

//       prefill: {
//         name: user?.name,
//         email: user?.email,
//         contact: phone,
//       },

//       theme: { color: "#3B82F6" },
//     };

//     const rzp = new window.Razorpay(options);

//     rzp.on("payment.failed", function (response) {
//       toast.error("Payment failed: " + response.error.description);
//     });

//     rzp.open();

//   } catch {
//     toast.error("Could not initiate payment. Try again.");
//   } finally {
//     setPlacing(false);
//   }
// };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid lg:grid-cols-2 gap-10">
      <div>
        <h2 className="text-2xl font-bold mb-6">Shipping Details</h2>

       <input
  type="text"
  placeholder="Street Address"
  value={street}
  onChange={(e) => setStreet(e.target.value)}
  className="w-full border p-3 rounded-lg mb-4"
/>

<input
  type="text"
  placeholder="City"
  value={city}
  onChange={(e) => setCity(e.target.value)}
  className="w-full border p-3 rounded-lg mb-4"
/>

<input
  type="text"
  placeholder="State"
  value={state}
  onChange={(e) => setState(e.target.value)}
  className="w-full border p-3 rounded-lg mb-4"
/>

<input
  type="text"
  placeholder="Pincode"
  value={pincode}
  onChange={(e) => setPincode(e.target.value)}
  className="w-full border p-3 rounded-lg mb-4"
/>

<input
  type="text"
  placeholder="Country"
  value={country}
  onChange={(e) => setCountry(e.target.value)}
  className="w-full border p-3 rounded-lg mb-4"
/>

        <input
          type="text"
          placeholder="Phone number"
          className="w-full border p-3 rounded-lg mb-4"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

          <h2 className="text-xl font-bold mb-3">Payment Method</h2>
        <div className="flex flex-col gap-3">
          <label className={`flex items-center gap-3 border-2 rounded-xl p-4 cursor-pointer transition-colors ${
            paymentMethod === "razorpay" ? "border-primary-500 bg-primary-50" : "border-gray-200"
          }`}>
            <input type="radio" name="payment" value="razorpay"
              checked={paymentMethod === "razorpay"}
              onChange={() => setPaymentMethod("razorpay")}
              className="accent-primary-600" />
            <div>
              <p className="font-semibold">Pay Online</p>
              <p className="text-sm text-gray-500">UPI, cards, net banking via Razorpay</p>
            </div>
          </label>
 
          <label className={`flex items-center gap-3 border-2 rounded-xl p-4 cursor-pointer transition-colors ${
            paymentMethod === "cod" ? "border-primary-500 bg-primary-50" : "border-gray-200"
          }`}>
            <input type="radio" name="payment" value="cod"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
              className="accent-primary-600" />
            <div>
              <p className="font-semibold">Cash on Delivery</p>
              <p className="text-sm text-gray-500">Pay when your order arrives</p>
            </div>
          </label>
        </div>
      
      </div>

      

      <div className="bg-white shadow-lg rounded-xl p-6 h-fit space-y-6">
        <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="font-medium">{item.productDetails?.name}</p>
                <p className="text-sm text-gray-500">
                  Qty: {item.quantity}
                </p>
              </div>

              <div className="font-semibold text-green-600">
                {formatPrice(item.productDetails?.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>
<div className="flex flex-col gap-2 mb-4">
  <p className="text-xs text-gray-500 mb-1">Available coupons — click to apply</p>
  <div className="grid grid-cols-3 gap-2 mb-3">
    {Object.entries(coupons).map(([code, coupon]) => {
      const isApplied = couponApplied && couponCode === code;
      return (
        <button
          key={code}
          onClick={() => applyCouponByCode(code)}
          disabled={couponApplied}
          className={`text-left border-2 border-dashed rounded-lg p-2 transition-colors ${
            isApplied
              ? "border-green-400 bg-green-50"
              : "border-gray-300 hover:border-primary-400 hover:bg-primary-50"
          }`}
        >
          <p className="font-mono text-xs font-semibold tracking-wide">
            {code}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{coupon.label}</p>
          <span
            className={`text-xs mt-1.5 inline-block px-2 py-0.5 rounded-full ${
              isApplied
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {isApplied ? "✓ Applied" : "Tap to apply"}
          </span>
        </button>
      );
    })}
  </div>

  <div className="flex gap-2">
    <input
      type="text"
      placeholder="Or enter coupon code"
      value={couponCode}
      onChange={(e) => setCouponCode(e.target.value)}
      className="flex-1 border px-3 py-2 rounded-lg"
      disabled={couponApplied}
    />
   
<button
  onClick={() => {
    const code = couponCode.toUpperCase();
    const coupon = coupons[code];
    if (!coupon) {
      toast.error("Invalid coupon code!");
      return;
    }
    applyCouponByCode(code);
  }}
  disabled={couponApplied}
  className={`px-4 py-2 rounded-lg text-white ${
    couponApplied ? "bg-gray-400" : "bg-primary-600 hover:bg-primary-700"
  }`}
>
  {couponApplied ? "Applied ✓" : "Apply"}
</button>

  </div>
</div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
          </div>

          <div className="flex justify-between">
            <span>Tax</span>
            <span>{formatPrice(tax)}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-{formatPrice(discountAmount)}</span>
            </div>
          )}

          <hr />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-primary-600">
              {formatPrice(total)}
            </span>
          </div>
        </div>

         <button onClick={handlePlaceOrder} disabled={placing}
          className="w-full mt-6 bg-primary-600 text-white py-3 rounded-xl font-semibold">
          {placing
            ? "Processing..."
            : paymentMethod === "cod"
            ? `Place Order (COD) — ${formatPrice(total)}`
            : `Pay ${formatPrice(total)}`}
        </button>
 
        {paymentMethod === "cod" && (
          <p className="text-xs text-center text-gray-400 -mt-4">
            You'll pay {formatPrice(total)} in cash when your order is delivered.
          </p>
        )}
      </div>
    </div>
  );
};

export default Checkout;