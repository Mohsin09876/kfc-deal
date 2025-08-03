import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const filePath = path.join(process.cwd(), 'latest.json');
    const data = JSON.stringify(req.body, null, 2);

    fs.writeFile(filePath, data, (err) => {
      if (err) {
        return res.status(500).json({ status: 'error', message: err.message });
      }
      res.status(200).json({ status: 'saved' });
    });
  } else {
    res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
  }
}
