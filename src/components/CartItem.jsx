import { Link } from "react-router-dom";
import { Trash2, Minus, Plus } from "lucide-react";

function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
}) {
  const product = item.productDetails;
  if (!product) return null;

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(Number(value));

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(product._id, item.quantity - 1,item.size);
    }
  };

  const handleIncrease = () => {
    if (item.quantity < (product.stock || 99)) {
      onUpdateQuantity(product._id, item.quantity + 1,item.size);
    }
  };

  const handleRemove = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this item from your cart?"
    );

    if (confirmDelete) {
      onRemove(product._id,item.size);
    }
  };

  const subtotal = (product.price || 0) * item.quantity;

  return (
    <div className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

     
      <div className="flex items-center gap-4">

        <img
          src={product.image}
          alt={product.name}
          className="w-16 h-16 object-cover rounded-md"
        />

        <div>
          <Link
            to={`/products/${product._id}`}
            className="font-medium hover:text-primary-600"
          >
            {product.name}
          </Link>

          <p className="text-sm text-gray-500">
            {formatPrice(product.price)} each
          </p>

         
          {item.size && (
            <p className="text-xs text-gray-400">
              Size: {item.size}
            </p>
          )}
        </div>
      </div>

      
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">

       
        <div className="flex items-center border rounded-md">
          <button
            onClick={handleDecrease}
            disabled={item.quantity <= 1}
            className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
          >
            <Minus size={16} />
          </button>

          <span className="px-3 text-sm">{item.quantity}</span>

          <button
            onClick={handleIncrease}
            disabled={item.quantity >= (product.stock || 99)}
            className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
          >
            <Plus size={16} />
          </button>
        </div>

        
        <div className="font-semibold text-primary-600">
          {formatPrice(subtotal)}
        </div>

       
        <button
          onClick={handleRemove}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

export default CartItem;