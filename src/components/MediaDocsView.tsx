import React, { useState, useRef } from 'react';
import { DocumentItem } from '../types.ts';
import {
  FolderGit2,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  GitCommit,
  ShieldCheck,
  Search,
  Filter,
  Layers,
  ZoomIn,
  AlertCircle,
  FileCode,
  X,
  History,
} from 'lucide-react';

interface MediaDocsViewProps {
  documents: DocumentItem[];
  onUploadDocument: (doc: Partial<DocumentItem>) => void;
}

export const MediaDocsView: React.FC<MediaDocsViewProps> = ({ documents, onUploadDocument }) => {
  const [activeCategory, setActiveCategory] = useState<'drawings' | 'photos' | 'logs'>('drawings');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'review'>('all');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [selectedDocPreview, setSelectedDocPreview] = useState<DocumentItem | null>(null);
  const [diffModalDoc, setDiffModalDoc] = useState<DocumentItem | null>(null);
  const [showApprovalToast, setShowApprovalToast] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSimulateUpload = (filename: string, fileType: 'PDF' | 'DWG' | 'JPG') => {
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return 20;
        if (prev >= 90) {
          clearInterval(interval);
          setTimeout(() => {
            const isDrawing = fileType === 'DWG' || fileType === 'PDF';
            const category = isDrawing ? 'drawings' : 'photos';
            onUploadDocument({
              title: filename,
              filename: filename,
              category: category,
              revision: 'REV-E',
              version: 'v2.1',
              statusBadge: 'Approved for Construction',
              statusType: 'approved',
              fileType: fileType,
              author: 'You (Lead Engineer)',
              diffNotes: {
                additions: 'Auto-detected revision increments from REV-D',
                removals: 'Obsolete beam specifications superseded',
                hash: `#${Math.random().toString(16).substring(2, 9)}`,
              },
            });
            setUploadProgress(null);
            setShowApprovalToast(`Successfully uploaded & versioned ${filename}`);
            setTimeout(() => setShowApprovalToast(null), 3500);
          }, 400);
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const ext = file.name.split('.').pop()?.toUpperCase() || 'PDF';
      handleSimulateUpload(file.name, (ext === 'DWG' ? 'DWG' : ext === 'JPG' || ext === 'PNG' ? 'JPG' : 'PDF') as any);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const ext = file.name.split('.').pop()?.toUpperCase() || 'PDF';
      handleSimulateUpload(file.name, (ext === 'DWG' ? 'DWG' : ext === 'JPG' || ext === 'PNG' ? 'JPG' : 'PDF') as any);
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    if (activeCategory === 'drawings' && doc.category !== 'drawings') return false;
    if (activeCategory === 'photos' && doc.category !== 'photos') return false;
    if (activeCategory === 'logs' && doc.category !== 'logs') return false;

    if (statusFilter === 'approved' && doc.statusType !== 'approved') return false;
    if (statusFilter === 'review' && doc.statusType !== 'review') return false;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        doc.title.toLowerCase().includes(query) ||
        doc.revision.toLowerCase().includes(query) ||
        (doc.diffNotes?.hash.toLowerCase().includes(query) ?? false)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto space-y-4 pb-12">
      {/* Category Tabs */}
      <div className="flex items-center justify-between gap-1 bg-[#eff4ff] p-1 rounded-xl border border-[#d3e4fe]/50">
        <button
          onClick={() => setActiveCategory('drawings')}
          className={`flex-1 py-2 text-center rounded-lg font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
            activeCategory === 'drawings'
              ? 'bg-[#0f2744] text-white shadow-xs'
              : 'text-[#44474d] hover:text-[#0b1c30]'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Drawings & CAD</span>
        </button>
        <button
          onClick={() => setActiveCategory('photos')}
          className={`flex-1 py-2 text-center rounded-lg font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
            activeCategory === 'photos'
              ? 'bg-[#0f2744] text-white shadow-xs'
              : 'text-[#44474d] hover:text-[#0b1c30]'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Site Photos (342)</span>
        </button>
        <button
          onClick={() => setActiveCategory('logs')}
          className={`flex-1 py-2 text-center rounded-lg font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
            activeCategory === 'logs'
              ? 'bg-[#0f2744] text-white shadow-xs'
              : 'text-[#44474d] hover:text-[#0b1c30]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Daily Logs (89)</span>
        </button>
      </div>

      {/* Drag & Drop Ingestion Dropzone */}
      <section
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`bg-white rounded-xl p-6 border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center group ${
          isDragging
            ? 'border-[#216293] bg-[#eff4ff]'
            : 'border-[#c4c6ce] hover:border-[#216293] hover:bg-[#f8f9ff]'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          className="hidden"
          accept=".pdf,.dwg,.dxf,.png,.jpg,.jpeg"
        />
        <div className="w-12 h-12 rounded-full bg-[#eff4ff] text-[#216293] flex items-center justify-center mb-2 group-hover:scale-110 group-hover:bg-[#dce9ff] transition-all shadow-xs">
          <UploadCloud className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-sm text-[#0b1c30]">
          Drop CAD, DWG, PDF or site captures here
        </h3>
        <p className="text-xs text-[#44474d] mt-1 max-w-sm">
          System automatically increments revision tags{' '}
          <span className="font-mono text-[#216293] font-semibold">(e.g., Rev C → Rev D)</span> and computes SHA-256 integrity hash.
        </p>
        <button
          type="button"
          className="mt-3 px-4 py-1.5 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] rounded-lg font-mono text-xs font-semibold border border-[#d3e4fe] shadow-2xs"
        >
          Browse Local Files
        </button>

        {uploadProgress !== null && (
          <div className="w-full max-w-xs mt-4">
            <div className="flex justify-between font-mono text-[10px] text-[#44474d] mb-1">
              <span>Ingesting asset...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#d3e4fe] overflow-hidden">
              <div
                className="h-full bg-[#216293] transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </section>

      {/* Success Notification Toast */}
      {showApprovalToast && (
        <div className="p-3 bg-[#ecfdf5] border border-[#a7f3d0] rounded-xl text-[#047857] text-xs font-mono flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{showApprovalToast}</span>
          </div>
          <button onClick={() => setShowApprovalToast(null)} className="text-[#047857]/70 hover:text-[#047857]">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Search & Status Filters */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-[#74777e] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sheets, hash, tag (e.g. DWG-402)..."
            className="w-full pl-9 pr-3 py-2 bg-white rounded-lg border border-[#c4c6ce]/60 text-xs text-[#0b1c30] placeholder:text-[#74777e] focus:outline-none focus:border-[#216293]"
          />
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-semibold transition-all ${
              statusFilter === 'all'
                ? 'bg-[#0f2744] text-white'
                : 'bg-white text-[#44474d] border border-[#c4c6ce]/40'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('approved')}
            className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-semibold transition-all ${
              statusFilter === 'approved'
                ? 'bg-[#0f2744] text-white'
                : 'bg-white text-[#44474d] border border-[#c4c6ce]/40'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setStatusFilter('review')}
            className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-semibold transition-all ${
              statusFilter === 'review'
                ? 'bg-[#0f2744] text-white'
                : 'bg-white text-[#44474d] border border-[#c4c6ce]/40'
            }`}
          >
            Under Review
          </button>
        </div>
      </div>

      {/* Version Control Document Cards (Drawings & Logs) */}
      {(activeCategory === 'drawings' || activeCategory === 'logs') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-mono text-[11px] uppercase font-bold text-[#44474d] tracking-wider">
              Revision Vault ({filteredDocuments.length})
            </h3>
            <span className="font-mono text-[11px] text-[#44474d]">Strict Version Lock</span>
          </div>

          {filteredDocuments.map((doc) => (
            <article
              key={doc.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-[#c4c6ce]/30 space-y-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 shadow-2xs ${
                      doc.fileType === 'DWG'
                        ? 'bg-[#e5eeff] text-[#216293]'
                        : doc.fileType === 'PDF'
                        ? 'bg-[#ffdad6] text-[#ba1a1a]'
                        : 'bg-[#ecfdf5] text-[#047857]'
                    }`}
                  >
                    {doc.fileType}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm text-[#0b1c30] truncate">{doc.title}</h4>
                      <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-[#0f2744] text-white font-bold">
                        {doc.revision}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#44474d] mt-0.5">
                      <span>{doc.updatedAt}</span>
                      <span>•</span>
                      <span>By {doc.author}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                    doc.statusType === 'approved'
                      ? 'bg-[#ecfdf5] text-[#047857]'
                      : 'bg-[#fffbeb] text-[#b45309]'
                  }`}
                >
                  {doc.statusBadge}
                </span>
              </div>

              {/* Diff notes & Hash */}
              {doc.diffNotes && (
                <div className="bg-[#eff4ff] p-3 rounded-lg text-xs space-y-1 font-mono">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#216293] flex items-center gap-1">
                      <GitCommit className="w-3.5 h-3.5" />
                      Diff vs Prior Revision:
                    </span>
                    <span className="text-[#74777e]">{doc.diffNotes.hash}</span>
                  </div>
                  <p className="text-[#0b1c30]">{doc.diffNotes.additions}</p>
                  <p className="text-[#44474d] text-[11px]">{doc.diffNotes.removals}</p>
                </div>
              )}

              {/* SLA reminder for Review Pending */}
              {doc.slaRemaining && (
                <div className="p-2 bg-[#ffdad6]/40 border border-[#ffdad6] rounded-lg text-xs flex items-center justify-between font-mono text-[#ba1a1a]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{doc.slaRemaining}</span>
                  </div>
                  <span className="font-bold">Urgent</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1 border-t border-[#eff4ff]">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      alert(`Downloading revision package for ${doc.title}...`);
                    }}
                    className="h-8 px-3 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] rounded-lg font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-[#216293]" />
                    <span>Download (.{doc.fileType.toLowerCase()})</span>
                  </button>
                  {doc.diffNotes && (
                    <button
                      onClick={() => setDiffModalDoc(doc)}
                      className="h-8 px-3 bg-white hover:bg-[#f8f9ff] text-[#44474d] rounded-lg font-mono text-xs font-semibold border border-[#c4c6ce]/40 flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Diff</span>
                    </button>
                  )}
                </div>

                {doc.statusType === 'review' ? (
                  <button
                    onClick={() => {
                      doc.statusType = 'approved';
                      doc.statusBadge = 'Approved for Construction';
                      delete doc.slaRemaining;
                      setShowApprovalToast(`Approved sheet ${doc.title}`);
                      setTimeout(() => setShowApprovalToast(null), 3000);
                    }}
                    className="h-8 px-3 bg-[#047857] hover:bg-[#065f46] text-white rounded-lg font-mono text-xs font-bold transition-colors"
                  >
                    Sign & Approve
                  </button>
                ) : (
                  <span className="font-mono text-[10px] text-[#74777e] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#047857]" />
                    Signed & Sealed
                  </span>
                )}
              </div>
            </article>
          ))}
        </section>
      )}

      {/* Site Inspection Photo Evidence Masonry / Grid */}
      {activeCategory === 'photos' && (
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-mono text-[11px] uppercase font-bold text-[#44474d] tracking-wider">
              Site Photo Evidence (342 Captures)
            </h3>
            <span className="font-mono text-[11px] text-[#216293]">GPS Tagged</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#c4c6ce]/30 group hover:shadow-md transition-all flex flex-col"
              >
                <div
                  onClick={() => setSelectedDocPreview(doc)}
                  className="relative h-44 bg-[#0f2744] overflow-hidden cursor-pointer"
                >
                  <img
                    src={doc.thumbnail}
                    alt={doc.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-[#0f2744]/80 backdrop-blur-md px-2 py-0.5 rounded text-white font-mono text-[10px] font-bold">
                    {doc.sectorTag || 'Active Deck'}
                  </div>
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded text-[#0b1c30] font-mono text-[10px] font-bold">
                    {doc.metricsTag || 'QC PASSED'}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                    <span className="p-2 bg-white/90 rounded-full text-[#0b1c30] shadow-md">
                      <ZoomIn className="w-5 h-5" />
                    </span>
                  </div>
                </div>

                <div className="p-3 flex flex-col justify-between flex-1 space-y-2">
                  <div>
                    <h4 className="font-bold text-xs text-[#0b1c30] truncate">{doc.title}</h4>
                    <div className="flex items-center justify-between text-[11px] text-[#44474d] mt-1 font-mono">
                      <span>Inspector: {doc.inspector || 'M. Chen'}</span>
                      <span>{doc.timestamp || 'Today 09:15'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-[#eff4ff]">
                    <span className="font-mono text-[10px] text-[#047857] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified Geo-location
                    </span>
                    <button
                      onClick={() => alert(`Downloading high-resolution original RAW...`)}
                      className="text-[#216293] hover:underline font-mono text-[11px] font-semibold flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download RAW</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Security & Encryption Compliance Card */}
      <section className="bg-white rounded-xl p-4 shadow-sm border border-[#c4c6ce]/30 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#eff4ff] text-[#216293] flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="min-w-0">
          <h4 className="font-bold text-xs text-[#0b1c30]">Enterprise Document Vault</h4>
          <p className="text-[11px] text-[#44474d] mt-0.5">
            256-Bit TLS End-to-End Encryption • SOC2 Type II Certified • 7 Years Archive Retention Policy Active
          </p>
        </div>
      </section>

      {/* Document Preview Modal */}
      {selectedDocPreview && (
        <div
          onClick={() => setSelectedDocPreview(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full bg-[#0f2744] rounded-xl overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between p-3 border-b border-white/10 text-white font-mono text-xs">
              <span>{selectedDocPreview.title}</span>
              <button onClick={() => setSelectedDocPreview(null)} className="text-white/70 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <img
              src={selectedDocPreview.thumbnail}
              alt=""
              className="w-full h-auto max-h-[70vh] object-contain bg-black"
            />
            <div className="p-3 bg-[#0b1c30] text-white flex items-center justify-between font-mono text-xs">
              <span>
                Revision: {selectedDocPreview.revision} • Author: {selectedDocPreview.author}
              </span>
              <button
                onClick={() => alert('Downloading official stamped version...')}
                className="px-3 py-1 bg-white text-[#0b1c30] rounded font-bold"
              >
                Download Master
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Diff Modal */}
      {diffModalDoc && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl max-w-md w-full p-4 shadow-xl space-y-3 border border-[#c4c6ce]">
            <div className="flex items-center justify-between border-b border-[#eff4ff] pb-2">
              <span className="font-bold text-sm text-[#0b1c30]">
                Revision Comparison: {diffModalDoc.title}
              </span>
              <button onClick={() => setDiffModalDoc(null)} className="text-[#44474d] hover:text-[#0b1c30]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="p-2.5 bg-[#ecfdf5] rounded border border-[#a7f3d0] text-[#047857]">
                <span className="font-bold block">[+] Additions (Current {diffModalDoc.revision}):</span>
                <span>{diffModalDoc.diffNotes?.additions}</span>
              </div>
              <div className="p-2.5 bg-[#ffdad6]/60 rounded border border-[#ffdad6] text-[#ba1a1a]">
                <span className="font-bold block">[-] Superseded / Removed:</span>
                <span>{diffModalDoc.diffNotes?.removals}</span>
              </div>
              <div className="text-[11px] text-[#74777e] pt-1">
                Cryptographic Checksum: {diffModalDoc.diffNotes?.hash}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#eff4ff]">
              <button
                onClick={() => setDiffModalDoc(null)}
                className="px-4 py-1.5 bg-[#0f2744] text-white rounded-lg font-mono text-xs font-semibold"
              >
                Close Diff
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
