import { useEffect, useState } from 'react'
import supabase from '@/lib/supabase'

export default function Home() {
  const [menu, setMenu] = useState([])

  useEffect(() => {
    fetchMenu()
  }, [])

  async function fetchMenu() {
    const { data, error } = await supabase.from('menu').select('*')
    if (error) console.error(error)
    else setMenu(data)
  }

  async function order(item_id) {
    const { error } = await supabase.from('orders').insert([{ item_id }])
    if (error) alert('Error placing order')
    else alert('Order placed!')
  }

  return (
    <div>
      <h1>OrderIO – Customer Menu</h1>
      <ul>
        {menu.map(item => (
          <li key={item.id}>
            {item.name} - €{item.price.toFixed(2)}
            <button onClick={() => order(item.id)} style={{ marginLeft: '10px' }}>
              Order
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
