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
  Loader2
} from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent } from './ui/dialog';
import { 
  smartTemplates, 
  generateSmartTemplate, 
  analyzeUploadedFile, 
  processUploadedData,
  type FileAnalysis 
} from '@/lib/smartTemplates';
import { toast } from 'sonner';

interface SmartUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageId: string;
  onDataLoaded: (data: Record<string, any[]>, fileName: string) => void;
  googleSheetsUrl?: string;
}

type Step = 'template' | 'upload' | 'preview';

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
      setStep('preview');
      
      if (analysis.warnings.length > 0) {
        toast.warning("Arquivo lido com avisos. Verifique os detalhes.");
      } else {
        toast.success("Arquivo analisado com sucesso!");
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

  const handleConfirmImport = async () => {
    if (!uploadedFile) return;

    try {
      const data = await processUploadedData(uploadedFile);
      onDataLoaded(data, uploadedFile.name);
      toast.success(`${fileAnalysis?.totalRows || 0} registros importados com sucesso!`);
      handleClose();
    } catch (error: any) {
      toast.error(error.message || "Erro ao importar dados.");
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep('template');
      setFileAnalysis(null);
      setUploadedFile(null);
    }, 300);
  };

  const handleBack = () => {
    if (step === 'preview') {
      setStep('upload');
      setFileAnalysis(null);
      setUploadedFile(null);
    } else if (step === 'upload') {
      setStep('template');
    }
  };

  if (!template) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-card border-border/50 rounded-xl">
        
        {/* Header Gradient */}
        <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Database className="w-7 h-7" />
                Central de Importação
              </h2>
              <p className="text-primary-foreground/80 mt-1">
                {template.name} — {template.description}
              </p>
            </div>
            <button 
              onClick={handleClose} 
              className="text-primary-foreground/60 hover:text-primary-foreground transition-colors p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center gap-2 mt-6">
            {['template', 'upload', 'preview'].map((s, i) => (
              <React.Fragment key={s}>
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all
                  ${step === s || ['template', 'upload', 'preview'].indexOf(step) > i
                    ? 'bg-primary-foreground text-primary' 
                    : 'bg-primary-foreground/20 text-primary-foreground/60'}
                `}>
                  {i + 1}
                </div>
                {i < 2 && (
                  <div className={`flex-1 h-0.5 ${
                    ['template', 'upload', 'preview'].indexOf(step) > i 
                      ? 'bg-primary-foreground' 
                      : 'bg-primary-foreground/20'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Template Info */}
          {step === 'template' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Estrutura do Template
                </h3>
                <p className="text-sm text-muted-foreground">
                  Você só precisa preencher dados brutos. O sistema calcula o resto automaticamente.
                </p>
              </div>

              {/* Sheets Preview */}
              <div className="space-y-4">
                {template.sheets.map((sheet, idx) => (
                  <div 
                    key={idx} 
                    className="border border-border rounded-lg overflow-hidden bg-muted/30"
                  >
                    <div className="bg-muted px-4 py-3 flex items-center gap-2">
                      <Table className="w-4 h-4 text-primary" />
                      <span className="font-medium text-foreground">{sheet.name}</span>
                      <span className="text-xs text-muted-foreground">— {sheet.description}</span>
                    </div>
                    <div className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {sheet.columns.map((col, colIdx) => (
                          <div 
                            key={colIdx}
                            className={`
                              px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5
                              ${col.required 
                                ? 'bg-primary/10 text-primary border border-primary/20' 
                                : 'bg-muted text-muted-foreground'}
                            `}
                            title={col.description}
                          >
                            <span>{col.label}</span>
                            {col.required && <span className="text-primary">*</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button 
                  onClick={handleDownloadTemplate}
                  variant="outline"
                  className="flex-1 gap-2"
                >
                  <Download className="w-4 h-4" />
                  Baixar Template XLSX
                </Button>
                
                {googleSheetsUrl && (
                  <Button 
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() => window.open(googleSheetsUrl, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Abrir no Google Sheets
                  </Button>
                )}
              </div>

              <Button 
                onClick={() => setStep('upload')} 
                className="w-full gap-2"
              >
                Já tenho os dados preenchidos
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Step 2: Upload */}
          {step === 'upload' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Faça o Upload
                </h3>
                <p className="text-sm text-muted-foreground">
                  Arraste seu arquivo ou clique para selecionar.
                </p>
              </div>

              <div 
                {...getRootProps()} 
                className={`
                  border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer
                  ${isAnalyzing 
                    ? 'border-muted bg-muted/50 cursor-wait' 
                    : isDragActive 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50 hover:bg-muted/30'}
                `}
              >
                <input {...getInputProps()} />
                
                <div className={`
                  mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4
                  ${isDragActive ? 'bg-primary/10' : 'bg-muted'}
                `}>
                  {isAnalyzing ? (
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  ) : (
                    <UploadCloud className={`w-10 h-10 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  )}
                </div>
                
                <p className="text-lg font-medium text-foreground">
                  {isAnalyzing 
                    ? "Analisando arquivo..." 
                    : isDragActive 
                      ? "Solte o arquivo aqui..." 
                      : "Arraste e solte sua planilha"}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Suporta arquivos .xlsx, .xls ou .csv
                </p>
              </div>

              <Button variant="ghost" onClick={handleBack} className="w-full">
                ← Voltar para estrutura
              </Button>
            </div>
          )}

          {/* Step 3: Preview */}
          {step === 'preview' && fileAnalysis && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              {/* Success Header */}
              <div className="text-center py-2">
                <div className="mx-auto bg-green-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Arquivo Analisado!</h3>
                <p className="text-muted-foreground">{fileAnalysis.fileName}</p>
              </div>

              {/* Summary */}
              <div className="bg-muted/50 rounded-lg p-4 border border-border space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Total de registros</span>
                  <span className="font-mono font-bold text-xl text-foreground">
                    {fileAnalysis.totalRows.toLocaleString('pt-BR')}
                  </span>
                </div>

                {fileAnalysis.sheets.map((sheet, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <FileSpreadsheet className="w-4 h-4" />
                      {sheet.name}
                    </span>
                    <span className="text-foreground">{sheet.rows} linhas</span>
                  </div>
                ))}
              </div>

              {/* Warnings */}
              {fileAnalysis.warnings.length > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-600 dark:text-amber-400 mb-1">
                        Atenção
                      </p>
                      <ul className="text-sm text-amber-600/80 dark:text-amber-400/80 space-y-1">
                        {fileAnalysis.warnings.map((w, i) => (
                          <li key={i}>• {w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Note */}
              <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 text-sm text-primary flex items-center gap-2">
                <Database className="w-4 h-4 flex-shrink-0" />
                O sistema recalculará todos os indicadores automaticamente.
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button variant="ghost" onClick={handleBack} className="flex-1">
                  Voltar
                </Button>
                <Button onClick={handleConfirmImport} className="flex-1 gap-2">
                  Confirmar Importação
                  <ArrowRight className="w-4 h-4" />
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
