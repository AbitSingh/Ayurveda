const express = require('express');
const router = express.Router();

router.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await fetch('https://minem-mb6qgu68-eastus2.cognitiveservices.azure.com/openai/deployments/o3-mini/chat/completions?api-version=2025-01-01-preview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': 'CSV544ei5KSBeT5qOpgwzq4D6pz7GmXLC1WVzz0hw8YDYPmkCS76JQQJ99BEACHYHv6XJ3w3AAAAACOGANIH'
      },
      body: JSON.stringify({
        messages,
        max_completion_tokens: 800
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Unknown error');
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: true, message: error.message });
  }
});

module.exports = router; 