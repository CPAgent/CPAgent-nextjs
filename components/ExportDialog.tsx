'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';

interface ExportDialogProps {
  data: any[];
  filename?: string;
}

export default function ExportDialog({ data, filename = 'transactions' }: ExportDialogProps) {
  const [format, setFormat] = useState<'csv' | 'json'>('csv');

  const exportToCSV = () => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => 
      Object.values(item).map(val => 
        typeof val === 'string' && val.includes(',') ? `"${val}"` : val
      ).join(',')
    );
    
    const csv = [headers, ...rows].join('\n');
    downloadFile(csv, `${filename}.csv`, 'text/csv');
  };

  const exportToJSON = () => {
    const json = JSON.stringify(data, null, 2);
    downloadFile(json, `${filename}.json`, 'application/json');
  };

  const downloadFile = (content: string, fileName: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    if (format === 'csv') {
      exportToCSV();
    } else {
      exportToJSON();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Download className="w-4 h-4 mr-2" />
          내역 다운로드
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>거래 내역 내보내기</DialogTitle>
          <DialogDescription>
            원하는 형식을 선택하여 거래 내역을 다운로드하세요
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <RadioGroup value={format} onValueChange={(value) => setFormat(value as 'csv' | 'json')}>
            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="csv" id="csv" />
              <Label htmlFor="csv" className="flex items-center gap-3 cursor-pointer flex-1">
                <FileSpreadsheet className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">CSV 파일</p>
                  <p className="text-sm text-gray-500">엑셀에서 열기 좋은 형식</p>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="json" id="json" />
              <Label htmlFor="json" className="flex items-center gap-3 cursor-pointer flex-1">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium">JSON 파일</p>
                  <p className="text-sm text-gray-500">개발자 친화적인 형식</p>
                </div>
              </Label>
            </div>
          </RadioGroup>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>{data.length}개</strong>의 거래 내역이 다운로드됩니다
            </p>
          </div>

          <Button 
            onClick={handleExport} 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Download className="w-4 h-4 mr-2" />
            다운로드 시작
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
