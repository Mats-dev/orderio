import supabase from '@/lib/supabase'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('orders')
      .select('id, status, created_at, menu(name)')
      .order('created_at', { ascending: false })

    if (error) return res.status(500).json({ error: error.message })
    res.status(200).json(data)
  } else if (req.method === 'POST') {
    const { item_id } = req.body
    const { error } = await supabase.from('orders').insert([{ item_id }])
    if (error) return res.status(500).json({ error: error.message })
    res.status(201).json({ message: 'Order placed' })
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
