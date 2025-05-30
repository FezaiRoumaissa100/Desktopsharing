"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  File,
  Folder,
  ArrowUp,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Plus,
  FileText,
  FileImage,
  FileArchive,
  FileCode,
} from "lucide-react"

interface FileItem {
  name: string
  type: "file" | "directory"
  size?: number
  modified?: string
  icon?: React.ReactNode
}

interface FileManagerProps {
  isEnabled: boolean
  onNavigate?: (path: string) => void
  onDownload?: (path: string) => void
  onUpload?: (files: FileList, path: string) => void
  onDelete?: (path: string) => void
  onCreateFolder?: (name: string, path: string) => void
}

export function FileManager({
  isEnabled,
  onNavigate,
  onDownload,
  onUpload,
  onDelete,
  onCreateFolder,
}: FileManagerProps) {
  const [currentPath, setCurrentPath] = useState("/")
  const [files, setFiles] = useState<FileItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")

  // Mock file system for demo
  const mockFileSystem: Record<string, FileItem[]> = {
    "/": [
      { name: "Documents", type: "directory", modified: "2023-12-01" },
      { name: "Pictures", type: "directory", modified: "2023-11-15" },
      { name: "Downloads", type: "directory", modified: "2023-12-05" },
      { name: "readme.txt", type: "file", size: 1024, modified: "2023-10-20" },
      { name: "config.json", type: "file", size: 2048, modified: "2023-11-30" },
    ],
    "/Documents": [
      { name: "Work", type: "directory", modified: "2023-11-10" },
      { name: "Personal", type: "directory", modified: "2023-10-05" },
      { name: "report.pdf", type: "file", size: 1024000, modified: "2023-12-01" },
      { name: "notes.txt", type: "file", size: 512, modified: "2023-11-20" },
    ],
    "/Pictures": [
      { name: "Vacation", type: "directory", modified: "2023-09-15" },
      { name: "profile.jpg", type: "file", size: 2048000, modified: "2023-10-10" },
      { name: "screenshot.png", type: "file", size: 1536000, modified: "2023-11-25" },
    ],
    "/Downloads": [
      { name: "software.zip", type: "file", size: 10240000, modified: "2023-12-03" },
      { name: "movie.mp4", type: "file", size: 1073741824, modified: "2023-11-28" },
    ],
  }

  useEffect(() => {
    // Simulate loading files from the remote system
    setIsLoading(true)

    setTimeout(() => {
      const pathFiles = mockFileSystem[currentPath] || []

      // Add icons based on file types
      const filesWithIcons = pathFiles.map((file) => {
        let icon

        if (file.type === "directory") {
          icon = <Folder className="h-4 w-4" />
        } else {
          const extension = file.name.split(".").pop()?.toLowerCase()

          if (extension === "txt" || extension === "pdf" || extension === "doc" || extension === "docx") {
            icon = <FileText className="h-4 w-4" />
          } else if (extension === "jpg" || extension === "png" || extension === "gif") {
            icon = <FileImage className="h-4 w-4" />
          } else if (extension === "zip" || extension === "rar" || extension === "tar") {
            icon = <FileArchive className="h-4 w-4" />
          } else if (extension === "js" || extension === "ts" || extension === "html" || extension === "css") {
            icon = <FileCode className="h-4 w-4" />
          } else {
            icon = <File className="h-4 w-4" />
          }
        }

        return { ...file, icon }
      })

      setFiles(filesWithIcons)
      setIsLoading(false)
    }, 500)
  }, [currentPath])

  const handleNavigate = (path: string) => {
    setCurrentPath(path)
    setSelectedFile(null)

    if (onNavigate) {
      onNavigate(path)
    }
  }

  const handleFileClick = (file: FileItem) => {
    if (file.type === "directory") {
      const newPath = currentPath === "/" ? `/${file.name}` : `${currentPath}/${file.name}`
      handleNavigate(newPath)
    } else {
      setSelectedFile(file.name)
    }
  }

  const handleParentDirectory = () => {
    if (currentPath === "/") return

    const pathParts = currentPath.split("/").filter(Boolean)
    pathParts.pop()
    const parentPath = pathParts.length === 0 ? "/" : `/${pathParts.join("/")}`
    handleNavigate(parentPath)
  }

  const handleDownload = () => {
    if (!selectedFile) return

    const filePath = currentPath === "/" ? `/${selectedFile}` : `${currentPath}/${selectedFile}`

    if (onDownload) {
      onDownload(filePath)
    }

    // For demo purposes, simulate a download
    console.log(`Downloading: ${filePath}`)
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    if (onUpload) {
      onUpload(e.target.files, currentPath)
    }

    // For demo purposes, simulate an upload
    console.log(`Uploading ${e.target.files.length} files to ${currentPath}`)

    // Reset the input
    e.target.value = ""
  }

  const handleDelete = () => {
    if (!selectedFile) return

    const filePath = currentPath === "/" ? `/${selectedFile}` : `${currentPath}/${selectedFile}`

    if (onDelete) {
      onDelete(filePath)
    }

    // For demo purposes, remove from the local state
    setFiles(files.filter((file) => file.name !== selectedFile))
    setSelectedFile(null)
  }

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return

    if (onCreateFolder) {
      onCreateFolder(newFolderName.trim(), currentPath)
    }

    // For demo purposes, add to the local state
    const newFolder: FileItem = {
      name: newFolderName.trim(),
      type: "directory",
      modified: new Date().toISOString().split("T")[0],
      icon: <Folder className="h-4 w-4" />,
    }

    setFiles([...files, newFolder])
    setNewFolderName("")
    setIsCreateFolderDialogOpen(false)
  }

  const formatFileSize = (bytes?: number) => {
    if (bytes === undefined) return ""

    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
  }

  const pathParts = currentPath.split("/").filter(Boolean)

  if (!isEnabled) {
    return (
      <div className="p-4 text-center">
        <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground">File manager is not enabled for this session.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={handleParentDirectory} disabled={currentPath === "/"}>
          <ArrowUp className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => handleNavigate(currentPath)}>
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="icon" onClick={() => setIsCreateFolderDialogOpen(true)}>
            <Plus className="h-4 w-4" />
          </Button>

          <label htmlFor="file-upload">
            <Button variant="outline" size="icon" asChild>
              <div>
                <Upload className="h-4 w-4" />
                <input id="file-upload" type="file" multiple className="hidden" onChange={handleUpload} />
              </div>
            </Button>
          </label>

          <Button
            variant="outline"
            size="icon"
            onClick={handleDownload}
            disabled={!selectedFile || files.find((f) => f.name === selectedFile)?.type === "directory"}
          >
            <Download className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="icon" onClick={handleDelete} disabled={!selectedFile}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => handleNavigate("/")}>Home</BreadcrumbLink>
          </BreadcrumbItem>

          {pathParts.map((part, index) => (
            <BreadcrumbItem key={index}>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbLink onClick={() => handleNavigate(`/${pathParts.slice(0, index + 1).join("/")}`)}>
                {part}
              </BreadcrumbLink>
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      {/* File list */}
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Modified</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center">
                    <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                    <span className="mt-2 text-sm text-muted-foreground">Loading files...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : files.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center">
                    <Folder className="h-6 w-6 text-muted-foreground" />
                    <span className="mt-2 text-sm text-muted-foreground">This folder is empty</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              files.map((file) => (
                <TableRow
                  key={file.name}
                  className={`cursor-pointer ${selectedFile === file.name ? "bg-muted" : ""}`}
                  onClick={() => handleFileClick(file)}
                >
                  <TableCell className="flex items-center gap-2">
                    {file.icon}
                    <span>{file.name}</span>
                  </TableCell>
                  <TableCell>{file.type === "directory" ? "--" : formatFileSize(file.size)}</TableCell>
                  <TableCell>{file.modified || "--"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create folder dialog */}
      <Dialog open={isCreateFolderDialogOpen} onOpenChange={setIsCreateFolderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>Enter a name for the new folder</DialogDescription>
          </DialogHeader>
          <Input value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="Folder name" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateFolderDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
