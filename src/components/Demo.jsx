import Books from "./Books";

export default function Demo() {
  return (
    <div className="relative z-10 max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Book Management Demo</h2>
      <p className="text-blue-200/80 mb-6">Add books and view them. Cart, checkout, users, and orders endpoints are also available for integration.</p>
      <Books />
    </div>
  );
}
