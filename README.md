# R26-IT-141 Project Website

Website for the SLIIT research project
**Machine Learning Based Student Performance Prediction System**.
Static HTML, CSS and JavaScript, with two small Vercel functions for uploading files.

## Folder structure

```
r26-it-141-website/
├── index.html          all page sections and the team upload panel
├── css/style.css       design and layout
├── js/main.js          milestones, documents, slides, upload logic (edit content at the top)
├── api/upload.js       Vercel function: gives an upload token after checking the password
├── api/files.js        Vercel function: lists and deletes uploaded files
├── package.json        dependency for the Vercel functions (@vercel/blob)
├── assets/images/      diagrams, favicon, team photos
├── documents/          optional static PDFs
└── slides/             optional static slide PDFs
```

## Run locally
Open with VS Code Live Server. Viewing works locally; uploading works only on Vercel.

## Enable uploads on Vercel
1. Vercel project → Storage → Create → Blob → connect it to this project.
2. Settings → Environment Variables → add `ADMIN_PASSWORD` (team password).
3. Deployments → Redeploy.
4. On the live site: footer → Team upload.

## Course web (HTML/CSS only)
The api folder does nothing there. Put PDFs in /documents and /slides and set
"link" in js/main.js so the View and Download buttons work.
