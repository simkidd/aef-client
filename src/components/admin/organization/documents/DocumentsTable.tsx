'use client';

import React, { useState } from 'react';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  Eye,
  Download,
  Loader2,
  FolderOpen,
  FileText,
  FileSpreadsheet,
  FileCheck,
  Lock,
} from 'lucide-react';
import { DocRecord, DocumentDetailsSheet } from './DocumentDetailsSheet';
import { TablePagination } from '@/components/ui/table-pagination';

interface DocumentsTableProps {
  documents: DocRecord[];
  isLoading?: boolean;
  onDownload?: (doc: DocRecord) => void;
  page?: number;
  totalPages?: number;
  total?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
}

export function DocumentsTable({
  documents,
  isLoading = false,
  onDownload,
  page = 1,
  totalPages = 1,
  total = 0,
  limit = 10,
  onPageChange,
}: DocumentsTableProps) {
  const [selectedDoc, setSelectedDoc] = useState<DocRecord | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleOpenDetails = (doc: DocRecord) => {
    setSelectedDoc(doc);
    setIsDetailsOpen(true);
  };

  const getDocIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return <FileText className="h-4 w-4 text-rose-500" />;
      case 'XLSX':
        return <FileSpreadsheet className="h-4 w-4 text-emerald-500" />;
      default:
        return <FileCheck className="h-4 w-4 text-sky-500" />;
    }
  };

  return (
    <>
      <Card className="py-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document</TableHead>
              <TableHead>Format & Size</TableHead>
              <TableHead>Access Level</TableHead>
              <TableHead className="w-[60px] text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-12 text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <p className="text-xs font-medium">Loading document repository...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : documents && documents.length > 0 ? (
              documents.map((doc) => (
                <TableRow
                  key={doc.id}
                  className="hover:bg-muted/60 transition-colors group cursor-pointer"
                  onClick={() => handleOpenDetails(doc)}
                >
                  {/* Document Title: Icon + Title + Category */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0 border">
                        {getDocIcon(doc.fileType)}
                      </div>
                      <div className="min-w-0 max-w-[280px]">
                        <span className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors block truncate">
                          {doc.title}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                            {doc.category}
                          </span>
                          <span className="font-mono text-[11px] text-muted-foreground truncate">
                            {doc.id.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Format & Size */}
                  <TableCell>
                    <span className="font-mono text-xs text-foreground block">
                      {doc.fileType}
                    </span>
                    <span className="text-[11px] text-muted-foreground block">
                      {doc.fileSize}
                    </span>
                  </TableCell>

                  {/* Access Level */}
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                      <Lock className="h-3 w-3 text-muted-foreground" />
                      <span>{doc.accessLevel}</span>
                    </div>
                  </TableCell>

                  {/* Action Menu */}
                  <TableCell
                    className="text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          />
                        }
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 p-1">
                        <DropdownMenuItem
                          onClick={() => handleOpenDetails(doc)}
                          className="text-[13px] cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        {onDownload && (
                          <DropdownMenuItem
                            onClick={() => onDownload(doc)}
                            className="text-[13px] cursor-pointer text-primary font-medium focus:text-primary"
                          >
                            <Download className="h-3.5 w-3.5 text-primary" />
                            <span>Download File</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-12 text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FolderOpen className="h-8 w-8 text-muted-foreground/50" />
                    <p className="text-sm font-semibold text-foreground">
                      No documents found
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Try adjusting your search filters or upload a document.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {onPageChange && (
          <TablePagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={limit}
            onPageChange={onPageChange}
          />
        )}
      </Card>

      {/* Document Details Sheet */}
      <DocumentDetailsSheet
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        document={selectedDoc}
        onDownload={onDownload}
      />
    </>
  );
}
