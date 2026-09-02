import React, { useState } from 'react';
import { X, Upload, Camera, Plus, Image as ImageIcon, Tag, FileText, CheckCircle2, Trash2, Layers } from 'lucide-react';
import { GalleryItem } from '../../types';
import { compressImageFile } from '../../utils/imageUtils';

interface AddGalleryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPhoto: (item: GalleryItem) => void;
  onAddMultiplePhotos?: (items: GalleryItem[]) => void;
}

interface PendingUploadItem {
  id: string;
  dataUrl: string;
  title: string;
  category: 'clinic' | 'smiles' | 'equipment' | 'sterilization';
  description: string;
}

export const AddGalleryItemModal: React.FC<AddGalleryItemModalProps> = ({
  isOpen,
  onClose,
  onAddPhoto,
  onAddMultiplePhotos,
}) => {
  const [pendingItems, setPendingItems] = useState<PendingUploadItem[]>([]);
  const [defaultCategory, setDefaultCategory] = useState<'clinic' | 'smiles' | 'equipment' | 'sterilization'>('clinic');
  const [errorMsg, setErrorMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const categoryLabels: Record<string, string> = {
    clinic: 'Clinic & Operatory Suites',
    sterilization: 'Sterilization & Safety Room',
    equipment: 'Modern Dental Equipment',
    smiles: 'Smile Transformations & Cases',
  };

  const handleMultipleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setErrorMsg('');
    setIsProcessing(true);

    const fileList: File[] = Array.from(files);

    try {
      const items: PendingUploadItem[] = await Promise.all(
        fileList.map(async (file, index) => {
          const compressedDataUrl = await compressImageFile(file, 1600, 0.85);
          const cleanName = file.name
            .replace(/\.[^/.]+$/, '')
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());

          return {
            id: `pending-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`,
            dataUrl: compressedDataUrl,
            title: cleanName || `Real Clinic Photo ${pendingItems.length + index + 1}`,
            category: defaultCategory,
            description: 'Authentic photograph from Gurukrupa Family Dental Care, Laggere, Bengaluru.',
          };
        })
      );

      setPendingItems((prev) => [...prev, ...items]);
    } catch (err) {
      setErrorMsg('Failed to process one or more images.');
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  const handleUpdateItem = (id: string, updates: Partial<PendingUploadItem>) => {
    setPendingItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleRemovePending = (id: string) => {
    setPendingItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pendingItems.length === 0) {
      setErrorMsg('Please select at least one real clinic photo to add.');
      return;
    }

    const itemsToAdd: GalleryItem[] = pendingItems.map((item, idx) => ({
      id: 'real-photo-' + Date.now() + '-' + idx,
      title: item.title.trim() || 'Gurukrupa Clinic Photo',
      category: item.category,
      categoryLabel: categoryLabels[item.category] || 'Clinic & Operatory',
      image: item.dataUrl,
      description: item.description.trim() || 'Authentic photograph from Gurukrupa Family Dental Care, Laggere, Bengaluru.',
      isUserUploaded: true,
    }));

    if (onAddMultiplePhotos) {
      onAddMultiplePhotos(itemsToAdd);
    } else {
      itemsToAdd.forEach((itm) => onAddPhoto(itm));
    }

    setPendingItems([]);
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#0C1E34] to-slate-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center border border-sky-400/30">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-white">
                Upload Real Clinic Photographs
              </h3>
              <p className="text-xs text-slate-300">
                Add authentic high-resolution photos of Gurukrupa Family Dental Care
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
              {errorMsg}
            </div>
          )}

          {/* Upload Dropzone */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Real Photos (Single or Multiple)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 font-medium">Default Category:</span>
                <select
                  value={defaultCategory}
                  onChange={(e) => setDefaultCategory(e.target.value as any)}
                  className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                >
                  <option value="clinic">Clinic & Operatory</option>
                  <option value="sterilization">Sterilization Room</option>
                  <option value="equipment">Modern Equipment</option>
                  <option value="smiles">Smile Transformations</option>
                </select>
              </div>
            </div>

            <div className="border-2 border-dashed border-sky-300 hover:border-sky-500 rounded-2xl p-6 text-center bg-sky-50/40 transition-colors">
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shadow-sm">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">
                    Click to select real photos or drag & drop
                  </p>
                  <p className="text-xs text-slate-500">
                    Supports JPG, PNG, WebP (You can select multiple photos at once)
                  </p>
                </div>

                <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md transition-all hover:scale-105">
                  <Plus className="w-4 h-4" />
                  <span>Choose Real Photos from Device</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleMultipleFilesChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Selected Photos List */}
          {pendingItems.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-600" />
                  <span>{pendingItems.length} Real Photo{pendingItems.length > 1 ? 's' : ''} Ready to Add</span>
                </span>
                <button
                  type="button"
                  onClick={() => setPendingItems([])}
                  className="text-xs text-red-600 hover:underline font-medium"
                >
                  Clear all
                </button>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {pendingItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3 relative group"
                  >
                    <div className="w-16 h-16 rounded-lg bg-slate-900 overflow-hidden shrink-0 border border-slate-200">
                      <img
                        src={item.dataUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500">Caption / Title</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleUpdateItem(item.id, { title: e.target.value })}
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500">Category</label>
                        <select
                          value={item.category}
                          onChange={(e) => handleUpdateItem(item.id, { category: e.target.value as any })}
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        >
                          <option value="clinic">Clinic & Operatory</option>
                          <option value="sterilization">Sterilization Room</option>
                          <option value="equipment">Modern Equipment</option>
                          <option value="smiles">Smile Transformations</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemovePending(item.id)}
                      className="text-slate-400 hover:text-red-600 p-1 rounded-lg transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <p className="text-[11px] text-slate-500">
              Photos are saved directly to your clinic gallery.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={pendingItems.length === 0 || isProcessing}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all hover:scale-105"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save {pendingItems.length > 0 ? `${pendingItems.length} Photo${pendingItems.length > 1 ? 's' : ''}` : 'Photos'} to Gallery</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
