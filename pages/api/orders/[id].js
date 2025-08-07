import supabase from '@/lib/supabase'

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'PATCH') {
    const { newStatus } = req.body
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    res.status(200).json({ message: 'Status updated' })
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
