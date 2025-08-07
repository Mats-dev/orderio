import { useEffect, useState } from 'react'
import supabase from '../lib/supabase'

export default function Admin() {
  const [menu, setMenu] = useState([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')

  useEffect(() => {
    fetchMenu()
  }, [])

  async function fetchMenu() {
    const { data, error } = await supabase.from('menu').select('*').order('id')
    if (error) {
      console.error(error)
    } else {
      setMenu(data)
    }
  }

  async function addMenuItem(e) {
    e.preventDefault()
    if (!name || !price) {
      alert('Please enter both name and price.')
      return
    }
    const priceNum = parseFloat(price)
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Price must be a positive number.')
      return
    }
    const { error } = await supabase.from('menu').insert([{ name, price: priceNum }])
    if (error) {
      console.error(error)
      alert('Failed to add menu item.')
    } else {
      setName('')
      setPrice('')
      fetchMenu()
    }
  }

  async function deleteMenuItem(id) {
    if (!confirm('Are you sure you want to delete this item?')) return
    const { error } = await supabase.from('menu').delete().eq('id', id)
    if (error) {
      console.error(error)
      alert('Failed to delete menu item.')
    } else {
      fetchMenu()
    }
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50 max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold text-orange-600 mb-8 text-center">OrderIO - Admin Menu</h1>

      <form onSubmit={addMenuItem} className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Item name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="flex-grow border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <input
          type="number"
          step="0.01"
          placeholder="Price (€)"
          value={price}
          onChange={e => setPrice(e.target.value)}
          className="w-32 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          type="submit"
          className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition font-semibold"
        >
          Add Item
        </button>
      </form>

      {menu.length === 0 ? (
        <p className="text-center text-gray-500">No menu items yet.</p>
      ) : (
        <ul className="space-y-4">
          {menu.map(item => (
            <li
              key={item.id}
              className="flex justify-between items-center bg-white p-4 rounded shadow hover:shadow-lg transition"
            >
              <div>
                <span className="font-semibold">{item.name}</span> - €{item.price.toFixed(2)}
              </div>
              <button
                onClick={() => deleteMenuItem(item.id)}
                className="text-red-600 hover:text-red-800 font-bold"
                aria-label={`Delete ${item.name}`}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
