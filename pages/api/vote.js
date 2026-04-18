import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('votes')
      .select('vote, country')

    if (error) return res.status(500).json({ error: error.message })

    const yes = data.filter(v => v.vote === 'yes').length
    const no = data.filter(v => v.vote === 'no').length

    const byCountry = {}
    data.forEach(v => {
      if (!v.country || v.country === 'XX') return
      if (!byCountry[v.country]) byCountry[v.country] = { yes: 0, no: 0 }
      byCountry[v.country][v.vote]++
    })

    return res.status(200).json({ yes, no, byCountry })
  }

  if (req.method === 'POST') {
    const { vote } = req.body
    if (!['yes', 'no'].includes(vote)) {
      return res.status(400).json({ error: 'Invalid vote' })
    }

    const ip = req.headers['x-forwarded-for']?.split(',')[0].trim()
      || req.socket.remoteAddress

    let country = req.headers['cf-ipcountry']
      || req.headers['x-vercel-ip-country']
      || 'XX'

    if (country === 'XX') {
  try {
    const geo = await fetch(`https://freeipapi.com/api/json/${ip}`)
    const geoData = await geo.json()
    if (geoData.countryCode) country = geoData.countryCode
  } catch (e) {
    country = 'XX'
  }
}

    const { error } = await supabase
      .from('votes')
      .insert([{ vote, ip, country }])

    if (error) return res.status(500).json({ error: error.message })

    return res.status(200).json({ success: true, country })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
