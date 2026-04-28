'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ImageUpload } from '../../components/ImageUpload';

interface Developer {
  id: string;
  fullName: string;
  title: string;
  mobile: string;
  email: string;
  image: string | null;
  linkedinUsername: string | null;
  instagramUsername: string | null;
  telegramUsername: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface DeveloperFormData {
  fullName: string;
  title: string;
  mobile: string;
  email: string;
  image: string;
  linkedinUsername: string;
  instagramUsername: string;
  telegramUsername: string;
  order: number;
}

const emptyForm: DeveloperFormData = {
  fullName: '',
  title: '',
  mobile: '',
  email: '',
  image: '',
  linkedinUsername: '',
  instagramUsername: '',
  telegramUsername: '',
  order: 0,
};

export default function DeveloperManagement() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDeveloper, setEditingDeveloper] = useState<Developer | null>(null);
  const [formData, setFormData] = useState<DeveloperFormData>(emptyForm);

  const fetchDevelopers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/developers');

      if (!response.ok) {
        throw new Error('Failed to fetch developers');
      }

      const data = await response.json();
      setDevelopers(data);
    } catch (error) {
      console.error('Error loading developers:', error);
      toast.error('Error loading developers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const handleCreate = () => {
    setEditingDeveloper(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const handleEdit = (developer: Developer) => {
    setEditingDeveloper(developer);
    setFormData({
      fullName: developer.fullName,
      title: developer.title,
      mobile: developer.mobile,
      email: developer.email,
      image: developer.image || '',
      linkedinUsername: developer.linkedinUsername || '',
      instagramUsername: developer.instagramUsername || '',
      telegramUsername: developer.telegramUsername || '',
      order: developer.order || 0,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this developer? This cannot be undone.')) return;

    const loadingToast = toast.loading('Deleting developer...');
    try {
      const response = await fetch(`/api/developers/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to delete developer');
      }

      toast.success('Developer deleted successfully', { id: loadingToast });
      fetchDevelopers();
    } catch (error: any) {
      console.error('Error deleting developer:', error);
      toast.error(error?.message || 'Error deleting developer', { id: loadingToast });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const loadingToast = toast.loading(editingDeveloper ? 'Updating developer...' : 'Creating developer...');

    try {
      const url = editingDeveloper ? `/api/developers/${editingDeveloper.id}` : '/api/developers';
      const method = editingDeveloper ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save developer');
      }

      toast.success(editingDeveloper ? 'Developer updated successfully' : 'Developer created successfully', { id: loadingToast });
      setShowModal(false);
      setFormData(emptyForm);
      fetchDevelopers();
    } catch (error: any) {
      console.error('Error saving developer:', error);
      toast.error(error?.message || 'Error saving developer', { id: loadingToast });
    }
  };

  const buildSocialUrl = (platform: 'linkedin' | 'instagram' | 'telegram', handle: string | null) => {
    if (!handle) return null;

    const normalized = handle.replace(/^@+/, '').trim();
    if (!normalized) return null;

    if (platform === 'linkedin') return `https://www.linkedin.com/in/${normalized}`;
    if (platform === 'instagram') return `https://www.instagram.com/${normalized}`;
    return `https://t.me/${normalized}`;
  };

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-[#101018] dark:text-white text-3xl font-bold tracking-tight">
            Developers
          </h2>
          <p className="text-[#5e5f8d] dark:text-gray-400 mt-1 text-sm">
            Manage the developer showcase card section.
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors"
        >
          <span className="material-symbols-outlined mr-2 text-[20px]">add</span>
          Add Developer
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full rounded-xl border border-[#dadae7] dark:border-gray-700 bg-white dark:bg-[#1a1a2e] p-8 text-center text-[#5e5f8d] dark:text-gray-400">
            Loading developers...
          </div>
        ) : developers.length === 0 ? (
          <div className="col-span-full rounded-xl border border-[#dadae7] dark:border-gray-700 bg-white dark:bg-[#1a1a2e] p-8 text-center text-[#5e5f8d] dark:text-gray-400">
            No developers found. Create one to get started.
          </div>
        ) : (
          developers.map((developer) => (
            <div key={developer.id} className="rounded-2xl border border-[#dadae7] dark:border-gray-700 bg-white dark:bg-[#1a1a2e] shadow-sm overflow-hidden">
              <div className="h-1 bg-primary" />
              <div className="p-6 flex flex-col items-center text-center gap-4">
                <div className="w-24 h-24 rounded-full border-4 border-slate-100 dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-900 shadow-sm -mt-10">
                  {developer.image ? (
                    <img src={developer.image} alt={developer.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary text-white text-2xl font-bold">
                      {developer.fullName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-[#101018] dark:text-white leading-tight">
                    {developer.fullName}
                  </h3>
                  <p className="mt-2 text-sm text-[#5e5f8d] dark:text-gray-400">
                    {developer.title}
                  </p>
                </div>

                <div className="w-full pt-2 border-t border-[#dadae7] dark:border-gray-800 space-y-3 text-left">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold text-[#101018] dark:text-white">Mobile:</span>
                    <a href={`tel:${developer.mobile}`} className="text-primary hover:underline text-right break-all">
                      {developer.mobile}
                    </a>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold text-[#101018] dark:text-white">Email:</span>
                    <a href={`mailto:${developer.email}`} className="text-primary hover:underline text-right break-all">
                      {developer.email}
                    </a>
                  </div>
                </div>

                <div className="w-full pt-2 border-t border-[#dadae7] dark:border-gray-800 flex items-center justify-end gap-2">
                  <a
                    href={buildSocialUrl('linkedin', developer.linkedinUsername) || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center rounded-full px-3 py-2 text-xs font-semibold transition-colors ${developer.linkedinUsername ? 'bg-[#0a66c2] text-white hover:bg-[#084d92]' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 pointer-events-none'}`}
                  >
                    LinkedIn
                  </a>
                  <a
                    href={buildSocialUrl('instagram', developer.instagramUsername) || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center rounded-full px-3 py-2 text-xs font-semibold transition-colors ${developer.instagramUsername ? 'bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white hover:opacity-90' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 pointer-events-none'}`}
                  >
                    Instagram
                  </a>
                  <a
                    href={buildSocialUrl('telegram', developer.telegramUsername) || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center rounded-full px-3 py-2 text-xs font-semibold transition-colors ${developer.telegramUsername ? 'bg-[#229ED9] text-white hover:bg-[#1b85ba]' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 pointer-events-none'}`}
                  >
                    Telegram
                  </a>
                </div>

                <div className="w-full flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => handleEdit(developer)}
                    className="inline-flex h-9 items-center justify-center rounded-lg border border-[#dadae7] dark:border-gray-700 bg-white dark:bg-transparent px-4 text-sm font-semibold text-[#101018] dark:text-white hover:bg-[#f5f5f8] dark:hover:bg-white/5 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(developer.id)}
                    className="inline-flex h-9 items-center justify-center rounded-lg border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20 px-4 text-sm font-semibold text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
          <div className="bg-white dark:bg-[#1a1a2e] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#101018] dark:text-white">
                {editingDeveloper ? 'Edit Developer' : 'Add Developer'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#5e5f8d] dark:text-gray-400 hover:text-[#101018] dark:hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#101018] dark:text-white">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full rounded-lg border border-[#dadae7] dark:border-gray-700 bg-[#f5f5f8] dark:bg-black/20 px-4 py-2 text-sm text-[#101018] dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#101018] dark:text-white">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-lg border border-[#dadae7] dark:border-gray-700 bg-[#f5f5f8] dark:bg-black/20 px-4 py-2 text-sm text-[#101018] dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#101018] dark:text-white">
                    Mobile *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full rounded-lg border border-[#dadae7] dark:border-gray-700 bg-[#f5f5f8] dark:bg-black/20 px-4 py-2 text-sm text-[#101018] dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#101018] dark:text-white">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-[#dadae7] dark:border-gray-700 bg-[#f5f5f8] dark:bg-black/20 px-4 py-2 text-sm text-[#101018] dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-[#101018] dark:text-white">
                  Profile Image
                </label>
                <ImageUpload
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  orientation="PORTRAIT"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#101018] dark:text-white">
                    LinkedIn Username
                  </label>
                  <input
                    type="text"
                    placeholder="username"
                    value={formData.linkedinUsername}
                    onChange={(e) => setFormData({ ...formData, linkedinUsername: e.target.value })}
                    className="w-full rounded-lg border border-[#dadae7] dark:border-gray-700 bg-[#f5f5f8] dark:bg-black/20 px-4 py-2 text-sm text-[#101018] dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#101018] dark:text-white">
                    Instagram Username
                  </label>
                  <input
                    type="text"
                    placeholder="username"
                    value={formData.instagramUsername}
                    onChange={(e) => setFormData({ ...formData, instagramUsername: e.target.value })}
                    className="w-full rounded-lg border border-[#dadae7] dark:border-gray-700 bg-[#f5f5f8] dark:bg-black/20 px-4 py-2 text-sm text-[#101018] dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#101018] dark:text-white">
                    Telegram Username
                  </label>
                  <input
                    type="text"
                    placeholder="username"
                    value={formData.telegramUsername}
                    onChange={(e) => setFormData({ ...formData, telegramUsername: e.target.value })}
                    className="w-full rounded-lg border border-[#dadae7] dark:border-gray-700 bg-[#f5f5f8] dark:bg-black/20 px-4 py-2 text-sm text-[#101018] dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-[#101018] dark:text-white">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                  className="w-full rounded-lg border border-[#dadae7] dark:border-gray-700 bg-[#f5f5f8] dark:bg-black/20 px-4 py-2 text-sm text-[#101018] dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-[#5e5f8d] dark:text-gray-400 hover:bg-[#f0f0f5] dark:hover:bg-white/5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
                >
                  {editingDeveloper ? 'Update Developer' : 'Create Developer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}