import { useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "";

export default function Checkout({ activeUser, onSuccess }) {
  const [form, setForm] = useState({
    full_name: "",
    address_line1: "",
    address_line2: "",
    zip_code: "",
    brand: "visa",
    last4: "4242",
    reference: "demo-ref-" + Math.random().toString(36).slice(2, 8),
  });
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => !!activeUser?.id && form.full_name && form.address_line1 && form.zip_code && form.brand && form.last4 && form.reference, [activeUser?.id, form]);

  const submit = async (e) => {
    e.preventDefault();
    if (!activeUser?.id) return alert("Select a user");
    setLoading(true);
    try {
      const payload = {
        user_id: activeUser.id,
        transaction: {
          full_name: form.full_name,
          address_line1: form.address_line1,
          address_line2: form.address_line2 || undefined,
          zip_code: form.zip_code,
          payment: { brand: form.brand, last4: form.last4, reference: form.reference }
        }
      };
      const res = await fetch(`${API_BASE}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Checkout failed");
      const data = await res.json();
      onSuccess?.(data);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <h3 className="text-white font-semibold mb-3">Checkout</h3>
      {!activeUser?.id ? (
        <p className="text-blue-200">Select a user to proceed to checkout.</p>
      ) : (
        <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <input className="bg-white/10 text-white px-3 py-2 rounded" placeholder="Full name" value={form.full_name} onChange={(e)=>setForm({...form,full_name:e.target.value})} />
          <input className="bg-white/10 text-white px-3 py-2 rounded" placeholder="Address line 1" value={form.address_line1} onChange={(e)=>setForm({...form,address_line1:e.target.value})} />
          <input className="bg-white/10 text-white px-3 py-2 rounded" placeholder="Address line 2 (optional)" value={form.address_line2} onChange={(e)=>setForm({...form,address_line2:e.target.value})} />
          <input className="bg-white/10 text-white px-3 py-2 rounded" placeholder="ZIP code" value={form.zip_code} onChange={(e)=>setForm({...form,zip_code:e.target.value})} />

          <select className="bg-white/10 text-white px-3 py-2 rounded" value={form.brand} onChange={(e)=>setForm({...form,brand:e.target.value})}>
            <option value="visa">Visa</option>
            <option value="mastercard">Mastercard</option>
            <option value="amex">Amex</option>
          </select>
          <input className="bg-white/10 text-white px-3 py-2 rounded" placeholder="Card last4" value={form.last4} onChange={(e)=>setForm({...form,last4:e.target.value})} />
          <input className="bg-white/10 text-white px-3 py-2 rounded sm:col-span-2" placeholder="Payment reference" value={form.reference} onChange={(e)=>setForm({...form,reference:e.target.value})} />

          <button disabled={!canSubmit || loading} className="bg-green-600 disabled:opacity-50 hover:bg-green-500 text-white px-4 py-2 rounded sm:col-span-2">{loading?"Processing...":"Place order"}</button>
        </form>
      )}
    </div>
  );
}
