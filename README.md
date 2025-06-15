# 🔗 Facebook Link Redirector

A simple, serverless Facebook link redirector built for Vercel that displays a blog post to regular users but redirects Facebook bots to your desired URL.

## 🌟 Features

- **Facebook Bot Detection**: Automatically detects Facebook crawlers and redirects them
- **Beautiful Blog Display**: Shows a professional healthcare blog to regular visitors
- **Serverless Architecture**: Optimized for Vercel's serverless functions
- **JSON Configuration**: Easy configuration through a simple JSON file
- **MongoDB Support**: With automatic fallback to JSON file storage
- **Mobile Responsive**: Looks great on all devices

## 🚀 Quick Setup

### 1. Clone or Fork This Repository

```bash
git clone <your-repo-url>
cd redirector
```

### 2. Configure Your Settings

Edit `data/metadata.json` with your desired settings:

```json
{
  "title": "Your Custom Facebook Share Title",
  "adestraLink": "https://your-actual-redirect-url.com",
  "lastUpdated": "2025-06-14T12:00:00.000Z"
}
```

**Configuration Options:**
- `title`: The title that appears when shared on Facebook
- `adestraLink`: The URL where Facebook users will be redirected
- `lastUpdated`: Timestamp (automatically updated by the system)

### 3. Deploy to Vercel

#### Method 1: Vercel CLI (Recommended)
```bash
npm install -g vercel
vercel login
vercel --prod
```

#### Method 2: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Deploy automatically

### 4. Optional: Add MongoDB

Add these environment variables in Vercel Dashboard:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
```

If MongoDB is not configured, the app automatically uses the JSON file.

## 📁 Project Structure

```
redirector/
├── api/
│   └── index.js          # Main serverless function
├── config/
│   └── database.js       # MongoDB connection
├── data/
│   └── metadata.json     # Configuration file
├── models/
│   └── Metadata.js       # MongoDB model with JSON fallback
├── package.json          # Dependencies
├── vercel.json          # Vercel configuration
└── README.md            # This file
```

## 🔧 How It Works

1. **Regular Users**: See a beautiful healthcare blog post
2. **Facebook Crawlers**: Get redirected to your `adestraLink`
3. **Facebook Posts**: Display the blog title and description
4. **User Clicks**: Get redirected to your desired URL

## 🎨 Customization

### Change Blog Content

Edit the HTML content in `api/index.js` in the `handleMainPage` function to customize:
- Blog title and description
- Article content
- Styling and layout
- Meta tags

### Change Facebook Share Preview

Update `data/metadata.json`:
```json
{
  "title": "Your New Title",
  "adestraLink": "https://your-new-url.com"
}
```

### Add Custom Styling

Modify the CSS in the `<style>` section of `api/index.js`.

## 🔍 Testing

### Test Regular User Experience
Visit your Vercel URL directly: `https://your-app.vercel.app`

### Test Facebook Bot Redirect
Use a tool like curl to simulate Facebook bot:
```bash
curl -H "User-Agent: facebookexternalhit/1.1" https://your-app.vercel.app
```

### Test Facebook Sharing
1. Share your link on Facebook
2. Check the preview shows your blog title
3. Click the shared link to test redirect

## 🛠️ Development

### Local Development
```bash
npm install
npm run dev
```

### Environment Variables
Create `.env.local` for local development:
```
MONGODB_URI=your-mongodb-connection-string
```

## 📊 Monitoring

Check your Vercel dashboard for:
- Function invocations
- Error logs
- Performance metrics

## 🔒 Security

- No admin panel = no security vulnerabilities
- Configuration through JSON file only
- Serverless architecture provides automatic scaling
- No session management required

## 🌍 Deployment URLs

After deployment, you'll get:
- Production URL: `https://your-app.vercel.app`
- Preview URLs for each deployment

## 📱 Mobile Optimization

The blog is fully responsive and optimized for:
- Mobile phones
- Tablets
- Desktop computers
- Facebook in-app browser

## 🔄 Updates

To update your redirect URL:
1. Edit `data/metadata.json`
2. Push changes to Git
3. Vercel automatically redeploys

## 🐛 Troubleshooting

### Common Issues:

**500 Error**: Check Vercel function logs in dashboard

**Redirect Not Working**: Verify `adestraLink` in metadata.json

**Facebook Not Showing Title**: Clear Facebook's cache by using their [Debugger](https://developers.facebook.com/tools/debug/)

**MongoDB Connection Failed**: App automatically falls back to JSON file

## 📞 Support

If you need help:
1. Check Vercel function logs
2. Verify your `metadata.json` syntax
3. Test with Facebook's sharing debugger
4. Check this README for configuration steps

## 🎉 Success!

Your Facebook link redirector is now live and working! Users will see your beautiful blog, but Facebook traffic gets redirected exactly where you want it.

---

**Built with ❤️ for Vercel Serverless Functions**
