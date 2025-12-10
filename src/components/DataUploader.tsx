import React, { useRef, useState } from 'react';
import { Upload, Download, FileSpreadsheet, Trash2, Check, AlertCircle, Info, AlertTriangle } from 'lucide-react';
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
import { 
  allTemplates, 
  downloadTemplate, 
  parseUploadedFile, 
  validateDataSmart, 
  transformData,
  ValidationResult 
} from '@/lib/templates';
import { ColumnMapping, MappingResult } from '@/lib/columnMapping';
import ColumnMapperDialog from './ColumnMapperDialog';

interface DataUploaderProps {
  pageId: string;
  onDataUpdated?: () => void;
}

const DataUploader: React.FC<DataUploaderProps> = ({ pageId, onDataUpdated }) => {
  const { setData, clearData, getUploadInfo } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadWarnings, setUploadWarnings] = useState<string[]>([]);
  const [showMapperDialog, setShowMapperDialog] = useState(false);
  const [pendingData, setPendingData] = useState<Record<string, any[]> | null>(null);
  const [pendingFileName, setPendingFileName] = useState<string>('');
  const [pendingValidation, setPendingValidation] = useState<ValidationResult | null>(null);
  const [currentSheetIndex, setCurrentSheetIndex] = useState(0);
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
    setUploadWarnings([]);

    try {
      const data = await parseUploadedFile(file);
      const validation = validateDataSmart(data, template);

      if (!validation.valid) {
        setUploadError(validation.errors.join('\n'));
        toast.error('Erro na validação do arquivo');
        return;
      }

      // Show warnings if any
      if (validation.warnings.length > 0) {
        setUploadWarnings(validation.warnings);
      }

      // If needs user review for column mapping
      if (validation.needsUserReview) {
        setPendingData(data);
        setPendingFileName(file.name);
        setPendingValidation(validation);
        setCurrentSheetIndex(0);
        
        // Find first sheet that needs review
        const sheetsNeedingReview = Object.entries(validation.mappingResults)
          .filter(([_, result]) => result.needsUserReview);
        
        if (sheetsNeedingReview.length > 0) {
          setShowMapperDialog(true);
          return;
        }
      }

      // No review needed, process directly
      await processAndSaveData(data, file.name, validation);
      
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

  const processAndSaveData = async (
    rawData: Record<string, any[]>, 
    fileName: string,
    validation: ValidationResult,
    customMappings?: Record<string, ColumnMapping[]>
  ) => {
    // Transform data with mappings and computed fields
    const transformedData = transformData(rawData, template, customMappings);
    
    // Store the entire multi-sheet data object
    await setData(pageId, transformedData as any, fileName);
    const totalRecords = Object.values(transformedData).reduce((sum, arr) => sum + arr.length, 0);
    toast.success(`Dados carregados: ${totalRecords} registros em ${Object.keys(transformedData).length} planilha(s)`);
    
    if (validation.warnings.length > 0) {
      toast.info(`${validation.warnings.length} aviso(s) - verifique os detalhes`);
    }
    
    setIsOpen(false);
    onDataUpdated?.();
  };

  const handleMappingConfirm = async (mappings: ColumnMapping[]) => {
    if (!pendingData || !pendingFileName || !pendingValidation) return;
    
    const sheetsNeedingReview = Object.entries(pendingValidation.mappingResults)
      .filter(([_, result]) => result.needsUserReview);
    
    const currentSheetName = sheetsNeedingReview[currentSheetIndex]?.[0];
    
    // Store the mapping for current sheet
    const customMappings: Record<string, ColumnMapping[]> = {
      [currentSheetName]: mappings
    };
    
    // Check if there are more sheets to review
    if (currentSheetIndex < sheetsNeedingReview.length - 1) {
      setCurrentSheetIndex(prev => prev + 1);
      // Keep dialog open for next sheet
      return;
    }
    
    // All sheets reviewed, process data
    setShowMapperDialog(false);
    await processAndSaveData(pendingData, pendingFileName, pendingValidation, customMappings);
    
    // Reset state
    setPendingData(null);
    setPendingFileName('');
    setPendingValidation(null);
    setCurrentSheetIndex(0);
  };

  const handleMapperClose = () => {
    setShowMapperDialog(false);
    setPendingData(null);
    setPendingFileName('');
    setPendingValidation(null);
    setCurrentSheetIndex(0);
    toast.info('Upload cancelado');
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

  // Get current sheet for mapping dialog
  const getCurrentSheetForMapping = () => {
    if (!pendingValidation) return null;
    
    const sheetsNeedingReview = Object.entries(pendingValidation.mappingResults)
      .filter(([_, result]) => result.needsUserReview);
    
    if (currentSheetIndex >= sheetsNeedingReview.length) return null;
    
    const [sheetName, mappingResult] = sheetsNeedingReview[currentSheetIndex];
    const sheetTemplate = template.sheets.find(s => s.sheetName === sheetName);
    
    return {
      sheetName,
      mappingResult,
      columns: sheetTemplate?.columns || []
    };
  };

  const currentSheetMapping = getCurrentSheetForMapping();

  return (
    <>
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

            {/* Warnings */}
            {uploadWarnings.length > 0 && (
              <Card className="p-3 bg-yellow-500/10 border-yellow-500/30">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5" />
                  <div className="text-sm text-yellow-400">
                    <p className="font-medium mb-1">Avisos:</p>
                    <ul className="list-disc list-inside space-y-0.5 text-xs">
                      {uploadWarnings.map((warning, i) => (
                        <li key={i}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            )}

            {/* Template Info */}
            <Card className="p-3 bg-muted/30 border-border/50">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-primary mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Planilhas esperadas:</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {template.sheets.map(sheet => (
                      <span 
                        key={sheet.sheetName}
                        className="px-2 py-0.5 rounded text-xs bg-primary/20 text-primary"
                      >
                        {sheet.sheetName}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground/70">
                    💡 Campos calculados (saldo, margem, ROI, etc.) são preenchidos automaticamente
                  </p>
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

      {/* Column Mapper Dialog */}
      {currentSheetMapping && (
        <ColumnMapperDialog
          isOpen={showMapperDialog}
          onClose={handleMapperClose}
          onConfirm={handleMappingConfirm}
          mappingResult={currentSheetMapping.mappingResult}
          targetColumns={currentSheetMapping.columns}
          sheetName={currentSheetMapping.sheetName}
        />
      )}
    </>
  );
};

export default DataUploader;