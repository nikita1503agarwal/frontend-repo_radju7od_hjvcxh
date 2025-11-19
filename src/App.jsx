import Demo from "./components/Demo";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>
      <div className="relative min-h-screen">
        <header className="relative z-10 text-center py-10">
          <img src="/flame-icon.svg" alt="Flames" className="w-16 h-16 mx-auto mb-3" />
          <h1 className="text-4xl font-bold text-white">Book Management System</h1>
          <p className="text-blue-200">Backend-first API with a simple UI to add and list books</p>
        </header>
        <Demo />
        <footer className="relative z-10 text-center py-6">
          <p className="text-blue-300/60 text-sm">Use the interface above to manage books. API base URL comes from VITE_BACKEND_URL.</p>
        </footer>
      </div>
    </div>
  )
}

export default App
