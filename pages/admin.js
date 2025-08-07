import { useEffect, useState } from 'react'
import supabase from '@/lib/supabase'

export default function AdminPanel() {
  const [menu, setMenu] = useState([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')

  useEffect(() => {
    fetchMenu()
  }, [])

  async function fetchMenu() {
    const { data, error } = await supabase.from('menu').select('*').order('id')
    if (error) console.error(error)
    else setMenu(data)
  }

  async function addItem(e) {
    e.preventDefault()
    const { error } = await supabase.from('menu').insert([{ name, price: parseFloat(price) }])
    if (error) alert('Error adding item')
    else {
      setName('')
      setPrice('')
      fetchMenu()
    }
  }

  async function deleteItem(id) {
    if (!confirm('Delete this menu item?')) return
    const { error } = await supabase.from('menu').delete().eq('id', id)
    if (error) alert('Error deleting item')
    else fetchMenu()
  }

  return (
    <div>
      <h1>OrderIO – Admin Panel</h1>
      <form onSubmit={addItem}>
        <input
          placeholder="Item name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={{ marginRight: '10px' }}
        />
        <input
          placeholder="Price"
          type="number"
          step="0.01"
          value={price}
          onChange={e => setPrice(e.target.value)}
          required
          style={{ marginRight: '10px', width: '80px' }}
        />
        <button type="submit">Add Item</button>
      </form>

      <h2>Menu Items</h2>
      <ul>
        {menu.map(item => (
          <li key={item.id}>
            {item.name} — €{item.price.toFixed(2)}{' '}
            <button onClick={() => deleteItem(item.id)} style={{ marginLeft: '10px' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
