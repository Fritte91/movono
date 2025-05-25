export const config = {
  yts: {
    username: process.env.YTS_USERNAME,
    password: process.env.YTS_PASSWORD,
  },
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  }
}; 