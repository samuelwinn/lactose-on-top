export default async function handler(req: any, res: any) {
  const url = req.query.url as string;
  if (!url) return res.status(400).send("URL is required");

  try {
    let targetUrl = url;
    
    // Handle Google Drive links to get raw content
    if (url.includes('drive.google.com')) {
      const idMatch = url.match(/\/d\/([^\/]+)/);
      if (idMatch) {
        targetUrl = `https://drive.google.com/uc?export=download&id=${idMatch[1]}`;
      }
    }

    const response = await fetch(targetUrl);
    if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
    
    const content = await response.text();
    res.send(content);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).send("Failed to fetch game content");
  }
}
