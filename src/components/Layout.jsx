import { useEffect, useMemo, useState } from "react";
import Users from "./Users";
import Books from "./Books";
import Cart from "./Cart";
import Checkout from "./Checkout";
import Orders from "./Orders";

export default function Layout() {
  const [activeTab, setActiveTab] = useState("books");
  const [activeUser, setActiveUser] = useState(null);

  const tabs = useMemo(() => ([
    { key: "books", label: "Books" },
    { key: "users", label: "Users" },
    { key: "cart", label: "Cart" },
    { key: "checkout", label: "Checkout" },
    { key: "orders", label: "Orders" },
  ]), []);

  useEffect(() => {
    const saved = localStorage.getItem("activeUser");
    if (saved && !activeUser) {
      try { setActiveUser(JSON.parse(saved)); } catch {}
    }
  }, [activeUser]);

  return (
    <div className="relative z-10 max-w-6xl mx-auto p-6 space-y-6">
      <nav className="flex flex-wrap items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-2">
        {tabs.map(t => (
          <button key={t.key} onClick={()=>setActiveTab(t.key)} className={`px-4 py-2 rounded text-sm ${activeTab===t.key?"bg-blue-600 text-white":"text-white bg-white/5 hover:bg-white/10"}`}>
            {t.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          {activeUser ? (
            <span className="text-blue-200 text-sm">Active: {activeUser.name}</span>
          ) : (
            <span className="text-blue-200 text-sm">No user selected</span>
          )}
          {activeUser && (
            <button onClick={()=>{setActiveUser(null); localStorage.removeItem("activeUser");}} className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded text-sm">Clear</button>
          )}
        </div>
      </nav>

      {activeTab === "books" && <Books />}
      {activeTab === "users" && <Users activeUser={activeUser} setActiveUser={setActiveUser} />}
      {activeTab === "cart" && <Cart activeUser={activeUser} />}
      {activeTab === "checkout" && <Checkout activeUser={activeUser} onSuccess={()=>setActiveTab("orders")} />}
      {activeTab === "orders" && <Orders activeUser={activeUser} />}
    </div>
  );
}
