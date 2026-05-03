import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Proxy route to fetch game content (bypassing CORS)
  app.get("/api/proxy", async (req, res) => {
    const url = req.query.url as string;
    if (!url) return res.status(400).send("URL is required");

    console.log(`[Proxy] Requesting: ${url}`);

    try {
      let targetUrl = url;
      
      // Handle Google Drive links to get raw content
      if (url.includes('drive.google.com')) {
        const idMatch = url.match(/\/d\/([^\/]+)/) || url.match(/id=([^\&]+)/);
        if (idMatch) {
          // Use the export=view or export=download appropriately
          targetUrl = `https://drive.google.com/uc?export=download&id=${idMatch[1]}`;
        }
      }

      // Check if URL is valid
      try {
        new URL(targetUrl);
      } catch (e) {
        return res.status(400).send("Invalid target URL");
      }

      // Add browser-like headers to bypass simple bot detection
      const defaultHeaders = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'identity',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'max-age=0',
        'Referer': 'https://www.google.com/'
      };

      const MAX_RETRIES = 2;
      let response: Response | null = null;
      let lastError: any = null;

      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout for large games

          response = await fetch(targetUrl, {
            headers: defaultHeaders,
            redirect: 'follow',
            signal: controller.signal
          });

          clearTimeout(timeoutId);
          
          if (response.ok) break;
          
          // If not OK, but not a network error, we might still want to retry for specific status codes (e.g. 503)
          if (response.status === 503 || response.status === 429) {
             if (attempt < MAX_RETRIES) {
               console.log(`[Proxy] Retry attempt ${attempt + 1} due to status ${response.status}`);
               await new Promise(r => setTimeout(r, 2000 * (attempt + 1))); // Wait a bit longer for retries
               continue;
             }
          }
          break; // Other status codes, don't retry
        } catch (fetchError: any) {
          lastError = fetchError;
          const isTimeout = fetchError.name === 'AbortError';
          // Check for ECONNRESET or other socket errors in cause or code
          const isConnReset = 
            fetchError.cause?.code === 'ECONNRESET' || 
            fetchError.code === 'ECONNRESET' || 
            fetchError.message?.includes('ECONNRESET');
          
          if (attempt < MAX_RETRIES && (isTimeout || isConnReset)) {
            console.log(`[Proxy] Retry attempt ${attempt + 1} for ${targetUrl} due to ${isTimeout ? 'Timeout' : 'Connection Reset'}`);
            await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
            continue;
          }
          break;
        }
      }

      const isTimeout = lastError?.name === 'AbortError' || lastError?.code === 'UND_ERR_CONNECT_TIMEOUT' || lastError?.name === 'ConnectTimeoutError';

      if (!response || !response.ok) {
        const status = isTimeout ? 504 : (response?.status || 500);
        const statusText = isTimeout ? "Gateway Timeout" : (response?.statusText || "Internal Server Error");
        
        if (isTimeout || lastError?.code === 'ECONNRESET' || status >= 500) {
          console.warn(`[Proxy] Target issue with ${targetUrl}: ${statusText} (${status})`);
        } else {
          console.error(`[Proxy] Fetch failed for ${targetUrl}: ${status} ${statusText}`);
        }
        
        return res.status(status).send(`Failed to fetch from target: ${statusText} (${status})`);
      }
      
      let contentType = response.headers.get('content-type') || 'text/html';
      let buffer = await response.arrayBuffer();

      // Handle Google Drive "large file" or security confirmation
      if (url.includes('drive.google.com')) {
        const contentText = new TextDecoder().decode(buffer.slice(0, 10000)); // Scan more for confirm=
        if (contentText.includes('confirm=')) {
          const confirmMatch = contentText.match(/confirm=([a-zA-Z0-9_]+)/);
          if (confirmMatch) {
            const separator = targetUrl.includes('?') ? '&' : '?';
            const confirmedUrl = `${targetUrl}${separator}confirm=${confirmMatch[1]}`;
            console.log(`[Proxy] Detected Google Drive confirmation. Retrying with: ${confirmedUrl}`);
            
            // Extract and pass cookies if present (crucial for confirm= links)
            const cookieHeader = response.headers.get('set-cookie');
            let cookies = '';
            if (cookieHeader) {
               // Get only the key=value part of each cookie
               cookies = cookieHeader.split(',').map(c => c.split(';')[0]).join('; ');
            }
            
            const confirmedResponse = await fetch(confirmedUrl, {
              headers: {
                ...defaultHeaders,
                ...(cookies ? { 'Cookie': cookies } : {})
              },
              redirect: 'follow'
            });
            
            if (confirmedResponse.ok) {
              buffer = await confirmedResponse.arrayBuffer();
              contentType = confirmedResponse.headers.get('content-type') || contentType;
            } else {
              console.warn(`[Proxy] Confirmation retry failed for ${confirmedUrl}: ${confirmedResponse.status}`);
            }
          }
        }
      }
      
      // Set correct content type
      res.setHeader('Content-Type', contentType);
      res.setHeader('Access-Control-Allow-Origin', '*'); 
      
      res.send(Buffer.from(buffer));
    } catch (error) {
      // Catch-all for truly critical server errors (syntax, etc)
      if (error instanceof Error && error.name === 'AbortError') return; // Handled
      console.error("[Proxy] Critical exception:", error);
      res.status(500).send(error instanceof Error ? `Proxy Error: ${error.message}` : "Internal Proxy Failure");
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "dist")));
    app.use(express.static(path.join(__dirname, "public")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
