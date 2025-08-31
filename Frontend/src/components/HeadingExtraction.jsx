import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Upload, FileText, AlertCircle, CheckCircle, Loader2,
  ExternalLink, ChevronDown, PlusCircle, X, BookOpen,
  MessageCircle, FileUp, FileCheck2, ListTree, FileX2,
  BrainCircuit, Clock, MapPin, Search, Bot,
} from "lucide-react";

// --- Placeholder for Chatbot ---
import FloatingChatbot from "./FloatingChatbot";

// A modern, professional, three-panel UI for a PDF Document Analyzer

// =================================================================================
// 1. SUB-COMPONENTS for a cleaner structure
// =================================================================================

/**
 * Left Panel: Handles file uploads and listing.
 */
const FileUploaderPanel = ({ files, isLoading, onAddFiles, onRemoveFile, onProcess }) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type === "application/pdf");
      onAddFiles(droppedFiles);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      onAddFiles(Array.from(e.target.files));
      e.target.value = null; // Reset input
    }
  };

  return (
    <aside className="w-full lg:w-[380px] flex-shrink-0 bg-white border-r border-slate-200 flex flex-col h-screen">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ListTree className="w-7 h-7 text-indigo-600" />
          <h1 className="text-xl font-bold text-slate-800">DocAnalyzer</h1>
        </div>
      </div>

      <div className="p-4 flex-grow overflow-y-auto">
        <div
          className={`relative p-6 border-2 border-dashed rounded-lg transition-all duration-300 ${dragActive ? "border-indigo-500 bg-indigo-50" : "border-slate-300 hover:border-slate-400"}`}
          onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
        >
          <input ref={fileInputRef} type="file" accept="application/pdf" multiple onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          <div className="flex flex-col items-center pointer-events-none text-center">
            <FileUp className={`w-10 h-10 mb-3 transition-colors ${dragActive ? "text-indigo-600" : "text-slate-400"}`} />
            <p className="text-base font-semibold text-slate-700">
              Drag & drop PDFs or <span className="text-indigo-600 font-bold">browse</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">Add multiple documents to analyze</p>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Document Queue ({files.length})
            </h3>
            <div className="space-y-2">
              {files.map(file => (
                <div key={file.name} className="flex items-center p-2 bg-slate-50 rounded-md border border-slate-200/80">
                  <FileText className="w-5 h-5 text-red-500 flex-shrink-0 mr-3" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-800 truncate text-sm">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button onClick={() => onRemoveFile(file.name)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-slate-200 ml-2" title="Remove">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
             <button onClick={() => fileInputRef.current?.click()} className="w-full mt-3 flex items-center justify-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-semibold p-2 rounded-md hover:bg-indigo-50 transition-colors">
                <PlusCircle className="w-4 h-4" />
                <span>Add More Files</span>
             </button>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-200 flex-shrink-0">
        <button
          onClick={onProcess}
          disabled={files.length === 0 || isLoading}
          className="w-full h-11 px-6 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 text-base shadow-lg shadow-indigo-500/30 hover:shadow-md"
        >
          {isLoading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /><span>Analyzing...</span></>
          ) : (
            <><FileCheck2 className="w-5 h-5" /><span>Generate Outlines</span></>
          )}
        </button>
      </div>
    </aside>
  );
};


/**
 * Center Panel: Displays results or a welcome/empty state.
 */
const ResultsPanel = ({ isLoading, results, onHeadingClick }) => {
  const [expandedDocs, setExpandedDocs] = useState({});

  useEffect(() => {
    // Auto-expand all docs when new results come in
    const initialExpandedState = {};
    results.forEach(doc => {
      initialExpandedState[doc.filename] = true;
    });
    setExpandedDocs(initialExpandedState);
  }, [results]);

  const toggleExpand = (filename) => {
    setExpandedDocs(prev => ({ ...prev, [filename]: !prev[filename] }));
  };

  const getIndentLevelClass = (levelStr) => {
    if (typeof levelStr !== "string") return "pl-0";
    const level = parseInt(levelStr.replace("H", ""), 10);
    return `pl-${(level - 1) * 4 + 3}`;
  };

  const getHeadingTextStyle = (levelStr) => {
    const level = parseInt((levelStr || "H3").replace("H", ""), 10);
    if (level === 1) return "text-slate-800 font-semibold";
    if (level === 2) return "text-slate-700 font-medium";
    return "text-slate-600";
  };
  
  // Skeleton Loader for when analysis is in progress
  if (isLoading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-slate-100 p-4 rounded-lg">
            <div className="h-6 w-3/4 bg-slate-200 rounded-md mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 w-5/6 bg-slate-200 rounded-md"></div>
              <div className="h-4 w-4/6 bg-slate-200 rounded-md ml-4"></div>
              <div className="h-4 w-5/6 bg-slate-200 rounded-md"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Welcome / Empty state
  if (results.length === 0) {
    return (
      <div className="text-center p-10 flex flex-col items-center justify-center h-full">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-5 border-4 border-slate-200">
          <FileCheck2 className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Outline Your Documents</h2>
        <p className="text-slate-500 mt-2 max-w-sm mx-auto">
          Add PDFs to the queue, click "Generate Outlines," and the extracted table of contents will appear here.
        </p>
      </div>
    );
  }
  
  // Display results
  return (
    <div className="p-6 space-y-4 overflow-y-auto">
      {results.map((doc, idx) => (
        <div key={idx} className="bg-white rounded-xl border border-slate-200/80 shadow-sm transition-all duration-300">
          <button onClick={() => toggleExpand(doc.filename)} className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50/70 rounded-t-xl">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-800 truncate text-lg">{doc.filename}</h3>
              <p className="text-sm text-slate-500 mt-1">{doc.outline?.outline?.length || 0} headings found</p>
            </div>
            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expandedDocs[doc.filename] ? "rotate-180" : ""}`} />
          </button>

          {expandedDocs[doc.filename] && (
            <div className="px-4 pb-4 border-t border-slate-200">
              {doc.outline?.outline?.length > 0 ? (
                <div className="pt-3 space-y-0.5">
                  {doc.outline.outline.map((heading, hIdx) => (
                    <button
                      key={hIdx}
                      onClick={() => onHeadingClick(doc, heading)}
                      className={`w-full flex items-start text-left py-2 px-3 rounded-md hover:bg-indigo-50 transition-colors group ${getIndentLevelClass(heading.level)}`}
                    >
                      <span className={`flex-1 text-sm ${getHeadingTextStyle(heading.level)} group-hover:text-indigo-700`}>{heading.text}</span>
                      <span className="ml-4 text-xs text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded-sm">P.{heading.page + 1}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <FileX2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm font-medium">No structured headings found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};


/**
 * Right Panel: Shows PDF viewer and analysis tools.
 */
const ViewerPanel = ({ 
  selectedPdf, 
  isAdobeLoaded, 
  onClose, 
  pdfViewerRef,
  snippetState,
  onFindSimilarSnippets,
  onNavigateToSnippet,
}) => {
  const { selectedText, similarSnippets, isSearching, error } = snippetState;

  if (!selectedPdf) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-50/50 p-8">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700">Document Viewer</h3>
          <p className="text-slate-500 mt-2 max-w-xs mx-auto">
            Select a heading from an outline to preview the document here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Viewer Header */}
      <div className="p-2 border-b border-slate-200 flex items-center justify-between flex-shrink-0 bg-slate-50/80">
        <p className="text-sm font-medium text-slate-700 truncate px-2">{selectedPdf.file.name}</p>
        <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-200">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* PDF Viewer Area */}
      <div className="flex-1 bg-slate-100 min-h-0 relative">
        <div id="adobe-pdf-viewer" ref={pdfViewerRef} className="w-full h-full" />
        {!isAdobeLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100/80 backdrop-blur-sm">
            <div className="text-center text-slate-600">
              <Loader2 className="mx-auto h-8 w-8 text-indigo-600 mb-3 animate-spin" />
              <p className="font-medium">Loading PDF Viewer...</p>
            </div>
          </div>
        )}
      </div>

      {/* Snippet Analysis Footer */}
      <div className="flex-shrink-0 border-t border-slate-200 bg-white">
        <div className="p-3">
          <button onClick={onFindSimilarSnippets} disabled={isSearching} className="w-full bg-indigo-50 text-indigo-700 py-2.5 rounded-lg font-semibold text-sm hover:bg-indigo-100 disabled:bg-slate-200 disabled:text-slate-500 flex items-center justify-center gap-2 transition-all">
            {isSearching ? (
              <><Clock className="h-4 w-4 animate-spin" /> Searching...</>
            ) : (
              <><BrainCircuit className="h-4 w-4" /> Find Similar Snippets from Selected Text</>
            )}
          </button>
        </div>
        
        {(error || similarSnippets) && (
          <div className="p-3 border-t border-slate-200 max-h-64 overflow-y-auto">
            <h4 className="text-sm font-bold text-slate-600 mb-2 uppercase tracking-wider">Analysis Results</h4>
            {error && <p className="text-red-600 text-sm p-2 bg-red-50 rounded-md">{error}</p>}
            {similarSnippets?.data?.snippets && (
              <div className="space-y-2">
                {similarSnippets.data.snippets.length > 0 ? (
                  similarSnippets.data.snippets.map((snippet, index) => (
                    <div key={index} className="p-3 bg-slate-50 border border-slate-200 rounded-md text-sm">
                      <p className="text-slate-800 mb-2 italic">"{snippet.text}"</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium truncate" title={snippet.document}>{snippet.document}</span>
                        <button onClick={() => onNavigateToSnippet(snippet.document, snippet.page_number)} className="flex items-center font-semibold text-indigo-600 hover:underline flex-shrink-0 ml-2">
                          <MapPin className="h-3 w-3 mr-1" />Page {snippet.page_number}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 p-2">No semantically similar snippets found.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


// =================================================================================
// 2. MAIN COMPONENT: Manages state and orchestrates the UI
// =================================================================================

const HeadingExtraction = () => {
  // --- STATE AND REFS ---
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState(""); // For global notifications/toasts
  const [isLoading, setIsLoading] = useState(false);
  const [pdfUrls, setPdfUrls] = useState({});
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [isAdobeLoaded, setIsAdobeLoaded] = useState(false);
  const [highlightAnnotationId, setHighlightAnnotationId] = useState(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  
  const [snippetState, setSnippetState] = useState({
    selectedText: '',
    similarSnippets: null,
    isSearching: false,
    error: '',
  });

  const pdfViewerRef = useRef(null);
  const adobeApiRef = useRef(null);
  
  const ADOBE_CLIENT_ID = import.meta.env.VITE_ADOBE_CLIENT_ID_LH;
  // const ADOBE_CLIENT_ID = import.meta.env.VITE_ADOBE_CLIENT_ID_PROD;

  // --- EFFECTS ---
  useEffect(() => {
    // Load Adobe PDF Embed API
    const script = document.createElement("script");
    script.src = "https://documentservices.adobe.com/view-sdk/viewer.js";
    script.onload = () => setIsAdobeLoaded(true);
    script.onerror = () => console.error("Failed to load Adobe PDF Embed API");
    document.head.appendChild(script);

    return () => { // Cleanup script on component unmount
        document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    // Clean up object URLs when component unmounts or files change
    return () => {
      Object.values(pdfUrls).forEach(URL.revokeObjectURL);
    };
  }, [pdfUrls]);

  const initializeAdobeViewer = useCallback((file, targetPage = 1) => {
    if (!isAdobeLoaded || !window.AdobeDC || !file || !pdfViewerRef.current) return;
    
    pdfViewerRef.current.innerHTML = ""; // Clear previous instance

    const adobeDCView = new window.AdobeDC.View({ clientId: ADOBE_CLIENT_ID, divId: pdfViewerRef.current.id });
    const previewFilePromise = adobeDCView.previewFile(
      {
        content: { promise: file.arrayBuffer() },
        metaData: { fileName: file.name },
      },
      {
        embedMode: "SIZED_CONTAINER",
        showAnnotationTools: true,
        showLeftHandPanel: false,
        defaultViewMode: "FIT_PAGE",
      }
    );

    previewFilePromise.then(adobeViewer => {
      adobeApiRef.current = adobeViewer;
      adobeViewer.getAPIs().then(apis => apis.gotoLocation(targetPage));
    }).catch(e => console.error("Adobe Viewer Error:", e));
  }, [isAdobeLoaded, ADOBE_CLIENT_ID]);

  useEffect(() => {
    if (selectedPdf && isAdobeLoaded) {
      initializeAdobeViewer(selectedPdf.file, selectedPdf.targetPage);
    } else if (!selectedPdf && pdfViewerRef.current) {
      pdfViewerRef.current.innerHTML = "";
      adobeApiRef.current = null;
    }
  }, [selectedPdf, isAdobeLoaded, initializeAdobeViewer]);


  // --- CORE HANDLERS ---
  const addFilesToList = (newFiles) => {
    const uniqueNewFiles = newFiles.filter(nf => !files.some(ef => ef.name === nf.name));
    if (uniqueNewFiles.length === 0) return;

    const updatedFiles = [...files, ...uniqueNewFiles];
    setFiles(updatedFiles);
    window.dispatchEvent(new CustomEvent("filesUpdated", { detail: { files: updatedFiles } }));

    const newUrls = {};
    uniqueNewFiles.forEach(file => {
      newUrls[file.name] = URL.createObjectURL(file);
    });
    setPdfUrls(prev => ({ ...prev, ...newUrls }));
  };

  const handleRemoveFile = (fileName) => {
    URL.revokeObjectURL(pdfUrls[fileName]);
    
    const updatedFiles = files.filter(f => f.name !== fileName);
    setFiles(updatedFiles);
    window.dispatchEvent(new CustomEvent("filesUpdated", { detail: { files: updatedFiles } }));

    setPdfUrls(prev => {
      const newUrls = { ...prev };
      delete newUrls[fileName];
      return newUrls;
    });
    setResults(prev => prev.filter(r => r.filename !== fileName));
    if (selectedPdf?.file.name === fileName) setSelectedPdf(null);
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    
    setIsLoading(true);
    setResults([]); // Clear previous results
    setSelectedPdf(null);
    setMessage("Processing documents...");

    const formData = new FormData();
    files.forEach(file => formData.append("files", file));

    try {
      // const response = await fetch("https://arijeey-10-pdf-analyze-backend.hf.space/api/pdf-outline", {
      const response = await fetch("http://localhost:8000/api/pdf-outline", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Analysis failed");
      }
      const newData = await response.json();
      setResults(Array.isArray(newData) ? newData : []);
      setMessage("Analysis complete!");
    } catch (error) {
      console.error("Upload error:", error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleHeadingClick = async (doc, heading) => {
    const file = files.find(f => f.name === doc.filename);
    if (!file) return;

    setSelectedPdf({ file, targetPage: heading.page + 1 });

    // Highlight logic
    setTimeout(async () => {
      if (!adobeApiRef.current) return;
      try {
        const apis = await adobeApiRef.current.getAPIs();
        if (highlightAnnotationId) {
          await apis.removeAnnotations([highlightAnnotationId]);
          setHighlightAnnotationId(null);
        }
        
        const searchResults = await apis.search(heading.text);
        const resultOnPage = searchResults.find(r => r.page_num === heading.page + 1);

        if (resultOnPage?.quads.length > 0) {
          const [newAnnotation] = await apis.addAnnotations([{
            type: "HIGHLIGHT",
            page: heading.page + 1,
            quadPoints: resultOnPage.quads[0],
            color: [255, 215, 0], // Yellow
            opacity: 0.5,
          }]);
          setHighlightAnnotationId(newAnnotation.id);
        }
      } catch (error) {
        console.error("Highlighting error:", error);
      }
    }, 500); // Delay to allow viewer to load
  };

  const handleFindSimilarSnippets = async () => {
    if (!adobeApiRef.current || !selectedPdf) return;
    
    setSnippetState(s => ({ ...s, isSearching: true, error: '', similarSnippets: null }));

    try {
      const apis = await adobeApiRef.current.getAPIs();
      const selection = await apis.getSelectedContent();
      const capturedText = selection?.data;

      if (!capturedText) {
        throw new Error("Please select some text from the PDF first.");
      }

      setSnippetState(s => ({ ...s, selectedText: capturedText }));

      const formData = new FormData();
      formData.append("query_text", capturedText);
      formData.append("current_document_name", selectedPdf.file.name);
      files.forEach(file => formData.append("files", file));

      // const response = await fetch("https://arijeey-10-pdf-analyze-backend.hf.space/semantic/find-similar-snippets", {
      const response = await fetch("http://localhost:8000/semantic/find-similar-snippets", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Snippet search failed");
      }

      const data = await response.json();
      setSnippetState(s => ({ ...s, similarSnippets: data }));
    } catch (error) {
      setSnippetState(s => ({ ...s, error: error.message }));
    } finally {
      setSnippetState(s => ({ ...s, isSearching: false }));
    }
  };

  const handleNavigateToSnippet = (docName, pageNumber) => {
    const fileToLoad = files.find(f => f.name === docName);
    if (fileToLoad) {
      setSelectedPdf({ file: fileToLoad, targetPage: pageNumber });
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans antialiased">
      {/* --- LEFT PANEL --- */}
      <FileUploaderPanel 
        files={files}
        isLoading={isLoading}
        onAddFiles={addFilesToList}
        onRemoveFile={handleRemoveFile}
        onProcess={handleProcess}
      />
      
      {/* --- CENTER PANEL --- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
           <h2 className="text-lg font-semibold text-slate-800">Document Outlines</h2>
           <button onClick={() => setIsChatbotOpen(true)} className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
              <Bot className="w-5 h-5" />
              <span>Ask AI Assistant</span>
           </button>
        </div>
        <div className="flex-1 overflow-y-auto bg-slate-50/70">
          <ResultsPanel 
            isLoading={isLoading}
            results={results}
            onHeadingClick={handleHeadingClick}
          />
        </div>
      </main>

      {/* --- RIGHT PANEL --- */}
      <section className="w-full lg:w-[45%] h-screen border-l border-slate-200 shadow-lg">
          <ViewerPanel 
            selectedPdf={selectedPdf}
            isAdobeLoaded={isAdobeLoaded}
            onClose={() => setSelectedPdf(null)}
            pdfViewerRef={pdfViewerRef}
            snippetState={snippetState}
            onFindSimilarSnippets={handleFindSimilarSnippets}
            onNavigateToSnippet={handleNavigateToSnippet}
          />
      </section>

      {/* --- FLOATING CHATBOT (managed separately) --- */}
      {files.length > 0 && !isChatbotOpen && (
                <button onClick={() => setIsChatbotOpen(true)} aria-label="Open Chat"
                  className="fixed bottom-6 right-6 w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-indigo-700 z-40 transform hover:scale-110">
                  <MessageCircle className="w-8 h-8" />
                </button>
              )}
      <FloatingChatbot
        files={files}
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
      />
    </div>
  );
};

export default HeadingExtraction;