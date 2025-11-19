import { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "";

export default function Cart({ activeUser }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!activeUser?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/cart?user_id=${activeUser.id}`);
      const data = await res.json();
      setItems(data.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeUser?.id]);

  const addToCart = async (bookId) => {
    if (!activeUser?.id) return alert("Select a user first");
    try {
      const res = await fetch(`${API_BASE}/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: activeUser.id, book_id: bookId, quantity: 1 })
      });
      if (!res.ok) throw new Error("Failed to add to cart");
      fetchCart();
    } catch (e) {
      alert(e.message);
    }
  };

  const removeFromCart = async (bookId) => {
    if (!activeUser?.id) return;
    try {
      const res = await fetch(`${API_BASE}/cart/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: activeUser.id, book_id: bookId })
      });
      if (!res.ok) throw new Error("Failed to remove from cart");
      fetchCart();
    } catch (e) {
      alert(e.message);
    }
  };

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, it) => sum + (it.book?.price || 0) * it.quantity, 0);
    return { subtotal, itemCount: items.reduce((s, it) => s + it.quantity, 0) };
  }, [items]);

  return (
    <div className="space-y-4">
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold">Cart</h3>
          <button onClick={fetchCart} className="text-blue-300 text-sm">Refresh</button>
        </div>
        {!activeUser?.id ? (
          <p className="text-blue-200">Select a user to manage the cart.</p>
        ) : loading ? (
          <p className="text-blue-200">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-blue-200">Your cart is empty.</p>
        ) : (
          <ul className="divide-y divide-white/10">
            {items.map((it) => (
              <li key={it.book_id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{it.book?.title}</p>
                  <p className="text-blue-200 text-sm">Qty: {it.quantity}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-200 text-sm">${(it.book?.price || 0).toFixed(2)}</span>
                  <button onClick={() => addToCart(it.book_id)} className="bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded text-sm">+1</button>
                  <button onClick={() => removeFromCart(it.book_id)} className="bg-red-600/80 hover:bg-red-600 text-white px-2 py-1 rounded text-sm">Remove</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
        <p className="text-blue-200">Items: {totals.itemCount}</p>
        <p className="text-white font-semibold">Subtotal: ${totals.subtotal.toFixed(2)}</p>
      </div>
    </div>
  );
}
