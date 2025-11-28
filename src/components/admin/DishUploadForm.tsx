"use client";

import { useState, useRef } from "react";
import { uploadDishWithBase64, UploadProgress } from "@/lib/uploadUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Image as ImageIcon, UploadCloud, Camera } from "lucide-react";

export default function DishUploadForm() {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    category: "",
    description: "",
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // No size limit check needed - we compress automatically
      
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      alert("Please select an image first.");
      return;
    }

    if (!formData.name || !formData.price || !formData.category) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setUploadProgress({ stage: 'encoding', progress: 0, message: 'Compressing image...' });

    try {
      // Use the base64 upload workflow (which now includes compression)
      await uploadDishWithBase64(
        file,
        formData,
        (progress) => {
          setUploadProgress(progress);
        }
      );

      // Success!
      setUploadProgress({ 
        stage: 'firestore', 
        progress: 100, 
        message: '✓ Dish added successfully!' 
      });
      
      // Reset form after brief success message
      setTimeout(() => {
        setFormData({ name: "", price: 0, category: "", description: "" });
        setPreview(null);
        setUploadProgress(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }, 2000);

    } catch (error: any) {
      console.error("Error submitting form:", error);
      alert(`Error: ${error.message}`);
      setUploadProgress(null);
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = () => {
    if (!uploadProgress) return 0;
    
    // Calculate overall progress across stages
    const stageWeights = {
      encoding: 0.5,
      firestore: 0.5
    };
    
    const stageOffsets = {
      encoding: 0,
      firestore: 50
    };
    
    const stageProgress = uploadProgress.progress * stageWeights[uploadProgress.stage];
    return stageOffsets[uploadProgress.stage] + stageProgress;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-0">
      {/* Elegant Page Header */}
      <div className="mb-8 sm:mb-12 text-center">
        <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent mb-3 sm:mb-4">
          Add Signature Dish
        </h2>
        <p className="text-slate-400 text-base sm:text-lg font-light">
          Craft your culinary masterpiece
        </p>
        <div className="mt-4 sm:mt-6 w-20 sm:w-24 h-1 mx-auto bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
      </div>

      {/* Luxury Card */}
      <div className="relative">
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-600/20 via-amber-500/20 to-amber-600/20 rounded-2xl blur-xl"></div>
        
        <Card className="relative bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 border-amber-900/30 backdrop-blur-xl shadow-2xl">
          <CardContent className="p-4 sm:p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          
          {/* Image Upload Section */}
          <div className="space-y-3">
            <Label className="text-amber-200 text-xs sm:text-sm font-medium tracking-wide uppercase">Dish Photography</Label>
            <div 
              className="group border-2 border-dashed border-amber-900/40 hover:border-amber-700/60 rounded-xl p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-500 bg-gradient-to-br from-slate-800/30 to-slate-900/30 hover:from-slate-800/50 hover:to-slate-900/50"
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden ring-2 ring-amber-500/20">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <p className="text-white text-xs sm:text-sm font-light">Click to change image</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 sm:py-16">
                  <ImageIcon className="w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-3 sm:mb-4 text-amber-500/40 group-hover:text-amber-400/60 transition-colors duration-300" />
                  <p className="text-amber-200 text-sm sm:text-base font-medium mb-1 sm:mb-2">Upload Dish Image</p>
                  <p className="text-slate-500 text-xs sm:text-sm font-light">Auto-compressed & optimized</p>
                </div>
              )}
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange}
              />
            </div>
            
            {/* Mobile Camera Button */}
            <div className="md:hidden mt-2">
              <Button
                type="button"
                variant="outline"
                className="w-full border-amber-900/30 text-amber-200 hover:bg-amber-900/20 hover:text-amber-100"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.setAttribute('capture', 'environment');
                  input.onchange = (e: any) => {
                     const file = e.target.files?.[0];
                     if (file) {
                        handleFileChange({ target: { files: [file] } } as any);
                     }
                  };
                  input.click();
                }}
              >
                <Camera className="mr-2 h-4 w-4" />
                Take Photo
              </Button>
            </div>
          </div>

          {/* Text Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-3 md:col-span-2">
              <Label htmlFor="name" className="text-amber-200 text-xs sm:text-sm font-medium tracking-wide uppercase">Dish Name</Label>
              <Input 
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Coq au Vin"
                className="bg-slate-800/50 border-amber-900/30 text-slate-100 placeholder:text-slate-600 focus:border-amber-500/50 focus:ring-amber-500/20 h-11 sm:h-12 text-base sm:text-lg"
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="price" className="text-amber-200 text-xs sm:text-sm font-medium tracking-wide uppercase">Price (€)</Label>
              <Input 
                id="price"
                type="number"
                step="0.01"
                value={formData.price || ""}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                placeholder="0.00"
                className="bg-slate-800/50 border-amber-900/30 text-slate-100 placeholder:text-slate-600 focus:border-amber-500/50 focus:ring-amber-500/20 h-11 sm:h-12"
                required
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="category" className="text-amber-200 text-xs sm:text-sm font-medium tracking-wide uppercase">Category</Label>
              <Input 
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                placeholder="e.g. Entrées"
                className="bg-slate-800/50 border-amber-900/30 text-slate-100 placeholder:text-slate-600 focus:border-amber-500/50 focus:ring-amber-500/20 h-11 sm:h-12"
                required
              />
            </div>

            <div className="space-y-3 md:col-span-2">
              <Label htmlFor="description" className="text-amber-200 text-xs sm:text-sm font-medium tracking-wide uppercase">Description</Label>
              <textarea 
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe the exquisite flavors and ingredients..."
                className="w-full min-h-[100px] sm:min-h-[120px] px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-slate-800/50 border border-amber-900/30 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 resize-none text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Elegant Progress Bar */}
          {uploadProgress && (
            <div className="space-y-4 bg-gradient-to-r from-slate-800/40 via-slate-900/40 to-slate-800/40 p-6 rounded-xl border border-amber-900/20">
              <div className="flex items-center justify-between">
                <span className="text-amber-200 text-sm font-medium">{uploadProgress.message}</span>
                <span className="text-amber-400 font-mono text-sm tabular-nums">{Math.round(getProgressPercentage())}%</span>
              </div>
              <div className="h-3 bg-slate-900/50 rounded-full overflow-hidden ring-1 ring-amber-900/20">
                <div 
                  className="h-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 transition-all duration-500 ease-out relative overflow-hidden"
                  style={{ width: `${getProgressPercentage()}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                </div>
              </div>
              <div className="flex items-center gap-6 text-xs">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${uploadProgress.stage === 'encoding' && uploadProgress.progress === 100 || uploadProgress.stage === 'firestore' ? 'bg-amber-500' : 'bg-slate-700'} ring-2 ${uploadProgress.stage === 'encoding' && uploadProgress.progress === 100 || uploadProgress.stage === 'firestore' ? 'ring-amber-500/30' : 'ring-slate-700/30'} transition-all duration-300`}></div>
                  <span className="text-slate-400 font-light">Image Processing</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${uploadProgress.stage === 'firestore' && uploadProgress.progress === 100 ? 'bg-amber-500' : 'bg-slate-700'} ring-2 ${uploadProgress.stage === 'firestore' && uploadProgress.progress === 100 ? 'ring-amber-500/30' : 'ring-slate-700/30'} transition-all duration-300`}></div>
                  <span className="text-slate-400 font-light">Database</span>
                </div>
              </div>
            </div>
          )}

          {/* Luxury Submit Button */}
          <div className="pt-2 sm:pt-4">
            <Button 
              type="submit" 
              className="relative w-full h-12 sm:h-14 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-semibold text-base sm:text-lg transition-all duration-300 overflow-hidden group shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40" 
              disabled={loading}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative z-10 flex items-center justify-center">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
                    <span className="hidden sm:inline">Adding to Collection...</span>
                    <span className="sm:hidden">Adding...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                    Add to Menu
                  </>
                )}
              </span>
            </Button>
          </div>

        </form>
      </CardContent>
    </Card>
      </div>
    </div>
  );
}



