import fs from "node:fs";
import axios from "axios";
import FormData from "form-data";

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors({
  origin: 'https://dreamapp-e693c.ew.r.appspot.com/', // Replace with your Firebase Hosting URL
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
}));
app.use(express.json());

app.post('/dream', async (req, res) => {
  console.log('--POST');
  try {
    const { prompt } = req.body; // Get the prompt from the request body

    const formData = {
      prompt,
      output_format: 'webp',
    };

    const response = await axios.postForm(
      `https://api.stability.ai/v2beta/stable-image/generate/core`,
      axios.toFormData(formData, new FormData()),
      {
        validateStatus: undefined,
        responseType: 'arraybuffer',
        headers: {
          Authorization: `Bearer ` + process.env.STABILITYAI,
          Accept: 'image/*',
        },
      }
    );

    if (response.status === 200) {
      res.status(200).json(response.data);
    } else {
      throw new Error(`${response.status}: ${response.data.toString()}`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error?.response.data.error.message || 'Something went wrong');
  }
});

app.listen(8080, () => console.log('make art on http://localhost:8080/dream'));