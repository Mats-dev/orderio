import { useEffect, useState } from 'react'
import supabase from '@/lib/supabase'

export default function BarView() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 5000)
    return () => clearInterval(interval)
  }, [])

  async function fetchOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('id, status, created_at, menu(name)')
      .order('created_at', { ascending: false })
    if (error) console.error(error)
    else setOrders(data)
  }

  async function updateStatus(id, newStatus) {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id)
    if (error) alert('Error updating status')
    else fetchOrders()
  }

  return (
    <div>
      <h1>OrderIO – Bar View</h1>
      <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Item</th>
            <th>Status</th>
            <th>Change Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.menu.name}</td>
              <td>{order.status}</td>
              <td>
                <select
                  value={order.status}
                  onChange={e => updateStatus(order.id, e.target.value)}
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
    </div>
  )
}
