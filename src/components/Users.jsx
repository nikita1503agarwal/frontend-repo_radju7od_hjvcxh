import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "";

export default function Users({ activeUser, setActiveUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users`);
      const data = await res.json();
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("activeUser");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setActiveUser(parsed);
      } catch {}
    }
  }, [setActiveUser]);

  const createUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email })
      });
      if (!res.ok) throw new Error("Failed to create user");
      setForm({ name: "", email: "" });
      fetchUsers();
    } catch (e) {
      alert(e.message);
    }
  };

  const selectUser = (u) => {
    const minimal = { id: u.id, name: u.name, email: u.email };
    setActiveUser(minimal);
    localStorage.setItem("activeUser", JSON.stringify(minimal));
  };

  return (
    <div className="space-y-4">
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-3">Create user</h3>
        <form onSubmit={createUser} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <input className="bg-white/10 text-white px-3 py-2 rounded" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} />
          <input className="bg-white/10 text-white px-3 py-2 rounded" placeholder="Email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} />
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded">Add user</button>
        </form>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold">Users</h3>
          <button onClick={fetchUsers} className="text-blue-300 text-sm">Refresh</button>
        </div>
        {loading ? (
          <p className="text-blue-200">Loading...</p>
        ) : (
          <ul className="divide-y divide-white/10">
            {users.map((u)=> (
              <li key={u.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{u.name}</p>
                  <p className="text-blue-200 text-sm">{u.email}</p>
                </div>
                <button onClick={()=>selectUser(u)} className={`px-3 py-1.5 rounded text-sm ${activeUser?.id===u.id?"bg-green-600 text-white":"bg-white/10 text-white hover:bg-white/20"}`}>
                  {activeUser?.id===u.id?"Selected":"Select"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
