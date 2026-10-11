// Issues a short-lived upload token so the browser can upload a file
// directly to Vercel Blob storage. Only works with the correct ADMIN_PASSWORD.
import { handleUpload } from "@vercel/blob/client";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/msword",
  "application/vnd.ms-powerpoint"
];

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const json = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const { password } = JSON.parse(clientPayload || "{}");
        if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
          throw new Error("Incorrect password");
        }
        if (!/^(documents|slides)\//.test(pathname)) throw new Error("Invalid folder");
        return {
          allowedContentTypes: ALLOWED_TYPES,
          maximumSizeInBytes: 25 * 1024 * 1024,
          addRandomSuffix: true
        };
      },
      onUploadCompleted: async () => {}
    });
    return res.status(200).json(json);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}
