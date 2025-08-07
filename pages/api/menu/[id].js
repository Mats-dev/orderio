import supabase from '@/lib/supabase'

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'DELETE') {
    const { error } = await supabase.from('menu').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    res.status(200).json({ message: 'Deleted' })
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
