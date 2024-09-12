// src/pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm } from "formidable";
import cloudinary from "../utils/cloudinary";

export const config = {
  api: {
    bodyParser: false, // Disable default body parser to use formidable
  },
};

const uploadHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = new IncomingForm(); // Correct usage of IncomingForm

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).json({ error: "Error parsing form data" });
    }

    // Check if files.file exists and is valid
    if (!files.file || (Array.isArray(files.file) && files.file.length === 0)) {
      console.error("No file uploaded or invalid file");
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    try {
      // Upload the file to Cloudinary
      const result = await cloudinary.uploader.upload(file.filepath);
      return res.status(200).json({ url: result.secure_url });
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return res.status(500).json({ error: "Upload to Cloudinary failed" });
    }
  });
};

export default uploadHandler;
