const path = require('path')
 
module.exports = {
  // the terminal portfolio lives in public/terminal; /terminal opens it full screen
  async redirects() {
    return [{ source: '/terminal', destination: '/terminal/index.html', permanent: false }]
  },
  // always revalidate the terminal's files, so browsers never run an old copy after a change
  async headers() {
    return [{
      source: '/terminal/:path*',
      headers: [{ key: 'Cache-Control', value: 'no-cache' }],
    }]
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
    ],
  },
}
