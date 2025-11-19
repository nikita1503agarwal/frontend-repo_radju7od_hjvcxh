import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "";

export default function Orders({ activeUser }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = activeUser?.id ? `${API_BASE}/orders?user_id=${activeUser.id}` : `${API_BASE}/orders`;
      const res = await fetch(url);
      const data = await res.json();
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeUser?.id]);

  const updateStatus = async (orderId, status) => {
    setStatusUpdating(orderId);
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error("Failed to update status");
      await fetchOrders();
    } catch (e) {
      alert(e.message);
    } finally {
      setStatusUpdating(null);
    }
  };

  const statuses = ["pending","processing","shipped","delivered","cancelled","returned"];

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold">Orders {activeUser?.id?`for ${activeUser.name}`:"(all)"}</h3>
        <button onClick={fetchOrders} className="text-blue-300 text-sm">Refresh</button>
      </div>
      {loading ? (
        <p className="text-blue-200">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-blue-200">No orders found.</p>
      ) : (
        <ul className="divide-y divide-white/10">
          {orders.map((o) => (
            <li key={o.id} className="py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Order #{o.id.slice(-6)}</p>
                  <p className="text-blue-200 text-sm">User: {o.user?.name || activeUser?.name || o.user_id}</p>
                  <p className="text-blue-200 text-sm">Status: <span className="text-white">{o.status}</span></p>
                </div>
                <div className="flex items-center gap-2">
                  <select disabled={statusUpdating===o.id} value={o.status} onChange={(e)=>updateStatus(o.id, e.target.value)} className="bg-white/10 text-white px-2 py-1 rounded text-sm">
                    {statuses.map(s=> <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <ul className="mt-2 text-sm text-blue-200 list-disc pl-5">
                {o.items?.map((it)=> (
                  <li key={it.book_id}>{it.book?.title || it.book_id} x {it.quantity}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
