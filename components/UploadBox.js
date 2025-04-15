import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';

export default function UploadBox() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState('');
  const [error, setError] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [assignmentId, setAssignmentId] = useState(null);
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gpt-3.5-turbo");
  const [modelUsed, setModelUsed] = useState(null);
  const analysisRef = useRef(null);
  const fileInputRef = useRef(null);

  // AI Models available for analysis
  const AI_MODELS = [
    {
      id: "gpt-3.5-turbo",
      name: "GPT-3.5 Turbo",
      description: "Fast and efficient for most assignments",
      free: true
    },
    {
      id: "gpt-4o",
      name: "GPT-4o (Latest)",
      description: "Most advanced with superior understanding",
      free: false
    },
    {
      id: "gpt-4",
      name: "GPT-4",
      description: "Strong reasoning capabilities",
      free: false
    }
  ];

  // Scroll to analysis when it's available
  useEffect(() => {
    if (analysis && analysisRef.current) {
      analysisRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [analysis]);

  const allowedFileTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const fileTypeNames = {
    'application/pdf': 'PDF',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX'
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file) => {
    setError('');
    
    if (!allowedFileTypes.includes(file.type)) {
      setError('Only PDF and DOCX files are allowed');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size should be less than 10MB');
      return;
    }
    
    setFile(file);
  };

  const openFileBrowser = () => {
    if (!file && !uploading) {
      fileInputRef.current?.click();
    }
  };

  const uploadFile = async () => {
    if (!file) return;
    
    setUploading(true);
    setUploadProgress(0);
    setError('');
    
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const storageRef = ref(storage, `assignments/${timestamp}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Track upload progress
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setUploadProgress(progress);
      },
      (error) => {
        // Handle upload errors
        setError('Upload failed: ' + error.message);
        setUploading(false);
      },
      async () => {
        // Upload completed successfully
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setDownloadURL(url);
        setUploading(false);
        
        // Process the file with OpenAI
        await processFile(url, file.name, file.type);
      }
    );
  };

  const processFile = async (fileUrl, fileName, fileType) => {
    try {
      setAnalyzing(true);
      
      // Step 1: Parse the file
      const parseResponse = await fetch('/api/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileUrl,
          fileType,
        }),
      });
      
      if (!parseResponse.ok) {
        const errorData = await parseResponse.json();
        throw new Error(errorData.error || 'Failed to parse file');
      }
      
      const parseData = await parseResponse.json();
      const { parsedText } = parseData;
      
      // Step 2: Send to OpenAI for analysis
      const openaiResponse = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parsedText,
          model: selectedModel
        }),
      });
      
      if (!openaiResponse.ok) {
        const errorData = await openaiResponse.json();
        throw new Error(errorData.error || 'Failed to analyze with OpenAI');
      }
      
      const openaiData = await openaiResponse.json();
      const { aiBreakdown, modelUsed: usedModel } = openaiData;
      
      // Store which model was actually used
      setModelUsed(usedModel);
      
      // Step 3: Save everything to MongoDB
      const saveResponse = await fetch('/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileUrl,
          fileName,
          parsedText,
          aiBreakdown,
          modelUsed: usedModel
        }),
      });
      
      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(errorData.error || 'Failed to save analysis');
      }
      
      const saveData = await saveResponse.json();
      
      console.log("Analysis completed and saved:", saveData);
      
      // Handle the case where storage failed but we still have the analysis
      if (saveData.storageFailed) {
        console.warn("Note: Analysis was generated but could not be saved to database:", saveData.error);
        setAnalysis(aiBreakdown);
        setShowFullAnalysis(true);
        // Show a warning to the user
        setError('Note: Your analysis was generated successfully, but could not be saved for later viewing. You may want to copy it now.');
      } else {
        setAnalysis(aiBreakdown);
        setShowFullAnalysis(true);
        
        if (saveData.assignmentId) {
          setAssignmentId(saveData.assignmentId);
        }
      }
    } catch (error) {
      console.error("Analysis error:", error);
      setError('Analysis failed: ' + error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setDownloadURL('');
    setUploadProgress(0);
    setError('');
    setAnalysis(null);
    setAssignmentId(null);
    setShowFullAnalysis(false);
  };

  const renderMarkdown = (markdown) => {
    if (!markdown) return null;
    
    // Enhanced markdown parsing with better styling
    let parsedMarkdown = markdown
      // Headings with more distinctive styling
      .replace(/# (.*)/g, '<h1 class="text-2xl font-bold text-primary mt-6 mb-4 pb-2 border-b border-primary/20">$1</h1>')
      .replace(/## (.*)/g, '<h2 class="text-xl font-bold text-secondary mt-5 mb-3">$1</h2>')
      .replace(/### (.*)/g, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      
      // Bold and italic text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      
      // Lists with better formatting
      .replace(/^\d+\.\s+(.*)/gm, '<li class="ml-5 mb-2 list-decimal">$1</li>') // Ordered lists
      .replace(/^- (.*)/gm, '<li class="ml-5 mb-2 list-disc">$1</li>') // Unordered lists
      
      // Blockquotes
      .replace(/^> (.*)/gm, '<blockquote class="pl-4 py-1 border-l-4 border-primary/30 bg-primary/5 rounded my-3 italic text-base-content/80">$1</blockquote>')
      
      // Code blocks and inline code
      .replace(/```([\s\S]*?)```/g, '<div class="bg-base-300 p-3 rounded-lg font-mono text-sm my-3 overflow-x-auto">$1</div>')
      .replace(/`([^`]+)`/g, '<code class="bg-base-300 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary underline hover:text-primary-focus" target="_blank">$1</a>')
      
      // Paragraphs and spacing
      .replace(/\n\n/g, '</p><p class="mb-4">')
      
      // Tables (simple support)
      .replace(/\|(.+)\|/g, '<tr><td>$1</td></tr>')
      .replace(/<tr><td>(.+)\|(.+)<\/td><\/tr>/g, '<tr><td>$1</td><td>$2</td></tr>');
    
    // Wrap lists in appropriate container
    parsedMarkdown = parsedMarkdown
      .replace(/<li class="ml-5 mb-2 list-disc">/g, '<ul class="list-disc my-3 space-y-1"><li class="ml-5 mb-2">')
      .replace(/<li class="ml-5 mb-2 list-decimal">/g, '<ol class="list-decimal my-3 space-y-1"><li class="ml-5 mb-2">')
      .replace(/<\/li>\s*(?!<li|<\/ul|<\/ol)/g, '</li></ul>')
      .replace(/<\/li>\s*(?!<li|<\/ul|<\/ol)/g, '</li></ol>');
    
    // Wrap in paragraph if not starting with a block element
    if (!parsedMarkdown.startsWith('<h1') && 
        !parsedMarkdown.startsWith('<h2') && 
        !parsedMarkdown.startsWith('<ul') && 
        !parsedMarkdown.startsWith('<ol') && 
        !parsedMarkdown.startsWith('<blockquote')) {
      parsedMarkdown = '<p class="mb-4">' + parsedMarkdown;
    }
    
    // Ensure it ends with closing paragraph if needed
    if (!parsedMarkdown.endsWith('</p>') && 
        !parsedMarkdown.endsWith('</ul>') && 
        !parsedMarkdown.endsWith('</ol>') && 
        !parsedMarkdown.endsWith('</blockquote>')) {
      parsedMarkdown = parsedMarkdown + '</p>';
    }
    
    return <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: parsedMarkdown }} />;
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 py-10">
      {!downloadURL ? (
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary inline-block text-transparent bg-clip-text">
            Break Down Your Assignment
          </h1>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Upload your assignment and our AI will analyze it, break it down into manageable tasks, and help you tackle it efficiently.
          </p>
        </div>
      ) : null}
      
      {!downloadURL ? (
        <div 
          className={`border-2 border-dashed rounded-2xl p-10 text-center shadow-lg bg-base-100 transition-all duration-300 ${
            dragging ? 'border-secondary bg-secondary/5 scale-[1.02]' : 'border-primary/20 hover:border-primary/40'
          } ${!file ? 'cursor-pointer hover:shadow-xl' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileBrowser}
        >
          <input
            type="file"
            className="hidden"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          
          {!file ? (
            <div className="max-w-md mx-auto">
              <div className="mb-8">
                <div className="relative w-24 h-24 mx-auto">
                  <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-25"></div>
                  <div className="relative flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full">
                    <span className="text-4xl">📄</span>
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-3">
                {dragging ? 'Drop your file here' : 'Upload your assignment'}
              </h2>
              <p className="text-base-content/70 mb-6 text-lg">
                <span className="font-medium">Drag and drop</span> or 
                <button 
                  className="text-primary font-bold ml-1 hover:underline focus:outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  browse files
                </button>
              </p>
              
              <div className="mb-8">
                <label className="text-sm font-medium mb-3 block text-base-content/80">Select AI Model for Analysis:</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  {AI_MODELS.map((model) => (
                    <div 
                      key={model.id}
                      className={`border rounded-xl p-4 cursor-pointer transition-all ${
                        selectedModel === model.id 
                          ? 'border-primary bg-primary/5 shadow-md' 
                          : 'border-base-200 hover:border-primary/30 hover:bg-base-100'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedModel(model.id);
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold">{model.name}</span>
                        {model.free ? (
                          <span className="badge badge-sm badge-success">Free</span>
                        ) : (
                          <span className="badge badge-sm badge-secondary">Premium</span>
                        )}
                      </div>
                      <p className="text-xs text-base-content/70">{model.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center gap-3 mb-4">
                <div className="badge badge-outline badge-lg px-4 py-3">PDF</div>
                <div className="badge badge-outline badge-lg px-4 py-3">DOCX</div>
                <div className="badge badge-outline badge-lg px-4 py-3">Max 10MB</div>
              </div>
              <p className="text-sm text-base-content/60">
                We'll help you break down your assignment into manageable chunks
              </p>
            </div>
          ) : (
            <div onClick={(e) => e.stopPropagation()} className="max-w-md mx-auto">
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-3xl">📋</span>
                </div>
              </div>
              <h2 className="text-xl font-bold mb-4">Ready to analyze your assignment</h2>
              <div className="bg-base-200/70 rounded-xl p-4 mb-6 border border-base-300 flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-sm text-base-content/60">{fileTypeNames[file.type] || 'Document'} • {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-success animate-pulse"></span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-2">
                <button 
                  className="btn btn-primary btn-lg rounded-xl relative overflow-hidden group"
                  onClick={uploadFile}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <span className="loading loading-spinner loading-sm mr-2"></span>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span className="relative z-10">Analyze Assignment</span>
                      <span className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    </>
                  )}
                </button>
                <button 
                  className="btn btn-outline btn-lg rounded-xl"
                  onClick={resetUpload}
                  disabled={uploading}
                >
                  Cancel
                </button>
              </div>
              
              {uploading && (
                <div className="w-full mt-6">
                  <div className="flex justify-between text-sm text-base-content/60 mb-1">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-base-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {error && (
            <div 
              className="mt-5 text-error text-sm bg-error/10 p-4 rounded-xl border border-error/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-error" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <div className={`rounded-2xl shadow-lg bg-gradient-to-br from-success/10 to-success/5 border border-success/30 p-8 ${analyzing ? '' : 'rounded-b-none'}`}>
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto bg-success/20 rounded-full flex items-center justify-center">
                <span className="text-3xl">{analyzing ? '⏱️' : '🎉'}</span>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mb-4 text-success">
              {analyzing ? 'Analyzing Your Assignment...' : 'Analysis Complete!'}
            </h2>
            
            {analyzing ? (
              <div className="mt-8 mb-6 max-w-lg mx-auto">
                <div className="flex items-center justify-center gap-4 mb-5">
                  <div className="w-10 h-10 rounded-full border-4 border-t-primary border-primary/30 animate-spin"></div>
                  <p className="text-base-content/80 text-lg font-medium">
                    Breaking down your assignment...
                  </p>
                </div>
                <div className="w-full h-2 bg-base-200 rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-gradient-to-r from-primary to-secondary animate-pulse w-[70%]"></div>
                </div>
                <div className="flex justify-between items-center text-sm text-base-content/60">
                  <span>Please wait, this may take up to 1-2 minutes</span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 bg-primary rounded-full animate-ping"></span>
                    AI working
                  </span>
                </div>
              </div>
            ) : (
              <p className="mb-8 text-base-content/80 text-lg max-w-2xl mx-auto">
                {analysis ? 'Your assignment has been analyzed and broken down into manageable parts!' : 
                'Your assignment is now being analyzed. We\'ll break it down into manageable parts for you.'}
              </p>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl mx-auto">
              <a 
                href={downloadURL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-outline btn-success rounded-xl shadow-sm flex items-center gap-2 hover:shadow-md transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Original File
              </a>
              
              {!analyzing && analysis && (
                <>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(analysis);
                      alert("Analysis copied to clipboard!");
                    }}
                    className="btn btn-outline rounded-xl flex items-center gap-2 hover:shadow-md transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Copy to Clipboard
                  </button>
                  
                  {assignmentId && (
                    <button
                      onClick={() => router.push(`/results/${assignmentId}`)}
                      className="btn btn-primary rounded-xl flex items-center gap-2 hover:shadow-md transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Full Results Page
                    </button>
                  )}
                </>
              )}
              
              <button 
                onClick={resetUpload}
                className="btn btn-ghost rounded-xl flex items-center gap-2 hover:shadow-md transition-all"
                disabled={analyzing}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload Another
              </button>
            </div>
          </div>
          
          {!analyzing && analysis && (
            <div className={`bg-base-100 rounded-2xl rounded-t-none border-x border-b border-base-300 shadow-2xl overflow-hidden ${showFullAnalysis ? 'block' : 'hidden'}`}>
              <div 
                onClick={() => setShowFullAnalysis(!showFullAnalysis)}
                className="flex justify-center items-center py-2 cursor-pointer bg-base-200/50 hover:bg-base-200/80 transition-colors"
              >
                <span className="mr-2 text-base-content/60">{showFullAnalysis ? "Hide analysis" : "Show analysis"}</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 transform transition-transform duration-300 ${showFullAnalysis ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              <div ref={analysisRef} className="p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary inline-block text-transparent bg-clip-text flex items-center gap-2">
                    <span>🧠</span> Assignment Breakdown
                  </h2>
                  <div className="flex items-center gap-3">
                    {modelUsed && (
                      <div className="flex items-center gap-2 bg-base-200 px-4 py-2 rounded-full">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        <span className="text-sm">Analyzed with <span className="font-bold">{modelUsed}</span></span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="card bg-gradient-to-br from-base-100 to-base-200/30 shadow-md border border-base-200 rounded-xl overflow-hidden">
                    <div className="text-center p-4">
                      <div className="w-12 h-12 rounded-full mx-auto mb-2 bg-primary/10 flex items-center justify-center">
                        <span className="text-xl">⏱️</span>
                      </div>
                      <h3 className="font-bold text-base-content/80 mb-1 text-sm">Time Estimate</h3>
                      <div className="text-xl font-bold text-primary">
                        {analysis.includes("hour") ? 
                          analysis.match(/(\d+[-\d\s]*(?:to\s*)?(?:hours|hour))/i)?.[0] || "1-2 hours" : 
                          "1-2 hours"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="card bg-gradient-to-br from-base-100 to-base-200/30 shadow-md border border-base-200 rounded-xl overflow-hidden">
                    <div className="text-center p-4">
                      <div className="w-12 h-12 rounded-full mx-auto mb-2 bg-secondary/10 flex items-center justify-center">
                        <span className="text-xl">📝</span>
                      </div>
                      <h3 className="font-bold text-base-content/80 mb-1 text-sm">Assignment Type</h3>
                      <div className="text-xl font-medium">
                        {analysis.toLowerCase().includes("essay") ? "Essay" : 
                         analysis.toLowerCase().includes("report") ? "Report" : 
                         analysis.toLowerCase().includes("research") ? "Research" : 
                         analysis.toLowerCase().includes("question") ? "Questions" : 
                         "General Assignment"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="card bg-gradient-to-br from-base-100 to-base-200/30 shadow-md border border-base-200 rounded-xl overflow-hidden">
                    <div className="text-center p-4">
                      <div className="w-12 h-12 rounded-full mx-auto mb-2 bg-accent/10 flex items-center justify-center">
                        <span className="text-xl">🏆</span>
                      </div>
                      <h3 className="font-bold text-base-content/80 mb-1 text-sm">Difficulty</h3>
                      <div className="text-xl font-medium">
                        {analysis.toLowerCase().includes("complex") || analysis.toLowerCase().includes("challenging") ? 
                          "Challenging" : analysis.toLowerCase().includes("easy") ? 
                          "Easy" : "Moderate"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="card bg-gradient-to-br from-base-100 to-base-200/30 shadow-md border border-base-200 rounded-xl overflow-hidden">
                    <div className="text-center p-4">
                      <div className="w-12 h-12 rounded-full mx-auto mb-2 bg-success/10 flex items-center justify-center">
                        <span className="text-xl">📚</span>
                      </div>
                      <h3 className="font-bold text-base-content/80 mb-1 text-sm">Resources</h3>
                      <div className="text-xl font-medium">
                        {(() => {
                          const resources = (analysis.match(/reference|source|cite|book|article|journal|website/gi) || []).length;
                          return resources > 0 ? `${resources}+ suggested` : "Check breakdown";
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="card bg-base-100 shadow-md border border-base-200 rounded-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-primary/10 via-base-200/50 to-base-100 p-4 border-b border-base-200">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                      </svg>
                      Detailed Breakdown
                    </h3>
                  </div>
                  <div className="card-body p-6">
                    <div className="overflow-auto max-h-[600px] pr-2 custom-scrollbar">
                      {renderMarkdown(analysis)}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 justify-center mt-10 mb-6">
                  <div className="badge badge-lg p-4 badge-primary gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Save Time
                  </div>
                  <div className="badge badge-lg p-4 badge-secondary gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Study Efficiently
                  </div>
                  <div className="badge badge-lg p-4 badge-accent gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Get Better Grades
                  </div>
                </div>
                
                <div className="text-center mt-8">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(analysis);
                      alert("Analysis copied to clipboard!");
                    }}
                    className="btn btn-outline btn-sm gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Copy Analysis
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Add custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #999;
        }
      `}</style>
    </div>
  );
} 