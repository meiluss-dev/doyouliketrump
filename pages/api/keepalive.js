import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  await supabase.from('votes').select('count').limit(1)
  res.status(200).json({ alive: true, timestamp: new Date().toISOString() })
}
