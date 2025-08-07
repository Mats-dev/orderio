import { useEffect, useState } from 'react'
import supabase from '../lib/supabase'

export default function Home() {
  const [menu, setMenu] = useState([])
  const [order, setOrder] = useState({}) // {itemId: qty}

  useEffect(() => {
    fetchMenu()
  }, [])

  async function fetchMenu() {
    const { data, error } = await supabase.from('menu').select('*')
    if (error) {
      console.error(error)
    } else {
      setMenu(data)
    }
  }

  function addToOrder(itemId) {
    setOrder(prev => {
      const qty = prev[itemId] || 0
      return {...prev, [itemId]: qty + 1}
    })
  }

  function removeFromOrder(itemId) {
    setOrder(prev => {
      const qty = prev[itemId]
      if (!qty) return prev
      const updated = {...prev}
      if (qty === 1) delete updated[itemId]
      else updated[itemId] = qty - 1
      return updated
    })
  }

  async function placeOrder() {
    const items = Object.entries(order)
    if (items.length === 0) {
      alert('Please add some items to your order first.')
      return
    }
    for (const [itemId, qty] of items) {
      for (let i = 0; i < qty; i++) {
        await supabase.from('orders').insert({ item_id: parseInt(itemId) })
      }
    }
    setOrder({})
    alert('Order placed! Thanks!')
  }

  const orderItems = Object.entries(order).map(([id, qty]) => {
    const item = menu.find(m => m.id === parseInt(id))
    return { ...item, qty }
  })

  const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.qty, 0)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-extrabold text-orange-600 mb-8 text-center">OrderIO - Bar Menu</h1>

      {menu.length === 0 && <p className="text-center text-gray-500">Loading menu...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {menu.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between">
            <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
            <p className="text-gray-700 mb-4">€{item.price.toFixed(2)}</p>
            <button
              onClick={() => addToOrder(item.id)}
              className="mt-auto bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition"
            >
              Add to Order
            </button>
          </div>
        ))}
      </div>

      {/* Order Summary Panel */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 max-w-5xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
        <div className="flex-1 overflow-x-auto">
          {orderItems.length === 0 ? (
            <p className="text-gray-500">No items in your order.</p>
          ) : (
            <ul className="flex space-x-4 whitespace-nowrap">
              {orderItems.map(item => (
                <li key={item.id} className="flex items-center space-x-2">
                  <span className="font-semibold">{item.name}</span>
                  <span className="text-gray-600">x{item.qty}</span>
                  <button
                    onClick={() => removeFromOrder(item.id)}
                    className="text-red-500 hover:text-red-700 font-bold"
                    aria-label={`Remove one ${item.name}`}
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <p className="font-semibold text-lg">Total: €{totalPrice.toFixed(2)}</p>
          <button
            onClick={placeOrder}
            disabled={orderItems.length === 0}
            className={`py-2 px-5 rounded-lg font-bold text-white ${
              orderItems.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'
            }`}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  )
}
