import React, { useRef, useState } from 'react';
import { 
  Upload, Download, FileSpreadsheet, Trash2, Check, AlertCircle, 
  Info, AlertTriangle, ChevronDown, ChevronRight, ExternalLink,
  Table, Hash, Type, Calendar, Percent, Asterisk
} from 'lucide-react';
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useData } from '@/contexts/DataContext';
import { 
  allTemplates, 
  downloadTemplate, 
  parseUploadedFile, 
  validateDataSmart, 
  transformData,
  ValidationResult,
  TemplateColumn
} from '@/lib/templates';
import { ColumnMapping } from '@/lib/columnMapping';
import ColumnMapperDialog from './ColumnMapperDialog';

interface DataUploaderProps {
  pageId: string;
  onDataUpdated?: () => void;
}

// Google Sheets template links (can be configured per page)
const googleSheetsLinks: Record<string, string> = {
  hr: 'https://docs.google.com/spreadsheets/d/1example_hr/copy',
  cashflow: 'https://docs.google.com/spreadsheets/d/1example_cashflow/copy',
  financial: 'https://docs.google.com/spreadsheets/d/1example_financial/copy',
  sales: 'https://docs.google.com/spreadsheets/d/1example_sales/copy',
  marketing: 'https://docs.google.com/spreadsheets/d/1example_marketing/copy',
  clients: 'https://docs.google.com/spreadsheets/d/1example_clients/copy',
  services: 'https://docs.google.com/spreadsheets/d/1example_services/copy',
  overview: 'https://docs.google.com/spreadsheets/d/1example_overview/copy',
};

const getTypeIcon = (type: TemplateColumn['type']) => {
  switch (type) {
    case 'number': return <Hash className="h-3 w-3" />;
    case 'string': return <Type className="h-3 w-3" />;
    case 'date': return <Calendar className="h-3 w-3" />;
    case 'percentage': return <Percent className="h-3 w-3" />;
    default: return <Type className="h-3 w-3" />;
  }
};

const getTypeLabel = (type: TemplateColumn['type']) => {
  switch (type) {
    case 'number': return 'Número';
    case 'string': return 'Texto';
    case 'date': return 'Data';
    case 'percentage': return 'Percentual';
    default: return type;
  }
};

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
  const [expandedSheets, setExpandedSheets] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const template = allTemplates[pageId];
  const uploadInfo = getUploadInfo(pageId);
  const googleSheetLink = googleSheetsLinks[pageId];

  if (!template) {
    return null;
  }

  const toggleSheetExpanded = (sheetName: string) => {
    setExpandedSheets(prev => 
      prev.includes(sheetName) 
        ? prev.filter(s => s !== sheetName)
        : [...prev, sheetName]
    );
  };

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

      if (validation.warnings.length > 0) {
        setUploadWarnings(validation.warnings);
      }

      if (validation.needsUserReview) {
        setPendingData(data);
        setPendingFileName(file.name);
        setPendingValidation(validation);
        setCurrentSheetIndex(0);
        
        const sheetsNeedingReview = Object.entries(validation.mappingResults)
          .filter(([_, result]) => result.needsUserReview);
        
        if (sheetsNeedingReview.length > 0) {
          setShowMapperDialog(true);
          return;
        }
      }

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
    const transformedData = transformData(rawData, template, customMappings);
    
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
    
    const customMappings: Record<string, ColumnMapping[]> = {
      [currentSheetName]: mappings
    };
    
    if (currentSheetIndex < sheetsNeedingReview.length - 1) {
      setCurrentSheetIndex(prev => prev + 1);
      return;
    }
    
    setShowMapperDialog(false);
    await processAndSaveData(pendingData, pendingFileName, pendingValidation, customMappings);
    
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

  const handleOpenGoogleSheets = () => {
    if (googleSheetLink) {
      window.open(googleSheetLink, '_blank');
      toast.info('Aberto no Google Sheets - faça uma cópia para editar');
    }
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

  // Count required vs optional columns
  const getTotalColumns = () => {
    let required = 0;
    let optional = 0;
    template.sheets.forEach(sheet => {
      sheet.columns.forEach(col => {
        if (col.required) required++;
        else optional++;
      });
    });
    return { required, optional };
  };

  const columnCounts = getTotalColumns();

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

        <DialogContent className="sm:max-w-2xl bg-card border-border max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle className="text-foreground flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
              {template.pageName}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {template.description}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-2">
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

            {/* Sheet Preview Section */}
            <div className="space-y-3">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setShowPreview(!showPreview)}
              >
                <div className="flex items-center gap-2">
                  <Table className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    Estrutura das Planilhas
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {template.sheets.length} aba{template.sheets.length > 1 ? 's' : ''}
                  </Badge>
                </div>
                {showPreview ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>

              {showPreview && (
                <div className="space-y-2">
                  {/* Summary */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground px-2">
                    <span className="flex items-center gap-1">
                      <Asterisk className="h-3 w-3 text-destructive" />
                      {columnCounts.required} campos obrigatórios
                    </span>
                    <span>{columnCounts.optional} opcionais</span>
                    <span className="text-primary">✨ Campos calculados são automáticos</span>
                  </div>

                  {/* Sheet Details */}
                  {template.sheets.map((sheet) => (
                    <Collapsible 
                      key={sheet.sheetName}
                      open={expandedSheets.includes(sheet.sheetName)}
                      onOpenChange={() => toggleSheetExpanded(sheet.sheetName)}
                    >
                      <Card className="border-border/50 overflow-hidden">
                        <CollapsibleTrigger className="w-full">
                          <div className="flex items-center justify-between p-3 hover:bg-muted/30 transition-colors">
                            <div className="flex items-center gap-2">
                              {expandedSheets.includes(sheet.sheetName) ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className="font-medium text-sm text-foreground">
                                {sheet.sheetName.replace(/_/g, ' ')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {sheet.columns.filter(c => c.required).length} obrigatórios
                              </Badge>
                              <Badge variant="outline" className="text-xs text-muted-foreground">
                                {sheet.sampleData.length} linhas exemplo
                              </Badge>
                            </div>
                          </div>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent>
                          <Separator />
                          <div className="p-3 bg-muted/20">
                            <div className="grid gap-2">
                              {sheet.columns.map((col) => (
                                <div 
                                  key={col.key}
                                  className="flex items-start gap-3 text-sm"
                                >
                                  <div className="flex items-center gap-1 min-w-[100px]">
                                    {col.required && (
                                      <Asterisk className="h-3 w-3 text-destructive shrink-0" />
                                    )}
                                    <span className={`font-mono text-xs ${col.required ? 'text-foreground' : 'text-muted-foreground'}`}>
                                      {col.label}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 text-muted-foreground shrink-0">
                                    {getTypeIcon(col.type)}
                                    <span className="text-xs">{getTypeLabel(col.type)}</span>
                                  </div>
                                  {col.description && (
                                    <span className="text-xs text-muted-foreground/70 truncate">
                                      {col.description}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Download Options */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Baixe o template ou use o Google Sheets:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleDownloadTemplate}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <Download className="h-4 w-4" />
                  Baixar Excel (.xlsx)
                </Button>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleOpenGoogleSheets}
                        variant="outline"
                        className="w-full gap-2"
                        disabled={!googleSheetLink || googleSheetLink.includes('example')}
                      >
                        <ExternalLink className="h-4 w-4" />
                        Google Sheets
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {googleSheetLink?.includes('example') 
                        ? 'Link do Google Sheets ainda não configurado'
                        : 'Abrir template no Google Sheets'
                      }
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>

          {/* Fixed Footer Actions */}
          <div className="shrink-0 pt-4 border-t border-border space-y-2">
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
              size="lg"
            >
              <Upload className="h-4 w-4" />
              {isUploading ? 'Processando...' : 'Enviar Planilha Preenchida'}
            </Button>

            {uploadInfo && (
              <Button
                onClick={handleClearData}
                variant="ghost"
                className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                size="sm"
              >
                <Trash2 className="h-4 w-4" />
                Remover dados e usar exemplo
              </Button>
            )}
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