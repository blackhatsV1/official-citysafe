const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const PAGES = [
    { name: 'visitor', path: '/visitor', mapSelectors: ['#map'] },
    { name: 'sos-otw', path: '/sos-otw', mapSelectors: ['#map'] },
    { name: 'login', path: '/login', mapSelectors: [] },
    { name: 'adminpage', path: '/adminpage', mapSelectors: ['#admin-map', '#map'] }
];

async function run() {
    if (!fs.existsSync(path.join(__dirname, '..', 'screenshots'))) fs.mkdirSync(path.join(__dirname, '..', 'screenshots'));
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    page.setViewport({ width: 1280, height: 900 });

    const results = [];

    for (const p of PAGES) {
        const url = 'http://localhost:9000' + p.path;
        console.log('Visiting', url);
        let resp = null;
        try {
            resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
        } catch (e) {
            console.warn('Navigation error for', url, e.message || e);
        }
        // give scripts a moment to render maps
        await new Promise(r => setTimeout(r, 1200));

        const html = await page.content();
        const foundLeaflet = /leaflet/.test(html) || /tile.openstreetmap.org/.test(html);

        // check map containers
        const mapChecks = [];
        for (const sel of p.mapSelectors) {
            const exists = await page.$(sel) !== null;
            let bbox = null;
            if (exists) {
                bbox = await page.evaluate((s) => {
                    const el = document.querySelector(s);
                    if (!el) return null;
                    const r = el.getBoundingClientRect();
                    return { w: Math.round(r.width), h: Math.round(r.height) };
                }, sel).catch(() => null);
            }
            mapChecks.push({ selector: sel, exists, bbox });
        }

        // count tile images
        const tileCount = await page.evaluate(() => {
            return Array.from(document.images).filter(i => /tile.openstreetmap.org|tile-cyclosm|tile.thunderforest/.test(i.src)).length;
        });

        const screenshotPath = path.join(__dirname, '..', 'screenshots', p.name + '.png');
        try { await page.screenshot({ path: screenshotPath, fullPage: true }); } catch (e) { console.warn('screenshot failed', e.message); }

        results.push({ page: p.path, status: resp ? resp.status() : 'no-response', foundLeaflet, tileCount, mapChecks, screenshot: screenshotPath });
        console.log('Result:', JSON.stringify(results[results.length - 1], null, 2));
    }

    await browser.close();
    // write report
    fs.writeFileSync(path.join(__dirname, '..', 'screenshots', 'report.json'), JSON.stringify(results, null, 2));
    console.log('Done. Screenshots and report saved to screenshots/');
}

run().catch(e => { console.error(e); process.exit(1); });
