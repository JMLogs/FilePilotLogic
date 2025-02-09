'use client';

import React, { useState, useCallback } from 'react';
import { Upload, FileText, RefreshCw, Trash2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

export function FileProcessor() {
  const [files, setFiles] = useState<File[]>([]);
  const [processedData, setProcessedData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const uploadedFiles = Array.from(event.target.files);
      setFiles(prevFiles => [...prevFiles, ...uploadedFiles]);
      setError(null);
    }
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setProcessedData(null);
    setError(null);
  }, []);

  const processFiles = useCallback(async () => {
    setProcessing(true);
    setError(null);
    
    try {
      const results = await Promise.all(
        files.map(async (file) => {
          const text = await file.text();
          return {
            name: file.name,
            content: text.split('\n').filter(line => line.trim().length > 0)
          };
        })
      );
      setProcessedData(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing files');
    } finally {
      setProcessing(false);
    }
  }, [files]);

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>File Processor</CardTitle>
          <CardDescription>Upload and process your files</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload" className="space-y-4">
            <TabsList>
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  multiple
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Click to upload or drag and drop files
                  </span>
                </label>
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded"
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span>{file.name}</span>
                      </div>
                      <button 
                        onClick={() => removeFile(index)}
                        className="hover:bg-gray-100 p-1 rounded-full"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={processFiles}
                    disabled={processing}
                    className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center space-x-2"
                  >
                    {processing && <RefreshCw className="h-4 w-4 animate-spin" />}
                    <span>{processing ? 'Processing...' : 'Process Files'}</span>
                  </button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="results">
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {processedData && (
                <div className="space-y-4">
                  {processedData.map((file: any, index: number) => (
                    <div key={index} className="space-y-2">
                      <h4 className="font-medium">{file.name}</h4>
                      <pre className="bg-gray-50 p-4 rounded overflow-auto max-h-60">
                        {JSON.stringify(file.content, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}