import React, { useRef, useState } from 'react';
import { Upload, Download, FileSpreadsheet, Trash2, Check, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { useData } from '@/contexts/DataContext';
import { allTemplates, downloadTemplate, parseUploadedFile, validateData, PageTemplate } from '@/lib/templates';

interface DataUploaderProps {
  pageId: string;
  onDataUpdated?: () => void;
}

const DataUploader: React.FC<DataUploaderProps> = ({ pageId, onDataUpdated }) => {
  const { setData, clearData, getUploadInfo } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const template = allTemplates[pageId];
  const uploadInfo = getUploadInfo(pageId);

  if (!template) {
    return null;
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const data = await parseUploadedFile(file);
      const validation = validateData(data, template);

      if (!validation.valid) {
        setUploadError(validation.errors.join('\n'));
        toast.error('Erro na validação do arquivo');
        return;
      }

      await setData(pageId, data, file.name);
      toast.success(`Dados carregados: ${data.length} registros`);
      setIsOpen(false);
      onDataUpdated?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setUploadError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDownloadTemplate = () => {
    downloadTemplate(template);
    toast.success('Template baixado com sucesso');
  };

  const handleClearData = async () => {
    await clearData(pageId);
    toast.info('Dados removidos. Usando dados de exemplo.');
    onDataUpdated?.();
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`gap-2 ${uploadInfo ? 'border-green-500/50 text-green-400' : 'border-border/50'}`}
              >
                <FileSpreadsheet className="h-4 w-4" />
                {uploadInfo ? 'Dados Carregados' : 'Carregar Dados'}
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            {uploadInfo 
              ? `Arquivo: ${uploadInfo.fileName} (${formatDate(uploadInfo.uploadedAt)})`
              : 'Clique para importar planilha'
            }
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            {template.pageName}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {template.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Current Status */}
          {uploadInfo && (
            <Card className="p-3 bg-green-500/10 border-green-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 font-medium">{uploadInfo.fileName}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDate(uploadInfo.uploadedAt)}
                </span>
              </div>
            </Card>
          )}

          {/* Error Message */}
          {uploadError && (
            <Card className="p-3 bg-destructive/10 border-destructive/30">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                <div className="text-sm text-destructive whitespace-pre-line">
                  {uploadError}
                </div>
              </div>
            </Card>
          )}

          {/* Template Info */}
          <Card className="p-3 bg-muted/30 border-border/50">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-primary mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Colunas esperadas:</p>
                <div className="flex flex-wrap gap-1">
                  {template.columns.map(col => (
                    <span 
                      key={col.key}
                      className={`px-2 py-0.5 rounded text-xs ${
                        col.required 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {col.label}{col.required && '*'}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleDownloadTemplate}
              variant="outline"
              className="w-full gap-2"
            >
              <Download className="h-4 w-4" />
              Baixar Template (com dados exemplo)
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelect}
              className="hidden"
            />

            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full gap-2 bg-primary hover:bg-primary/90"
            >
              <Upload className="h-4 w-4" />
              {isUploading ? 'Processando...' : 'Enviar Planilha'}
            </Button>

            {uploadInfo && (
              <Button
                onClick={handleClearData}
                variant="ghost"
                className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
                Remover dados e usar exemplo
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DataUploader;
