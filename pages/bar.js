import { useEffect, useState } from 'react'
import supabase from '../lib/supabase'

const statusColors = {
  pending: 'bg-yellow-300 text-yellow-900',
  'in progress': 'bg-blue-300 text-blue-900',
  completed: 'bg-green-300 text-green-900',
}

export default function Bar() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    fetchOrders()
    // Optionally, refresh orders every 5s
    const interval = setInterval(fetchOrders, 5000)
    return () => clearInterval(interval)
  }, [])

  async function fetchOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('id,status,created_at,item_id,menu(name,price)')
      .order('created_at', { ascending: false })
    if (error) {
      console.error(error)
    } else {
      setOrders(data)
    }
  }

  async function updateStatus(id, newStatus) {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id)
    if (error) {
      console.error(error)
    } else {
      fetchOrders()
    }
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50 max-w-6xl mx-auto">
      <h1 className="text-4xl font-extrabold text-orange-600 mb-8 text-center">OrderIO - Orders Dashboard</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders yet.</p>
      ) : (
        <table className="w-full border-collapse bg-white rounded-lg shadow overflow-hidden">
          <thead className="bg-orange-600 text-white">
            <tr>
              <th className="p-4 text-left">Order ID</th>
              <th className="p-4 text-left">Item</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Ordered At</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b last:border-b-0 hover:bg-gray-100 transition">
                <td className="p-4">{order.id}</td>
                <td className="p-4 font-semibold">{order.menu.name}</td>
                <td className="p-4">€{order.menu.price.toFixed(2)}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full font-semibold ${
                      statusColors[order.status] || 'bg-gray-300 text-gray-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-4">{new Date(order.created_at).toLocaleString()}</td>
                <td className="p-4">
                  <select
                    value={order.status}
                    onChange={e => updateStatus(order.id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="in progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
