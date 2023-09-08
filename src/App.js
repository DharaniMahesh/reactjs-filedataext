import React, { useState } from 'react';
import axios from 'axios';
import { Transformers } from '@xenova/transformers';
import { pipeline } from '@xenova/transformers';


const FileUploader = () => {
  const [extractedData, setExtractedData] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadinggpt, setLoadingG] = useState(false);
  const [loadingbert, setLoadingB] = useState(false);
  const [summarizedtext, setsummarizedtext] = useState("");

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Make an HTTP POST request using Axios
      const response = await axios.post('http://localhost:8080/file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setExtractedData(JSON.stringify(response.data));
    } catch (error) {
      console.error('Error extracting data:', error);
    }

  };

  const handleFileDelete = () => {
    setSelectedFile(null);
    document.getElementById('current-file').value = null;
    setExtractedData('');
    setsummarizedtext('');
  };

  
  // const configuration = new Configuration({
  //   organization: "org-NqObAniD7fXpYTGSh9S81wgo",
  //   apiKey: "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",
  // });
  // const openai = new OpenAIApi(configuration);

  const HandleSubmitgpt = async (e) => {
    setLoadingG(true);
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/gpt', { extractedData });
      const { summarizedText } = response.data;
      setLoadingG(false);
      setsummarizedtext(summarizedText);
    } catch (error) {
      console.error('Error getting summarized text:', error);
    }
  };

  
  const HandleSubmitbert = async (e) => {
    setLoadingB(true);
    e.preventDefault();
  
    try {
      // Make an Axios POST request to the Flask app
      const response = await axios.post('http://localhost:4000/bert', {
        extractedData: extractedData,
      });
  
      // Get the summarized text from the response
      const summary = response.data.summary;
  
      // Set the summarized text
      setsummarizedtext(summary);
      setLoadingB(false);
    } catch (error) {
      console.error('Error performing text summarization:', error);
    }
  };

  function generatePrompt(text) {
    return `Summarize this below extracted text and try to keep it short, detailed, and meaningful \n\n ${text}.`;
  }
  

  return (
    <center>
    <div>
      <input id="current-file" type="file" onChange={handleFileUpload} />
      {selectedFile && (
        <div>
          <p>Selected File: {selectedFile.name}</p>
          <button onClick={handleFileDelete}>Delete File</button>
        </div>
      )}
      <div className="text_form">
        <form>
          <h3>Enter your text</h3>
          <textarea
            rows={14}
            cols={80}
            placeholder="Put your text"
            value={extractedData}
            onChange={(e) => setExtractedData(e.target.value)}
          />
        </form>
      </div>
      <div>
        <button type="button" onClick={HandleSubmitgpt}>
          {loadinggpt ? "loading..." : "SummarizeGPT"}
        </button>
      </div>
      <div>
        <button type="button" onClick={HandleSubmitbert}>
          {loadingbert ? "loading..." : "SummarizeBERT"}
        </button>
      </div>
      <div className="summarized_text">
        <h3>Summarized text</h3>
        <textarea
          placeholder="Summarized text"
          cols={80}
          rows={14}
          value={summarizedtext}
          onChange={(e) => setsummarizedtext(e.target.value)}
        />
      </div>
    </div>
    </center>
  );
};

export default FileUploader;
