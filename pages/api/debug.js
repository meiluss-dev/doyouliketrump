export default async function handler(req, res) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim()
    || req.socket.remoteAddress

  let geoResult = null
  try {
    const geo = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode,country,query`)
    geoResult = await geo.json()
  } catch (e) {
    geoResult = { error: e.message }
  }

  res.status(200).json({
    ip,
    headers: {
      cf_ipcountry: req.headers['cf-ipcountry'],
      vercel_ip_country: req.headers['x-vercel-ip-country'],
      forwarded_for: req.headers['x-forwarded-for'],
    },
    geo_api_result: geoResult
  })
}

