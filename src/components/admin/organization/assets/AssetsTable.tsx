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
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  MoreHorizontal,
  Eye,
  QrCode,
  Loader2,
  Boxes,
  Laptop,
  Sun,
  Scissors,
  Fingerprint,
} from 'lucide-react';
import { AssetRecord, AssetDetailsSheet } from './AssetDetailsSheet';
import { TablePagination } from '@/components/ui/table-pagination';
import { toast } from '@/components/ui/toast';

interface AssetsTableProps {
  assets: AssetRecord[];
  isLoading?: boolean;
  page?: number;
  totalPages?: number;
  total?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
}

export function AssetsTable({
  assets,
  isLoading = false,
  page = 1,
  totalPages = 1,
  total = 0,
  limit = 10,
  onPageChange,
}: AssetsTableProps) {
  const [selectedAsset, setSelectedAsset] = useState<AssetRecord | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleOpenDetails = (asset: AssetRecord) => {
    setSelectedAsset(asset);
    setIsDetailsOpen(true);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'IT Equipment':
        return <Laptop className="h-4 w-4 text-sky-500" />;
      case 'Solar Workshop Gear':
        return <Sun className="h-4 w-4 text-amber-500" />;
      case 'Esthetics Tools':
        return <Scissors className="h-4 w-4 text-pink-500" />;
      case 'Biometric Hardware':
        return <Fingerprint className="h-4 w-4 text-indigo-500" />;
      default:
        return <Boxes className="h-4 w-4 text-primary" />;
    }
  };

  const handlePrintQR = (asset: AssetRecord) => {
    toast.add({
      title: 'QR Tag Generated',
      description: `Dispatched printable barcode label for ${asset.tag}.`,
      type: 'success',
    });
  };

  return (
    <>
      <Card className="py-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead className="w-[60px] text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-12 text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <p className="text-xs font-medium">Loading asset inventory...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : assets && assets.length > 0 ? (
              assets.map((asset) => (
                <TableRow
                  key={asset.id}
                  className="hover:bg-muted/60 transition-colors group cursor-pointer"
                  onClick={() => handleOpenDetails(asset)}
                >
                  {/* Asset: Tag + Name + Serial */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        {getCategoryIcon(asset.category)}
                      </div>
                      <div className="min-w-0 max-w-[240px]">
                        <span className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors block truncate">
                          {asset.name}
                        </span>
                        <span className="font-mono text-[11px] text-muted-foreground block truncate">
                          {asset.tag}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Category */}
                  <TableCell>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                      {asset.category}
                    </span>
                  </TableCell>

                  {/* Location / Room */}
                  <TableCell className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground block truncate">
                      {asset.centreName}
                    </span>
                    <span className="text-[11px] text-muted-foreground block truncate">
                      {asset.roomName}
                    </span>
                  </TableCell>

                  {/* Condition */}
                  <TableCell>
                    <StatusBadge status={asset.condition} size="sm" />
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
                          onClick={() => handleOpenDetails(asset)}
                          className="text-[13px] cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handlePrintQR(asset)}
                          className="text-[13px] cursor-pointer text-primary font-medium focus:text-primary"
                        >
                          <QrCode className="h-3.5 w-3.5 text-primary" />
                          <span>Print QR Tag</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-12 text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Boxes className="h-8 w-8 text-muted-foreground/50" />
                    <p className="text-sm font-semibold text-foreground">
                      No asset inventory found
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Try adjusting your search filters or log a new asset.
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

      {/* Asset Details Sheet */}
      <AssetDetailsSheet
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        asset={selectedAsset}
      />
    </>
  );
}
