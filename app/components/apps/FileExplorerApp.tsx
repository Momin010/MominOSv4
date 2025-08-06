'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Folder,
  FileText,
  Image as ImageIcon,
  Music,
  Video,
  Archive,
  ArrowLeft,
  ArrowRight,
  Trash2,
  Copy,
  Scissors,
  Clipboard,
} from 'lucide-react';

export type FileItem = {
  id: string;
  name: string;
  type: 'file';
  size: number;
  modified: Date;
  parent?: string;
  content?: string;
};

export type FolderItem = {
  id: string;
  name: string;
  type: 'folder';
  children: FileSystemItem[];
  parent?: string;
};

export type FileSystemItem = FileItem | FolderItem;

export default function FileExplorerApp() {
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>([
    {
      id: 'root',
      name: 'Root',
      type: 'folder',
      children: [],
    },
  ]);
  const [currentFolderId, setCurrentFolderId] = useState('root');
  const [history, setHistory] = useState<string[]>(['root']);

  const currentFolder = fileSystem.find(
    (item) => item.id === currentFolderId && item.type === 'folder'
  ) as FolderItem;

  const goToFolder = (folderId: string) => {
    const folder = fileSystem.find(
      (item) => item.id === folderId && item.type === 'folder'
    ) as FolderItem;

    if (folder) {
      setCurrentFolderId(folderId);
      setHistory((prev) => [...prev, folderId]);
    }
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      const prevFolderId = newHistory[newHistory.length - 1];
      setCurrentFolderId(prevFolderId);
      setHistory(newHistory);
    }
  };

  const createNewFile = () => {
    const id = Date.now().toString();
    const newFile: FileItem = {
      id,
      name: `New File ${id}`,
      type: 'file',
      size: 0,
      modified: new Date(),
      parent: currentFolderId,
      content: '',
    };

    const updatedFileSystem = fileSystem.map((item) => {
      if (item.id === currentFolderId && item.type === 'folder') {
        return {
          ...item,
          children: [...item.children, newFile],
        };
      }
      return item;
    });

    setFileSystem([...updatedFileSystem, newFile]);
  };

  const createNewFolder = () => {
    const id = Date.now().toString();
    const newFolder: FolderItem = {
      id,
      name: `New Folder ${id}`,
      type: 'folder',
      parent: currentFolderId,
      children: [],
    };

    const updatedFileSystem = fileSystem.map((item) => {
      if (item.id === currentFolderId && item.type === 'folder') {
        return {
          ...item,
          children: [...item.children, newFolder],
        };
      }
      return item;
    });

    setFileSystem([...updatedFileSystem, newFolder]);
  };

  return (
    <div className="p-4 w-full h-screen bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button onClick={goBack}>
            <ArrowLeft />
          </button>
          <button onClick={() => goToFolder('root')}>
            <ArrowRight />
          </button>
        </div>
        <div className="space-x-2">
          <button onClick={createNewFile}>+ File</button>
          <button onClick={createNewFolder}>+ Folder</button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {currentFolder.children.map((child) => (
          <motion.div
            key={child.id}
            className="p-4 rounded-lg bg-white dark:bg-neutral-800 shadow hover:shadow-lg transition"
            whileHover={{ scale: 1.05 }}
            onDoubleClick={() => {
              if (child.type === 'folder') goToFolder(child.id);
            }}
          >
            <div className="flex items-center gap-2">
              {child.type === 'folder' ? <Folder /> : <FileText />}
              <div className="font-medium text-sm">{child.name}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
