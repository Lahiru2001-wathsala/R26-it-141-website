// Lists uploaded files (GET) and deletes a file (DELETE, password required).
import { list, del } from "@vercel/blob";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const { blobs } = await list({ limit: 1000 });
      const files = blobs
        .filter(b => /^(documents|slides)\//.test(b.pathname))
        .map(b => ({
          pathname: b.pathname,
          url: b.url,
          downloadUrl: b.downloadUrl || b.url + "?download=1",
          size: b.size,
          uploadedAt: b.uploadedAt
        }));
      return res.status(200).json({ files });
    }
    if (req.method === "DELETE") {
      const { password, url } = req.body || {};
      if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ error: "Incorrect password" });
      }
      await del(url);
      return res.status(200).json({ deleted: url });
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
