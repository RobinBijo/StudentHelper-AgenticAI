const express = require('express');
const cors = require('cors');
const path = require('path');
const mySecret = process.env.GROQ_API_KEY;
const app = express();
app.use(cors());
app.use(express.json());
// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve index.html on root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.post('/generate', async (req, res) => {
  const userPrompt = req.body.prompt;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mySecret}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: userPrompt }]
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
  console.error('Groq API error:', data);
  return res.status(500).json({ error: 'Groq API error: ' + (data.error?.message || 'Unknown error') });
}


    res.json({ content: data.choices[0].message.content });

  } catch (err) {
    console.error('Groq API call failed:', err);
    res.status(500).send('Error contacting Groq API');
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
