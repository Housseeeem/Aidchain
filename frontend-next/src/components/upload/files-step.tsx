"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Upload as UploadIcon, 
  File, 
  Folder, 
  X, 
  FileText, 
  Image, 
  Database,
  Archive,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react"
import { UploadData } from "@/app/(user)/upload/page"

interface FilesStepProps {
  data: UploadData
  updateData: (data: Partial<UploadData>) => void
}

interface FileItem {
  file: File
  path: string
  size: number
  type: string
  status: "pending" | "uploading" | "completed" | "error"
  progress: number
}

const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase()
  
  switch (extension) {
    case 'csv':
    case 'xlsx':
    case 'xls':
      return Database
    case 'json':
    case 'xml':
    case 'txt':
      return FileText
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return Image
    case 'zip':
    case 'rar':
    case '7z':
      return Archive
    default:
      return File
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function FilesStep({ data, updateData }: FilesStepProps) {
  const [fileItems, setFileItems] = useState<FileItem[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (files: FileList | File[]) => {
    const newFileItems: FileItem[] = Array.from(files).map(file => ({
      file,
      path: file.webkitRelativePath || file.name,
      size: file.size,
      type: file.type,
      status: "pending",
      progress: 0
    }))

    setFileItems(prev => [...prev, ...newFileItems])
    
    const allFiles = [...data.files, ...Array.from(files)]
    const totalSize = allFiles.reduce((sum, file) => sum + file.size, 0)
    
    updateData({ 
      files: allFiles,
      totalSize 
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const removeFile = (index: number) => {
    const newFileItems = fileItems.filter((_, i) => i !== index)
    const newFiles = data.files.filter((_, i) => i !== index)
    const totalSize = newFiles.reduce((sum, file) => sum + file.size, 0)
    
    setFileItems(newFileItems)
    updateData({ 
      files: newFiles,
      totalSize 
    })
  }

  const simulateUpload = async () => {
    setIsUploading(true)
    
    for (let i = 0; i < fileItems.length; i++) {
      // Update status to uploading
      setFileItems(prev => prev.map((item, index) => 
        index === i ? { ...item, status: "uploading" } : item
      ))

      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100))
        setFileItems(prev => prev.map((item, index) => 
          index === i ? { ...item, progress } : item
        ))
      }

      // Mark as completed
      setFileItems(prev => prev.map((item, index) => 
        index === i ? { ...item, status: "completed", progress: 100 } : item
      ))
    }
    
    setIsUploading(false)
  }

  const organizeFilesByDirectory = () => {
    const directories: { [key: string]: FileItem[] } = {}
    
    fileItems.forEach(item => {
      const pathParts = item.path.split('/')
      if (pathParts.length > 1) {
        const dirName = pathParts[0]
        if (!directories[dirName]) {
          directories[dirName] = []
        }
        directories[dirName].push(item)
      } else {
        if (!directories['Root']) {
          directories['Root'] = []
        }
        directories['Root'].push(item)
      }
    })
    
    return directories
  }

  const directories = organizeFilesByDirectory()
  const totalFiles = fileItems.length
  const completedFiles = fileItems.filter(item => item.status === "completed").length
  const overallProgress = totalFiles > 0 ? (completedFiles / totalFiles) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Dataset Files</CardTitle>
          <CardDescription>
            Upload your dataset files. You can upload individual files or entire folders.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Drag and Drop Area */}
          <div
            className={`
              border-2 border-dashed p-8 text-center transition-colors
              ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
            `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <UploadIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Drop files here or click to browse</p>
            <p className="text-sm text-muted-foreground mb-4">
              Supported formats: CSV, JSON, XML, Excel, Images, Archives, and more
            </p>
            
            <div className="flex gap-2 justify-center">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <File className="h-4 w-4 mr-2" />
                Select Files
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => folderInputRef.current?.click()}
              >
                <Folder className="h-4 w-4 mr-2" />
                Select Folder
              </Button>
            </div>
          </div>

          {/* Hidden File Inputs */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          <input
            ref={folderInputRef}
            type="file"
            webkitdirectory=""
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading files...</span>
                <span>{completedFiles}/{totalFiles} completed</span>
              </div>
              <Progress value={overallProgress} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* File List */}
      {fileItems.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Uploaded Files ({totalFiles})</CardTitle>
              <CardDescription>
                Total size: {formatFileSize(data.totalSize)}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {!isUploading && completedFiles < totalFiles && (
                <Button onClick={simulateUpload} size="sm">
                  <UploadIcon className="h-4 w-4 mr-2" />
                  Start Upload
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setFileItems([])
                  updateData({ files: [], totalSize: 0 })
                }}
              >
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(directories).map(([dirName, files]) => (
                <div key={dirName} className="space-y-2">
                  {dirName !== 'Root' && (
                    <div className="flex items-center gap-2 font-medium text-sm">
                      <Folder className="h-4 w-4 text-blue-500" />
                      {dirName}
                    </div>
                  )}
                  
                  <div className="space-y-2 ml-6">
                    {files.map((item, index) => {
                      const FileIcon = getFileIcon(item.file.name)
                      const globalIndex = fileItems.indexOf(item)
                      
                      return (
                        <div key={index} className="flex items-center justify-between p-3 border">
                          <div className="flex items-center gap-3 flex-1">
                            <FileIcon className="h-4 w-4 text-muted-foreground" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{item.file.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatFileSize(item.size)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {item.status === "pending" && (
                              <Badge variant="secondary">Pending</Badge>
                            )}
                            {item.status === "uploading" && (
                              <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-sm">{item.progress}%</span>
                              </div>
                            )}
                            {item.status === "completed" && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                            {item.status === "error" && (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            )}
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(globalIndex)}
                              disabled={isUploading}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
            <p>Maximum file size: 5GB per file, 50GB total per dataset</p>
          </div>
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
            <p>Ensure all files are properly formatted and contain no sensitive personal information</p>
          </div>
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
            <p>Include documentation files (README, data dictionary) to help users understand your dataset</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
            <p>All files will be automatically scanned for security and anonymized if needed</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}