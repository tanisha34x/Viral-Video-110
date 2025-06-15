const connectDB = require('../config/database');
const Metadata = require('../models/Metadata');

// Check if user agent is Facebook bot
function isFacebookBot(userAgent, referer) {
    const ua = (userAgent || '').toLowerCase();
    const ref = (referer || '').toLowerCase();
    return ua.includes('facebookexternalhit') || 
           ua.includes('facebot') || 
           ref.includes('facebook.com');
}

// Connect to MongoDB once
connectDB();

export default async function handler(req, res) {
    const { method, url } = req;
    
    try {
        // Route handling
        if (method === 'GET' && url === '/') {
            return await handleMainPage(req, res);
        } else if (method === 'GET' && url === '/api/metadata') {
            return await handleMetadataGet(req, res);
        } else {
            return res.status(404).json({ error: 'Not Found' });
        }
    } catch (error) {
        console.error('Handler error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function handleMainPage(req, res) {
    const userAgent = req.headers['user-agent'] || '';
    const referer = req.headers.referer || '';
    const metadata = await Metadata.getSingle();
    
    // Check if it's Facebook bot and redirect
    if (isFacebookBot(userAgent, referer)) {
        return res.redirect(302, metadata.adestraLink);
    }
    
    // Generate meta tags for Facebook sharing
    const ogTitle = metadata.title || 'Top 7 renowned leading hospitals of Gujarat';
    const ogDescription = 'Top 7 renowned leading hospitals in Gujarat providing excellent healthcare services';
    const ogImage = 'https://via.placeholder.com/1200x630/0066cc/ffffff?text=Healthcare+News';
    const currentUrl = `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}${req.url}`;
    
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${ogTitle}</title>
    <meta name="description" content="${ogDescription}">
    <meta property="og:title" content="${ogTitle}">
    <meta property="og:description" content="${ogDescription}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${currentUrl}">
    <meta property="og:image" content="${ogImage}">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; background-color: white; min-height: 100vh; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        header { text-align: center; margin-bottom: 40px; padding: 20px 0; border-bottom: 2px solid #0066cc; }
        .header-banner { background: linear-gradient(135deg, #0066cc 0%, #004499 100%); color: white; padding: 40px 20px; border-radius: 10px; margin-bottom: 20px; }
        .header-content h1 { font-size: 2.5em; margin-bottom: 10px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
        .subtitle { font-size: 1.2em; opacity: 0.9; }
        main { margin-bottom: 40px; }
        .article-meta { display: flex; gap: 20px; margin-bottom: 25px; font-size: 0.9em; color: #666; }
        .date, .category { background: #f8f9fa; padding: 5px 10px; border-radius: 15px; border: 1px solid #e9ecef; }
        article h2 { color: #0066cc; margin-bottom: 15px; font-size: 1.8em; border-left: 4px solid #0066cc; padding-left: 15px; }
        article h3 { color: #333; margin: 25px 0 15px 0; font-size: 1.4em; }
        article h4 { color: #0066cc; margin-bottom: 8px; font-size: 1.2em; }
        article p { margin-bottom: 15px; text-align: justify; line-height: 1.7; }
        .hospital-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin: 25px 0; }
        .hospital-item { background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 25px; border-radius: 10px; border-left: 4px solid #0066cc; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .hospital-item:hover { transform: translateY(-5px); box-shadow: 0 4px 15px rgba(0,0,0,0.15); }
        .hospital-icon { font-size: 2em; margin-bottom: 15px; text-align: center; }
        .highlight-box { background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); padding: 25px; border-radius: 10px; border-left: 4px solid #0066cc; margin: 30px 0; }
        .highlight-box h4 { color: #0066cc; margin-bottom: 15px; font-size: 1.3em; }
        .highlight-box ul { list-style: none; padding: 0; }
        .highlight-box li { padding: 8px 0; border-bottom: 1px solid rgba(0,102,204,0.1); position: relative; padding-left: 25px; }
        .highlight-box li:before { content: "✓"; color: #0066cc; font-weight: bold; position: absolute; left: 0; }
        .highlight-box li:last-child { border-bottom: none; }
        footer { text-align: center; padding: 20px 0; border-top: 1px solid #ddd; color: #666; background: #f8f9fa; margin-top: 40px; }
        @media (max-width: 768px) { 
            .container { padding: 10px; }
            .header-content h1 { font-size: 2em; }
            .hospital-grid { grid-template-columns: 1fr; }
            .article-meta { flex-direction: column; gap: 10px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="header-banner">
                <div class="header-content">
                    <h1>${ogTitle}</h1>
                    <p class="subtitle">Comprehensive healthcare services across Gujarat</p>
                </div>
            </div>
        </header>
        <main>
            <article>
                <div class="article-meta">
                    <span class="date">Published: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <span class="category">Healthcare</span>
                </div>
                <h2>Excellence in Healthcare</h2>
                <p>Gujarat has emerged as a leading state in providing world-class healthcare facilities. The state houses some of the most renowned hospitals that offer comprehensive medical services with cutting-edge technology and experienced medical professionals.</p>
                <h3>Advanced Medical Technology</h3>
                <p>These hospitals are equipped with state-of-the-art technology including advanced diagnostic equipment, robotic surgery systems, and modern ICU facilities. The integration of technology with healthcare has revolutionized patient care and treatment outcomes.</p>
                <h3>Leading Medical Institutions</h3>
                <p>The healthcare landscape in Gujarat is marked by institutions that have set benchmarks in medical excellence. These hospitals provide specialized care across various departments including cardiology, neurology, oncology, and emergency medicine.</p>
                <div class="hospital-grid">
                    <div class="hospital-item">
                        <div class="hospital-icon">🏥</div>
                        <h4>Advanced Cardiac Care</h4>
                        <p>Specialized cardiac treatment centers with cutting-edge equipment for heart surgeries and interventional procedures.</p>
                    </div>
                    <div class="hospital-item">
                        <div class="hospital-icon">🚑</div>
                        <h4>Emergency Services</h4>
                        <p>24/7 emergency medical services with rapid response teams and trauma care facilities.</p>
                    </div>
                    <div class="hospital-item">
                        <div class="hospital-icon">👨‍⚕️</div>
                        <h4>Specialized Treatments</h4>
                        <p>Multi-specialty hospitals offering comprehensive healthcare solutions with expert medical teams.</p>
                    </div>
                    <div class="hospital-item">
                        <div class="hospital-icon">🧬</div>
                        <h4>Research & Innovation</h4>
                        <p>Leading medical research facilities contributing to healthcare advancement and innovation.</p>
                    </div>
                </div>
                <h3>Expert Medical Professionals</h3>
                <p>The hospitals feature highly qualified doctors, nurses, and support staff who are committed to providing exceptional patient care. Regular training and development programs ensure they stay updated with the latest medical practices.</p>
                <h3>Quality Healthcare Access</h3>
                <p>These medical institutions continue to serve patients with dedication, ensuring accessible and affordable healthcare for all sections of society. Their commitment to excellence has made Gujarat a preferred destination for medical treatment.</p>
                <div class="highlight-box">
                    <h4>Key Features of Gujarat's Top Hospitals:</h4>
                    <ul>
                        <li>International standard facilities and equipment</li>
                        <li>Highly experienced medical professionals</li>
                        <li>Comprehensive range of medical specialties</li>
                        <li>Advanced diagnostic and treatment capabilities</li>
                        <li>Patient-centric approach to healthcare</li>
                        <li>Affordable and accessible medical services</li>
                    </ul>
                </div>
            </article>
        </main>
        <footer>
            <p>&copy; ${new Date().getFullYear()} Healthcare News Gujarat. All rights reserved.</p>
        </footer>
    </div>
</body>
</html>`;
    
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);
}

async function handleMetadataGet(req, res) {
    const metadata = await Metadata.getSingle();
    return res.json(metadata);
}
