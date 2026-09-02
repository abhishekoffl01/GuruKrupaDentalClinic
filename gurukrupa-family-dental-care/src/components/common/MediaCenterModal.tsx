import React, { useState } from 'react';
import {
  X,
  Upload,
  Camera,
  Plus,
  CheckCircle2,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  Layers,
  Building2,
  Stethoscope,
  Activity,
  FileCheck,
  RefreshCcw,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useMedia } from '../../context/MediaContext';
import { DENTAL_SERVICES } from '../../data/dentalData';
import { compressImageFile } from '../../utils/imageUtils';

export const MediaCenterModal: React.FC = () => {
  const {
    media,
    isMediaCenterOpen,
    activeMediaCenterTab,
    closeMediaCenter,
    updateMediaSlot,
    updateServiceImage,
    updateCertificateImage,
    addMultipleGalleryPhotos,
    removeGalleryPhoto,
    batchUploadFiles,
    resetAllMedia,
  } = useMedia();

  const [activeTab, setActiveTab] = useState(activeMediaCenterTab || 'batch');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);

  if (!isMediaCenterOpen) return null;

  const handleBatchFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    setStatusMsg(null);

    try {
      const fileList = Array.from(files);
      const { matchedCount, galleryCount } = await batchUploadFiles(fileList);
      setStatusMsg({
        type: 'success',
        text: `Successfully processed ${fileList.length} photo(s)! Assigned ${matchedCount} to clinic sections and ${galleryCount} to your photo gallery.`,
      });
    } catch (err) {
      setStatusMsg({
        type: 'error',
        text: 'Failed to process some images. Please ensure they are valid image files.',
      });
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  const handleSingleSlotUpload = async (
    slotType: 'slot' | 'service' | 'cert',
    key: string,
    file: File
  ) => {
    try {
      const compressed = await compressImageFile(file, 1600, 0.85);
      if (slotType === 'slot') {
        updateMediaSlot(key as any, compressed);
      } else if (slotType === 'service') {
        updateServiceImage(key, compressed);
      } else if (slotType === 'cert') {
        updateCertificateImage(key, compressed);
      }
      setStatusMsg({ type: 'success', text: `Updated image successfully!` });
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Could not upload image.' });
    }
  };

  const tabs = [
    { id: 'batch', label: '⚡ Batch Uploader', icon: Upload },
    { id: 'clinic', label: '🏥 Clinic & Hero', icon: Building2 },
    { id: 'doctor', label: '👨‍⚕️ Doctor Profile', icon: Stethoscope },
    { id: 'services', label: '🦷 Dental Services', icon: Activity },
    { id: 'gallery', label: '🖼️ Gallery Photos', icon: Layers },
    { id: 'certificates', label: '📜 Certificates', icon: FileCheck },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-950 via-[#0B1E34] to-slate-950 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-400/30 shadow-lg">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold font-heading text-white">
                  Clinic Media Center & Photo Manager
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Upload authentic photos for Gurukrupa Family Dental Care — updates automatically everywhere.
              </p>
            </div>
          </div>
          <button
            onClick={closeMediaCenter}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 pt-2 flex items-center gap-1 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'border-sky-600 text-sky-700 bg-white shadow-sm rounded-t-xl'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 rounded-t-lg'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Status Message Notification */}
        {statusMsg && (
          <div
            className={`px-6 py-3 text-xs flex items-center justify-between border-b ${
              statusMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : statusMsg.type === 'error'
                ? 'bg-red-50 text-red-800 border-red-200'
                : 'bg-sky-50 text-sky-800 border-sky-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMsg.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
              {statusMsg.type === 'error' && <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
              <span className="font-medium">{statusMsg.text}</span>
            </div>
            <button
              onClick={() => setStatusMsg(null)}
              className="text-slate-400 hover:text-slate-700 font-bold ml-2"
            >
              ×
            </button>
          </div>
        )}

        {/* Modal Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: BATCH UPLOADER */}
          {activeTab === 'batch' && (
            <div className="space-y-6">
              <div className="border-2 border-dashed border-sky-300 hover:border-sky-500 rounded-3xl p-8 sm:p-10 text-center bg-gradient-to-b from-sky-50/60 to-white transition-all">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mx-auto shadow-sm">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-slate-900 font-heading">
                      Select or Drag All Your Images at Once
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      You can select multiple photos together. Our smart uploader will automatically assign photos named like <em>doctor</em>, <em>clinic</em>, <em>rct</em>, <em>implants</em>, <em>logo</em>, <em>cert</em> to their matching sections and add the rest into your real Clinic Gallery.
                    </p>
                  </div>

                  <label className="inline-flex items-center gap-2 px-6 py-3.5 bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold rounded-2xl cursor-pointer shadow-lg shadow-sky-600/30 transition-all hover:scale-105">
                    <Plus className="w-5 h-5" />
                    <span>Choose Photos from Device</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleBatchFileSelect}
                      disabled={isProcessing}
                      className="hidden"
                    />
                  </label>

                  {isProcessing && (
                    <div className="pt-2 flex items-center justify-center gap-2 text-xs font-semibold text-sky-700">
                      <RefreshCcw className="w-4 h-4 animate-spin" />
                      <span>Optimizing and compressing photos...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Summary of Current Media Assets */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading">
                  Current Media Assets in System
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">Logo & Hero</span>
                    <strong className="text-slate-900">
                      {media.logo?.startsWith('data:') ? 'Custom Logo' : 'Standard Logo'}
                    </strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">Doctor Photo</span>
                    <strong className="text-slate-900">
                      {media.doctorLead?.startsWith('data:') ? 'Custom Photo' : 'Default Profile'}
                    </strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">Services Photos</span>
                    <strong className="text-slate-900">
                      {Object.keys(media.services).length} Treatments Configured
                    </strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">Gallery Photos</span>
                    <strong className="text-slate-900">
                      {media.gallery.length} Active Photos
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CLINIC & HERO SLOTS */}
          {activeTab === 'clinic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Clinic Logo */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 uppercase font-heading">Hospital Logo</h5>
                      <p className="text-[11px] text-slate-500">Appears in header, footer & mobile menu</p>
                    </div>
                    {media.logo?.startsWith('data:') && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Custom Active
                      </span>
                    )}
                  </div>

                  <div className="h-28 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden p-2">
                    {media.logo ? (
                      <img src={media.logo} alt="Logo" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <span className="text-xs text-slate-400">No logo uploaded</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex-1 cursor-pointer py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Upload Logo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleSingleSlotUpload('slot', 'logo', file);
                        }}
                        className="hidden"
                      />
                    </label>
                    {media.logo && (
                      <button
                        onClick={() => updateMediaSlot('logo', null)}
                        className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                        title="Reset to default"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Hero Banner Photo */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 uppercase font-heading">Clinic Entrance / Banner</h5>
                      <p className="text-[11px] text-slate-500">Main hero background on homepage</p>
                    </div>
                    {media.heroBanner?.startsWith('data:') && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Custom Active
                      </span>
                    )}
                  </div>

                  <div className="h-28 rounded-xl bg-slate-900 border border-slate-200 flex items-center justify-center overflow-hidden">
                    {media.heroBanner ? (
                      <img src={media.heroBanner} alt="Hero" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-slate-400">Using default banner</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex-1 cursor-pointer py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Upload Hero Banner</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleSingleSlotUpload('slot', 'heroBanner', file);
                        }}
                        className="hidden"
                      />
                    </label>
                    {media.heroBanner && (
                      <button
                        onClick={() => updateMediaSlot('heroBanner', null)}
                        className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                        title="Reset"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Clinic Operatory 1 */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 uppercase font-heading">Operatory Suite 1</h5>
                      <p className="text-[11px] text-slate-500">Dental chair & operatory room</p>
                    </div>
                  </div>

                  <div className="h-28 rounded-xl bg-slate-900 border border-slate-200 flex items-center justify-center overflow-hidden">
                    {media.clinic1 ? (
                      <img src={media.clinic1} alt="Operatory 1" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-slate-400">Default Operatory</span>
                    )}
                  </div>

                  <label className="w-full cursor-pointer py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Upload Operatory 1</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleSingleSlotUpload('slot', 'clinic1', file);
                      }}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Sterilization Suite */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 uppercase font-heading">Sterilization / Autoclave</h5>
                      <p className="text-[11px] text-slate-500">Hospital Class-B sterilization suite</p>
                    </div>
                  </div>

                  <div className="h-28 rounded-xl bg-slate-900 border border-slate-200 flex items-center justify-center overflow-hidden">
                    {media.clinic3 ? (
                      <img src={media.clinic3} alt="Sterilization" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-slate-400">Default Sterilization</span>
                    )}
                  </div>

                  <label className="w-full cursor-pointer py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Upload Sterilization Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleSingleSlotUpload('slot', 'clinic3', file);
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DOCTOR PROFILE */}
          {activeTab === 'doctor' && (
            <div className="space-y-6">
              <div className="p-6 bg-slate-900 text-white rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-32 h-32 rounded-2xl bg-sky-500/20 border-2 border-sky-400/40 overflow-hidden shrink-0 flex items-center justify-center">
                  {media.doctorLead ? (
                    <img src={media.doctorLead} alt="Dr. Dinesh K" className="w-full h-full object-cover" />
                  ) : (
                    <Stethoscope className="w-12 h-12 text-sky-400" />
                  )}
                </div>

                <div className="space-y-2 text-center sm:text-left flex-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold uppercase tracking-wider border border-sky-400/30">
                    Lead Dental Surgeon
                  </span>
                  <h4 className="text-xl font-bold font-heading text-white">Dr. Dinesh K</h4>
                  <p className="text-xs text-slate-300">
                    BDS, MDS (Conservative Dentistry & Endodontics) | KSDC Reg. 22378 A
                  </p>
                  <p className="text-xs text-slate-400">
                    Upload a high-resolution portrait of Dr. Dinesh K to display across the About page, Home page, and consultations.
                  </p>

                  <div className="pt-2 flex flex-wrap gap-2">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-md transition-all">
                      <Camera className="w-4 h-4" />
                      <span>{media.doctorLead?.startsWith('data:') ? 'Change Doctor Portrait' : 'Upload Doctor Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleSingleSlotUpload('slot', 'doctorLead', file);
                        }}
                        className="hidden"
                      />
                    </label>

                    {media.doctorLead && (
                      <button
                        onClick={() => updateMediaSlot('doctorLead', null)}
                        className="px-3 py-2 text-xs font-semibold text-red-400 hover:text-white hover:bg-red-500/20 rounded-xl transition-colors"
                      >
                        Reset Photo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DENTAL SERVICES */}
          {activeTab === 'services' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Custom photographs for individual dental treatments shown on cards and service detail modals:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {DENTAL_SERVICES.map((srv) => {
                  const hasCustom = !!media.services[srv.id]?.startsWith('data:');
                  return (
                    <div
                      key={srv.id}
                      className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700">
                            {srv.category}
                          </span>
                          {hasCustom && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                              Custom
                            </span>
                          )}
                        </div>
                        <h6 className="text-xs font-bold text-slate-900 leading-snug">{srv.title}</h6>
                      </div>

                      <div className="h-24 rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center border border-slate-200">
                        {media.services[srv.id] ? (
                          <img src={media.services[srv.id]} alt={srv.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[11px] text-slate-400 text-center px-2">Illustration Fallback</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <label className="flex-1 cursor-pointer py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors">
                          <Camera className="w-3 h-3" />
                          <span>Upload Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleSingleSlotUpload('service', srv.id, file);
                            }}
                            className="hidden"
                          />
                        </label>
                        {hasCustom && (
                          <button
                            onClick={() => updateServiceImage(srv.id, null)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                            title="Reset"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: GALLERY PHOTOS */}
          {activeTab === 'gallery' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-slate-900 uppercase font-heading">
                    Authentic Clinic & Smile Gallery ({media.gallery.length} items)
                  </h5>
                  <p className="text-xs text-slate-500">Manage real photos shown on the Clinic Gallery page</p>
                </div>
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-sm transition-all">
                  <Plus className="w-4 h-4" />
                  <span>Add Photos to Gallery</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleBatchFileSelect}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto pr-1">
                {media.gallery.map((item) => (
                  <div
                    key={item.id}
                    className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-square shadow-sm"
                  >
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
                      <button
                        onClick={() => removeGalleryPhoto(item.id)}
                        className="self-end p-1 rounded-md bg-red-600 text-white hover:bg-red-700 shadow-md"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[10px] text-white font-medium line-clamp-1">
                        {item.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: CERTIFICATES */}
          {activeTab === 'certificates' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Official registration documents & dental degree certificates:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'ksdc-reg', title: 'KSDC Dental Council Reg. 22378 A' },
                  { id: 'mds-degree', title: 'MDS Degree Certificate (RGUHS)' },
                  { id: 'bds-degree', title: 'BDS Degree Certificate (RGUHS)' },
                ].map((cert) => (
                  <div key={cert.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <h6 className="text-xs font-bold text-slate-900">{cert.title}</h6>
                    <div className="h-32 rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center border border-slate-200">
                      {media.certificates[cert.id] ? (
                        <img src={media.certificates[cert.id]} alt={cert.title} className="w-full h-full object-contain" />
                      ) : (
                        <FileCheck className="w-8 h-8 text-amber-400" />
                      )}
                    </div>
                    <label className="w-full cursor-pointer py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Upload Certificate</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleSingleSlotUpload('cert', cert.id, file);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 sm:p-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              if (confirm('Reset all custom uploaded media to standard website defaults?')) {
                resetAllMedia();
                setStatusMsg({ type: 'info', text: 'Reset all media to initial defaults.' });
              }
            }}
            className="text-xs text-slate-500 hover:text-red-600 font-semibold"
          >
            Reset All to Defaults
          </button>

          <button
            onClick={closeMediaCenter}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
          >
            Done & Return to Site
          </button>
        </div>
      </div>
    </div>
  );
};
