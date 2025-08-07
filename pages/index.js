export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <h1 className="text-5xl font-extrabold text-blue-600 mb-6">OrderIO</h1>
      <p className="text-lg text-gray-700">Welcome to the bar ordering system.</p>
      <button className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700">
        Start Ordering
      </button>
    </main>
  );
}
