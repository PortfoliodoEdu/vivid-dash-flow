import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle,
  Download, 
  X,
  ArrowRight,
  Database,
  Table,
  ExternalLink,
  Loader2,
  Link2,
  Search,
  Columns
} from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { 
  smartTemplates, 
  generateSmartTemplate, 
  analyzeUploadedFile, 
  processUploadedData,
  type FileAnalysis,
  type SheetMappingAnalysis
} from '@/lib/smartTemplates';
import SmartColumnMapper, { type ColumnMappingItem, type TargetColumn } from './SmartColumnMapper';
import { toast } from 'sonner';

interface SmartUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageId: string;
  onDataLoaded: (data: Record<string, any[]>, fileName: string) => void;
  googleSheetsUrl?: string;
}

type Step = 'template' | 'upload' | 'mapping-intro' | 'mapping' | 'preview';

const SmartUploadModal: React.FC<SmartUploadModalProps> = ({ 
  isOpen, 
  onClose, 
  pageId, 
  onDataLoaded,
  googleSheetsUrl 
}) => {
  const [step, setStep] = useState<Step>('template');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fileAnalysis, setFileAnalysis] = useState<FileAnalysis | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [currentMappingSheetIndex, setCurrentMappingSheetIndex] = useState(0);
  const [confirmedMappings, setConfirmedMappings] = useState<Record<string, { sourceColumn: string; targetKey: string }[]>>({});

  const template = smartTemplates[pageId];

  const handleDownloadTemplate = () => {
    try {
      const buffer = generateSmartTemplate(pageId);
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `template_${template?.name || pageId}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Template baixado! Preencha os dados e faça upload.");
    } catch (e) {
      toast.error("Erro ao gerar template.");
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsAnalyzing(true);
    setUploadedFile(file);

    try {
      const analysis = await analyzeUploadedFile(file, pageId);
      setFileAnalysis(analysis);
      
      // Check if we need column mapping
      if (analysis.needsColumnMapping) {
        setCurrentMappingSheetIndex(0);
        setStep('mapping-intro');
      } else {
        setStep('preview');
        if (analysis.warnings.length > 0) {
          toast.warning("Arquivo lido com avisos. Verifique os detalhes.");
        } else {
          toast.success("Arquivo analisado com sucesso!");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao processar arquivo.");
      setUploadedFile(null);
    } finally {
      setIsAnalyzing(false);
    }
  }, [pageId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'] 
    },
    maxFiles: 1,
    disabled: isAnalyzing
  });

  const getSheetsNeedingMapping = () => {
    if (!fileAnalysis) return [];
    return fileAnalysis.sheets.filter(s => s.mappingAnalysis?.needsReview);
  };

  const handleMappingConfirm = (mappings: ColumnMappingItem[]) => {
    const sheetsNeedingMapping = getSheetsNeedingMapping();
    const currentSheet = sheetsNeedingMapping[currentMappingSheetIndex];
    
    if (!currentSheet) return;

    // Save confirmed mappings
    const validMappings = mappings
      .filter(m => m.targetKey !== null)
      .map(m => ({ sourceColumn: m.sourceColumn, targetKey: m.targetKey! }));
    
    setConfirmedMappings(prev => ({
      ...prev,
      [currentSheet.name]: validMappings
    }));

    // Move to next sheet or preview
    if (currentMappingSheetIndex < sheetsNeedingMapping.length - 1) {
      setCurrentMappingSheetIndex(prev => prev + 1);
    } else {
      setStep('preview');
      toast.success("Mapeamento concluído!");
    }
  };

  const handleMappingCancel = () => {
    setStep('upload');
    setFileAnalysis(null);
    setUploadedFile(null);
    setConfirmedMappings({});
    setCurrentMappingSheetIndex(0);
  };

  const handleConfirmImport = async () => {
    if (!uploadedFile) {
      console.error('[SmartUploadModal] No uploaded file');
      return;
    }

    console.log('[SmartUploadModal] Starting import...', { fileName: uploadedFile.name });

    try {
      // Use confirmed mappings if any, otherwise auto-detected mappings
      const allMappings: Record<string, { sourceColumn: string; targetKey: string }[]> = { ...confirmedMappings };
      
      // Add auto-detected mappings for sheets that didn't need review
      fileAnalysis?.sheets.forEach(sheet => {
        if (!allMappings[sheet.name] && sheet.mappingAnalysis) {
          const autoMappings = sheet.mappingAnalysis.suggestedMappings
            .filter(m => m.targetKey !== null)
            .map(m => ({ sourceColumn: m.sourceColumn, targetKey: m.targetKey! }));
          if (autoMappings.length > 0) {
            allMappings[sheet.name] = autoMappings;
          }
        }
      });

      console.log('[SmartUploadModal] Mappings:', allMappings);

      const data = await processUploadedData(uploadedFile, Object.keys(allMappings).length > 0 ? allMappings : undefined);
      
      console.log('[SmartUploadModal] Processed data:', data);
      console.log('[SmartUploadModal] Calling onDataLoaded...');
      
      onDataLoaded(data, uploadedFile.name);
      
      console.log('[SmartUploadModal] onDataLoaded called successfully');
      
      toast.success(`${fileAnalysis?.totalRows || 0} registros importados com sucesso!`);
      handleClose();
    } catch (error: any) {
      console.error('[SmartUploadModal] Import error:', error);
      toast.error(error.message || "Erro ao importar dados.");
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep('template');
      setFileAnalysis(null);
      setUploadedFile(null);
      setConfirmedMappings({});
      setCurrentMappingSheetIndex(0);
    }, 300);
  };

  const handleBack = () => {
    if (step === 'preview') {
      const sheetsNeedingMapping = getSheetsNeedingMapping();
      if (sheetsNeedingMapping.length > 0) {
        setCurrentMappingSheetIndex(sheetsNeedingMapping.length - 1);
        setStep('mapping');
      } else {
        setStep('upload');
        setFileAnalysis(null);
        setUploadedFile(null);
      }
    } else if (step === 'mapping') {
      if (currentMappingSheetIndex > 0) {
        setCurrentMappingSheetIndex(prev => prev - 1);
      } else {
        setStep('mapping-intro');
      }
    } else if (step === 'mapping-intro') {
      setStep('upload');
      setFileAnalysis(null);
      setUploadedFile(null);
      setConfirmedMappings({});
    } else if (step === 'upload') {
      setStep('template');
    }
  };

  if (!template) return null;

  const sheetsNeedingMapping = getSheetsNeedingMapping();
  const currentMappingSheet = sheetsNeedingMapping[currentMappingSheetIndex];

  // Determine progress step
  const getProgressSteps = () => {
    const base = ['template', 'upload'];
    if (fileAnalysis?.needsColumnMapping) {
      base.push('mapping-intro', 'mapping');
    }
    base.push('preview');
    return base;
  };
  const progressSteps = getProgressSteps();

  // Get required fields for intro display
  const getRequiredFields = () => {
    if (!fileAnalysis || !currentMappingSheet?.mappingAnalysis) return [];
    return currentMappingSheet.mappingAnalysis.targetColumns
      .filter(c => c.required)
      .map(c => c.label);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={`p-0 overflow-hidden bg-card border-border/50 rounded-xl ${step === 'mapping' ? 'sm:max-w-[900px]' : 'sm:max-w-[700px]'}`}>
        <VisuallyHidden.Root>
          <DialogTitle>Central de Importação - {template.name}</DialogTitle>
          <DialogDescription>Importe dados para o dashboard {template.name}</DialogDescription>
        </VisuallyHidden.Root>
        
        {/* Header - Simplified */}
        <div className="bg-gradient-to-r from-primary to-primary/80 p-5 text-primary-foreground">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              {step === 'mapping' || step === 'mapping-intro' ? (
                <Link2 className="w-6 h-6" />
              ) : (
                <Database className="w-6 h-6" />
              )}
              <div>
                <h2 className="text-xl font-bold">
                  {step === 'template' && 'Estrutura dos Dados'}
                  {step === 'upload' && 'Upload do Arquivo'}
                  {step === 'mapping-intro' && 'Preparando Mapeamento'}
                  {step === 'mapping' && 'Conectar Colunas'}
                  {step === 'preview' && 'Confirmar Importação'}
                </h2>
                <p className="text-sm text-primary-foreground/70">
                  {step === 'mapping' && sheetsNeedingMapping.length > 1
                    ? `Planilha ${currentMappingSheetIndex + 1} de ${sheetsNeedingMapping.length}`
                    : template.name
                  }
                </p>
              </div>
            </div>
            <button 
              onClick={handleClose} 
              className="text-primary-foreground/60 hover:text-primary-foreground transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Progress - Simpler visual */}
          <div className="flex items-center gap-1 mt-4">
            {progressSteps.map((s, i) => {
              const isCurrent = step === s;
              const isPast = progressSteps.indexOf(step) > i;
              return (
                <div 
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-all ${
                    isCurrent 
                      ? 'bg-primary-foreground' 
                      : isPast 
                        ? 'bg-primary-foreground/80' 
                        : 'bg-primary-foreground/20'
                  }`}
                />
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Template Info */}
          {step === 'template' && (
            <div className="space-y-5 animate-in fade-in duration-300">
              {/* Sheets Preview - Compact */}
              <div className="space-y-3 max-h-[280px] overflow-y-auto">
                {template.sheets.map((sheet, idx) => (
                  <div 
                    key={idx} 
                    className="border border-border rounded-lg overflow-hidden bg-muted/20"
                  >
                    <div className="bg-muted/50 px-4 py-2 flex items-center gap-2">
                      <Table className="w-4 h-4 text-primary" />
                      <span className="font-medium text-foreground text-sm">{sheet.name}</span>
                    </div>
                    <div className="p-3">
                      <div className="flex flex-wrap gap-1.5">
                        {sheet.columns.map((col, colIdx) => (
                          <span 
                            key={colIdx}
                            className={`
                              px-2 py-1 rounded text-xs
                              ${col.required 
                                ? 'bg-primary/10 text-primary font-medium' 
                                : 'bg-muted text-muted-foreground'}
                            `}
                          >
                            {col.label}{col.required && ' *'}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-muted-foreground text-center">
                * Campos obrigatórios
              </p>

              {/* Actions - Simplified */}
              <div className="space-y-2 pt-2">
                <Button 
                  onClick={() => setStep('upload')} 
                  className="w-full gap-2"
                >
                  Fazer Upload
                  <ArrowRight className="w-4 h-4" />
                </Button>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleDownloadTemplate}
                    variant="ghost"
                    className="flex-1 gap-2 text-muted-foreground"
                    size="sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Baixar Template
                  </Button>
                  
                  {googleSheetsUrl && (
                    <Button 
                      variant="ghost"
                      className="flex-1 gap-2 text-muted-foreground"
                      size="sm"
                      onClick={() => window.open(googleSheetsUrl, '_blank')}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Google Sheets
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Upload */}
          {step === 'upload' && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div 
                {...getRootProps()} 
                className={`
                  border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
                  ${isAnalyzing 
                    ? 'border-muted bg-muted/50 cursor-wait' 
                    : isDragActive 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50 hover:bg-muted/20'}
                `}
              >
                <input {...getInputProps()} />
                
                <div className={`
                  mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-3
                  ${isDragActive ? 'bg-primary/10' : 'bg-muted'}
                `}>
                  {isAnalyzing ? (
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  ) : (
                    <UploadCloud className={`w-8 h-8 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  )}
                </div>
                
                <p className="text-base font-medium text-foreground">
                  {isAnalyzing 
                    ? "Analisando..." 
                    : isDragActive 
                      ? "Solte aqui" 
                      : "Arraste sua planilha"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  .xlsx, .xls ou .csv
                </p>
              </div>

              <Button variant="ghost" onClick={handleBack} className="w-full text-muted-foreground">
                ← Voltar
              </Button>
            </div>
          )}

          {/* Step 2.5: Mapping Intro - Onboarding */}
          {step === 'mapping-intro' && fileAnalysis && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              {/* Visual Checklist */}
              <div className="space-y-4">
                {/* File loaded */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Arquivo carregado</p>
                    <p className="text-sm text-muted-foreground">{fileAnalysis.fileName}</p>
                  </div>
                </div>

                {/* Columns found */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Search className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Colunas identificadas</p>
                    <p className="text-sm text-muted-foreground">
                      {currentMappingSheet?.mappingAnalysis?.sourceColumns.length || 0} colunas encontradas no seu arquivo
                    </p>
                  </div>
                </div>

                {/* Next step */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <Columns className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Próximo: conectar aos campos</p>
                    <p className="text-sm text-muted-foreground">
                      Indique qual coluna do seu arquivo corresponde a cada campo do sistema.
                    </p>
                  </div>
                </div>
              </div>

              {/* Required Fields Info */}
              {getRequiredFields().length > 0 && (
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
                  <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-3">
                    Campos obrigatórios que você precisará conectar:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {getRequiredFields().map((field, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-sm font-medium"
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <Button 
                  onClick={() => setStep('mapping')} 
                  className="w-full gap-2"
                >
                  Continuar para Mapeamento
                  <ArrowRight className="w-4 h-4" />
                </Button>
                
                <Button variant="ghost" onClick={handleBack} className="w-full text-muted-foreground">
                  ← Voltar
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Column Mapping */}
          {step === 'mapping' && currentMappingSheet?.mappingAnalysis && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <SmartColumnMapper
                sheetName={currentMappingSheet.name}
                sourceColumns={currentMappingSheet.mappingAnalysis.sourceColumns}
                targetColumns={currentMappingSheet.mappingAnalysis.targetColumns.map(c => ({
                  key: c.key,
                  label: c.label,
                  required: c.required,
                  description: c.description,
                  type: c.type
                }))}
                suggestedMappings={currentMappingSheet.mappingAnalysis.suggestedMappings}
                onConfirm={handleMappingConfirm}
                onCancel={handleMappingCancel}
              />
            </div>
          )}

          {/* Step 4: Preview */}
          {step === 'preview' && fileAnalysis && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              {/* Success Header - Compact */}
              <div className="flex items-center gap-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="bg-green-500/10 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">Pronto para importar</h3>
                  <p className="text-sm text-muted-foreground truncate">{fileAnalysis.fileName}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-2xl font-bold text-foreground">
                    {fileAnalysis.totalRows.toLocaleString('pt-BR')}
                  </div>
                  <div className="text-xs text-muted-foreground">registros</div>
                </div>
              </div>

              {/* Sheets summary - if multiple */}
              {fileAnalysis.sheets.length > 1 && (
                <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                  {fileAnalysis.sheets.map((sheet, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        {sheet.name}
                      </span>
                      <span className="text-foreground">{sheet.rows} linhas</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Warnings - Compact */}
              {fileAnalysis.warnings.length > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{fileAnalysis.warnings[0]}</span>
                  </div>
                </div>
              )}

              {/* Actions - Clear */}
              <div className="flex gap-3 pt-3">
                <Button variant="ghost" onClick={handleBack} className="flex-1 text-muted-foreground">
                  Voltar
                </Button>
                <Button onClick={handleConfirmImport} className="flex-1 gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Importar Dados
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SmartUploadModal;
