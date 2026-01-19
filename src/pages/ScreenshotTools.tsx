import React, { useState, useRef, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { 
  Upload, 
  Image as ImageIcon, 
  MessageSquare, 
  PenTool, 
  ScanText, 
  Download, 
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Copy,
  Check,
  Loader2,
  ArrowLeft,
  Grid,
  List
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface ScreenshotItem {
  id: string;
  file: File;
  url: string;
  name: string;
  uploadedAt: Date;
  extractedText?: string;
  annotations?: Annotation[];
  chatMessages?: ChatMessage[];
}

interface Annotation {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  text?: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  isReply?: boolean;
  replyTo?: string;
}

export default function ScreenshotTools() {
  const [screenshots, setScreenshots] = useState<ScreenshotItem[]>([]);
  const [selectedScreenshot, setSelectedScreenshot] = useState<ScreenshotItem | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [annotationColor, setAnnotationColor] = useState('#ef4444');
  const [currentAnnotation, setCurrentAnnotation] = useState<Partial<Annotation> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newScreenshots: ScreenshotItem[] = [];
    
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        newScreenshots.push({
          id: crypto.randomUUID(),
          file,
          url,
          name: file.name,
          uploadedAt: new Date(),
          annotations: [],
          chatMessages: []
        });
      }
    });

    setScreenshots(prev => [...prev, ...newScreenshots]);
    toast.success(`${newScreenshots.length} screenshot(s) uploaded`);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    
    const newScreenshots: ScreenshotItem[] = [];
    
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        newScreenshots.push({
          id: crypto.randomUUID(),
          file,
          url,
          name: file.name,
          uploadedAt: new Date(),
          annotations: [],
          chatMessages: []
        });
      }
    });

    setScreenshots(prev => [...prev, ...newScreenshots]);
    toast.success(`${newScreenshots.length} screenshot(s) uploaded`);
  }, []);

  const deleteScreenshot = (id: string) => {
    setScreenshots(prev => prev.filter(s => s.id !== id));
    if (selectedScreenshot?.id === id) {
      setSelectedScreenshot(null);
    }
    toast.success('Screenshot deleted');
  };

  const extractText = async (screenshot: ScreenshotItem) => {
    setIsExtracting(true);
    try {
      // Convert image to base64
      const response = await fetch(screenshot.url);
      const blob = await response.blob();
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

      // Use Lovable AI for OCR
      const { data, error } = await supabase.functions.invoke('ai-ocr', {
        body: { imageBase64: base64 }
      });

      if (error) throw error;

      const extractedText = data?.text || 'No text could be extracted from this image.';
      
      setScreenshots(prev => prev.map(s => 
        s.id === screenshot.id ? { ...s, extractedText } : s
      ));
      
      if (selectedScreenshot?.id === screenshot.id) {
        setSelectedScreenshot(prev => prev ? { ...prev, extractedText } : null);
      }

      toast.success('Text extracted successfully');
    } catch (error) {
      console.error('OCR error:', error);
      toast.error('Failed to extract text. Please try again.');
    } finally {
      setIsExtracting(false);
    }
  };

  const parseChatFromScreenshot = async (screenshot: ScreenshotItem) => {
    setIsExtracting(true);
    try {
      const response = await fetch(screenshot.url);
      const blob = await response.blob();
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

      const { data, error } = await supabase.functions.invoke('ai-chat-parser', {
        body: { imageBase64: base64 }
      });

      if (error) throw error;

      const chatMessages = data?.messages || [];
      
      setScreenshots(prev => prev.map(s => 
        s.id === screenshot.id ? { ...s, chatMessages } : s
      ));
      
      if (selectedScreenshot?.id === screenshot.id) {
        setSelectedScreenshot(prev => prev ? { ...prev, chatMessages } : null);
      }

      toast.success('Chat parsed successfully');
    } catch (error) {
      console.error('Chat parse error:', error);
      toast.error('Failed to parse chat. Please try again.');
    } finally {
      setIsExtracting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const downloadImage = (screenshot: ScreenshotItem) => {
    const link = document.createElement('a');
    link.href = screenshot.url;
    link.download = screenshot.name;
    link.click();
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isAnnotating || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCurrentAnnotation({
      id: crypto.randomUUID(),
      x,
      y,
      width: 0,
      height: 0,
      color: annotationColor
    });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!currentAnnotation || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCurrentAnnotation(prev => prev ? {
      ...prev,
      width: x - prev.x!,
      height: y - prev.y!
    } : null);
  };

  const handleCanvasMouseUp = () => {
    if (!currentAnnotation || !selectedScreenshot) return;
    
    if (Math.abs(currentAnnotation.width || 0) > 10 && Math.abs(currentAnnotation.height || 0) > 10) {
      const newAnnotation = currentAnnotation as Annotation;
      
      setScreenshots(prev => prev.map(s => 
        s.id === selectedScreenshot.id 
          ? { ...s, annotations: [...(s.annotations || []), newAnnotation] }
          : s
      ));
      
      setSelectedScreenshot(prev => prev ? {
        ...prev,
        annotations: [...(prev.annotations || []), newAnnotation]
      } : null);
    }
    
    setCurrentAnnotation(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Screenshot Tools</h1>
            <p className="text-muted-foreground">Gallery • Chat Parser • Annotations • OCR</p>
          </div>
        </div>

        <Tabs defaultValue="gallery" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-lg">
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="annotate" className="flex items-center gap-2">
              <PenTool className="h-4 w-4" />
              Annotate
            </TabsTrigger>
            <TabsTrigger value="ocr" className="flex items-center gap-2">
              <ScanText className="h-4 w-4" />
              OCR
            </TabsTrigger>
          </TabsList>

          {/* Upload Area - Shared across tabs */}
          <Card 
            className="border-dashed border-2 hover:border-primary transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
          >
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Upload className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Drop screenshots here or click to upload</p>
              <p className="text-sm text-muted-foreground mt-1">Supports PNG, JPG, WEBP</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
            </CardContent>
          </Card>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <Badge variant="secondary">{screenshots.length} screenshots</Badge>
            </div>

            {screenshots.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No screenshots uploaded yet. Drop or upload images above.
                </CardContent>
              </Card>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
                : 'space-y-4'
              }>
                {screenshots.map(screenshot => (
                  <Card key={screenshot.id} className="overflow-hidden group">
                    <div className="relative">
                      <img
                        src={screenshot.url}
                        alt={screenshot.name}
                        className={viewMode === 'grid' 
                          ? 'w-full h-48 object-cover'
                          : 'w-full h-64 object-contain bg-muted'
                        }
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button size="sm" variant="secondary" onClick={() => downloadImage(screenshot)}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteScreenshot(screenshot.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <p className="font-medium truncate text-sm">{screenshot.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {screenshot.uploadedAt.toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Chat Parser Tab */}
          <TabsContent value="chat" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Select Screenshot</CardTitle>
                  <CardDescription>Choose a chat screenshot to parse</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {screenshots.map(screenshot => (
                        <div
                          key={screenshot.id}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedScreenshot?.id === screenshot.id
                              ? 'bg-primary/10 border border-primary'
                              : 'hover:bg-muted'
                          }`}
                          onClick={() => setSelectedScreenshot(screenshot)}
                        >
                          <img
                            src={screenshot.url}
                            alt={screenshot.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium truncate">{screenshot.name}</p>
                            {screenshot.chatMessages?.length ? (
                              <Badge variant="secondary" className="mt-1">
                                {screenshot.chatMessages.length} messages parsed
                              </Badge>
                            ) : null}
                          </div>
                        </div>
                      ))}
                      {screenshots.length === 0 && (
                        <p className="text-muted-foreground text-center py-8">
                          Upload chat screenshots to parse
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Parsed Chat</CardTitle>
                  <CardDescription>
                    {selectedScreenshot ? (
                      <Button 
                        size="sm" 
                        onClick={() => parseChatFromScreenshot(selectedScreenshot)}
                        disabled={isExtracting}
                      >
                        {isExtracting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Parsing...
                          </>
                        ) : (
                          <>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Parse Chat
                          </>
                        )}
                      </Button>
                    ) : 'Select a screenshot to parse'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    {selectedScreenshot?.chatMessages?.length ? (
                      <div className="space-y-4">
                        {selectedScreenshot.chatMessages.map((msg, i) => (
                          <div key={i} className={`flex flex-col ${msg.isReply ? 'items-end' : 'items-start'}`}>
                            {msg.replyTo && (
                              <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded mb-1 max-w-[80%] truncate">
                                ↩ {msg.replyTo}
                              </div>
                            )}
                            <div className={`max-w-[80%] rounded-lg p-3 ${
                              msg.isReply 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted'
                            }`}>
                              <p className="font-medium text-sm">{msg.sender}</p>
                              <p className="text-sm mt-1">{msg.message}</p>
                              <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-12">
                        {selectedScreenshot 
                          ? 'Click "Parse Chat" to extract messages'
                          : 'Select a screenshot to see parsed chat'
                        }
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Annotation Tab */}
          <TabsContent value="annotate" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Annotation Canvas
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setZoom(prev => Math.max(25, prev - 25))}
                      >
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <span className="text-sm bg-muted px-3 py-1 rounded">{zoom}%</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setZoom(prev => Math.min(200, prev + 25))}
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setRotation(prev => (prev + 90) % 360)}
                      >
                        <RotateCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative overflow-auto bg-muted rounded-lg min-h-[400px] flex items-center justify-center">
                    {selectedScreenshot ? (
                      <div className="relative" style={{ transform: `scale(${zoom/100}) rotate(${rotation}deg)` }}>
                        <img
                          src={selectedScreenshot.url}
                          alt="Annotate"
                          className="max-w-full"
                        />
                        {selectedScreenshot.annotations?.map(ann => (
                          <div
                            key={ann.id}
                            className="absolute border-2 pointer-events-none"
                            style={{
                              left: ann.x,
                              top: ann.y,
                              width: ann.width,
                              height: ann.height,
                              borderColor: ann.color,
                              backgroundColor: `${ann.color}20`
                            }}
                          />
                        ))}
                        <canvas
                          ref={canvasRef}
                          className="absolute inset-0 cursor-crosshair"
                          width={500}
                          height={500}
                          onMouseDown={handleCanvasMouseDown}
                          onMouseMove={handleCanvasMouseMove}
                          onMouseUp={handleCanvasMouseUp}
                        />
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Select a screenshot to annotate</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tools</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      className="w-full"
                      variant={isAnnotating ? 'default' : 'outline'}
                      onClick={() => setIsAnnotating(!isAnnotating)}
                    >
                      <PenTool className="h-4 w-4 mr-2" />
                      {isAnnotating ? 'Drawing Mode ON' : 'Start Annotating'}
                    </Button>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Color</label>
                      <div className="flex gap-2">
                        {['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6'].map(color => (
                          <button
                            key={color}
                            className={`w-8 h-8 rounded-full border-2 ${
                              annotationColor === color ? 'border-primary' : 'border-transparent'
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => setAnnotationColor(color)}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Screenshots</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[200px]">
                      <div className="space-y-2">
                        {screenshots.map(screenshot => (
                          <div
                            key={screenshot.id}
                            className={`flex items-center gap-2 p-2 rounded cursor-pointer ${
                              selectedScreenshot?.id === screenshot.id
                                ? 'bg-primary/10'
                                : 'hover:bg-muted'
                            }`}
                            onClick={() => setSelectedScreenshot(screenshot)}
                          >
                            <img src={screenshot.url} alt="" className="w-10 h-10 object-cover rounded" />
                            <span className="text-sm truncate">{screenshot.name}</span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* OCR Tab */}
          <TabsContent value="ocr" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Select Screenshot</CardTitle>
                  <CardDescription>Choose an image to extract text from</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {screenshots.map(screenshot => (
                        <div
                          key={screenshot.id}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedScreenshot?.id === screenshot.id
                              ? 'bg-primary/10 border border-primary'
                              : 'hover:bg-muted'
                          }`}
                          onClick={() => setSelectedScreenshot(screenshot)}
                        >
                          <img
                            src={screenshot.url}
                            alt={screenshot.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium truncate">{screenshot.name}</p>
                            {screenshot.extractedText && (
                              <Badge variant="secondary" className="mt-1">
                                <Check className="h-3 w-3 mr-1" />
                                Text extracted
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                      {screenshots.length === 0 && (
                        <p className="text-muted-foreground text-center py-8">
                          Upload images to extract text
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Extracted Text</CardTitle>
                  <CardDescription>
                    {selectedScreenshot ? (
                      <div className="flex gap-2 mt-2">
                        <Button 
                          size="sm" 
                          onClick={() => extractText(selectedScreenshot)}
                          disabled={isExtracting}
                        >
                          {isExtracting ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Extracting...
                            </>
                          ) : (
                            <>
                              <ScanText className="h-4 w-4 mr-2" />
                              Extract Text
                            </>
                          )}
                        </Button>
                        {selectedScreenshot.extractedText && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => copyToClipboard(selectedScreenshot.extractedText!)}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                        )}
                      </div>
                    ) : 'Select a screenshot to extract text'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    {selectedScreenshot?.extractedText ? (
                      <Textarea
                        value={selectedScreenshot.extractedText}
                        readOnly
                        className="min-h-[350px] font-mono text-sm"
                      />
                    ) : (
                      <div className="text-center text-muted-foreground py-12">
                        {selectedScreenshot 
                          ? 'Click "Extract Text" to perform OCR'
                          : 'Select a screenshot to see extracted text'
                        }
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
