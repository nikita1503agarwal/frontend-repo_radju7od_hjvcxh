import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", author: "", isbn: "", price: 0, stock: 0 });

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/books`);
      const data = await res.json();
      setBooks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const addBook = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          author: form.author,
          isbn: form.isbn,
          price: Number(form.price),
          stock: Number(form.stock),
        }),
      });
      if (!res.ok) throw new Error("Failed to add book");
      setForm({ title: "", author: "", isbn: "", price: 0, stock: 0 });
      fetchBooks();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={addBook} className="bg-white/5 border border-white/10 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-3">Add a book</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <input className="bg-white/10 text-white px-3 py-2 rounded" placeholder="Title" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} />
          <input className="bg-white/10 text-white px-3 py-2 rounded" placeholder="Author" value={form.author} onChange={(e)=>setForm({...form,author:e.target.value})} />
          <input className="bg-white/10 text-white px-3 py-2 rounded" placeholder="ISBN" value={form.isbn} onChange={(e)=>setForm({...form,isbn:e.target.value})} />
          <input type="number" className="bg-white/10 text-white px-3 py-2 rounded" placeholder="Price" value={form.price} onChange={(e)=>setForm({...form,price:e.target.value})} />
          <input type="number" className="bg-white/10 text-white px-3 py-2 rounded" placeholder="Stock" value={form.stock} onChange={(e)=>setForm({...form,stock:e.target.value})} />
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded">Add</button>
        </div>
      </form>

      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold">Books</h3>
          <button onClick={fetchBooks} className="text-blue-300 text-sm">Refresh</button>
        </div>
        {loading ? (
          <p className="text-blue-200">Loading...</p>
        ) : (
          <ul className="divide-y divide-white/10">
            {books.map((b)=> (
              <li key={b.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{b.title}</p>
                  <p className="text-blue-200 text-sm">{b.author} • ISBN: {b.isbn}</p>
                </div>
                <div className="text-blue-200 text-sm">${b.price} • Stock: {b.stock}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
