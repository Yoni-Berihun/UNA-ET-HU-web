'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Navigation from '../components/Navigation';
import { ImageUpload } from '../components/ImageUpload';
import { PdfUpload } from '../components/PdfUpload';
import DeveloperManagement from './components/DeveloperManagement';

interface Post {
  id: string;
  title: string;
  category: string;
  author: string;
  authorId: string;
  date: string | null;
  status: string;
  likes: number;
  comments: number;
  featuredImage?: string | null;
}

interface HeroPost {
  id: string;
  title: string;
  content: string;
  image: string | null;
  isActive: boolean;
  createdAt: string;
}

interface Magazine {
  id: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  embedCode: string;
  publishedAt: string;
}

interface GalleryImage {
  id: string;
  url: string;
  caption: string | null;
  width: number;
  height: number;
  category: string | null;
  eventDate?: string | null;
  createdAt: string;
}

interface AnnualReport {
  id: string;
  title: string;
  description: string | null;
  year: number | null;
  fileUrl: string;
  publishedAt: string;
  createdAt: string;
}

interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string | null;
  image: string | null;
  status: string;
  createdAt: string;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MEMBER' | 'GUEST';
  avatar: string | null;
  createdAt: string;
  _count: {
    blogPosts: number;
  };
}

interface Team {
  id: string;
  name: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  // Safe cast for extended user properties
  const user = session?.user as any;
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [heroPosts, setHeroPosts] = useState<HeroPost[]>([]);
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [reports, setReports] = useState<AnnualReport[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  // Delete Confirmation State
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    type: 'post' | 'hero' | 'magazine' | 'gallery' | 'report' | 'event' | null;
    id: string | null;
  }>({
    isOpen: false,
    type: null,
    id: null,
  });

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showHeroModal, setShowHeroModal] = useState(false);
  const [showMagazineModal, setShowMagazineModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editingHeroPost, setEditingHeroPost] = useState<HeroPost | null>(null);
  const [editingMagazine, setEditingMagazine] = useState<Magazine | null>(null);
  const [editingGalleryImage, setEditingGalleryImage] = useState<GalleryImage | null>(null);
  const [editingReport, setEditingReport] = useState<AnnualReport | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'blog' | 'users' | 'hero' | 'magazines' | 'gallery' | 'reports' | 'events' | 'developers'>('blog');

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    status: 'DRAFT',
    featuredImage: '',
    orientation: 'LANDSCAPE',
    teamId: '',
  });

  const [heroFormData, setHeroFormData] = useState({
    title: '',
    content: '',
    image: '',
    isActive: true,
    orientation: 'LANDSCAPE',
  });

  const [magazineFormData, setMagazineFormData] = useState({
    title: '',
    description: '',
    coverImage: '',
    embedCode: '',
    pdfUrl: '',
  });

  const [galleryFormData, setGalleryFormData] = useState({
    url: '',
    caption: '',
    category: '',
    width: 800,
    height: 600,
    eventDate: '',
  });

  const [reportFormData, setReportFormData] = useState({
    title: '',
    description: '',
    year: '',
    fileUrl: '',
    publishedAt: '',
  });

  const [eventFormData, setEventFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    image: '',
    status: 'UPCOMING',
    applyLink: '',
  });

  const [createUserFormData, setCreateUserFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'MEMBER' as User['role'],
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      if (activeTab === 'blog') {
        fetchPosts();
        fetchTeams();
      } else if (activeTab === 'users' && (session.user as any).role === 'SUPER_ADMIN') {
        fetchUsers();
      } else if (activeTab === 'hero') {
        fetchHeroPosts();
      } else if (activeTab === 'magazines') {
        fetchMagazines();
      } else if (activeTab === 'gallery') {
        fetchGalleryImages();
      } else if (activeTab === 'reports') {
        fetchReports();
      } else if (activeTab === 'events') {
        fetchEvents();
      } else if (activeTab === 'developers') {
        setLoading(false);
      }
    }
  }, [session, search, categoryFilter, statusFilter, activeTab]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (categoryFilter) params.append('category', categoryFilter);
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`/api/posts?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data.items);
      } else {
        toast.error('Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Error loading posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);

      const response = await fetch(`/api/users?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        toast.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error loading users');
    } finally {
      setLoading(false);
    }
  };

  const fetchHeroPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/hero-posts');
      if (response.ok) {
        const data = await response.json();
        setHeroPosts(data);
      } else {
        toast.error('Failed to fetch announcements');
      }
    } catch (error) {
      console.error('Error fetching hero posts:', error);
      toast.error('Error loading announcements');
    } finally {
      setLoading(false);
    }
  };

  const fetchMagazines = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/magazines');
      if (response.ok) {
        const data = await response.json();
        setMagazines(data);
      } else {
        toast.error('Failed to fetch magazines');
      }
    } catch (error) {
      console.error('Error fetching magazines:', error);
      toast.error('Error loading magazines');
    } finally {
      setLoading(false);
    }
  };

  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/gallery');
      if (response.ok) {
        const data = await response.json();
        setGalleryImages(data);
      } else {
        toast.error('Failed to fetch gallery images');
      }
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      toast.error('Error loading gallery');
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reports');
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      } else {
        toast.error('Failed to fetch reports');
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Error loading reports');
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        toast.error('Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Error loading events');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams');
      if (!response.ok) return;
      const data = await response.json();
      setTeams(Array.isArray(data) ? data : data.items ?? []);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const handleCreate = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: '',
      status: 'DRAFT',
      featuredImage: '',
      orientation: 'LANDSCAPE',
      teamId: '',
    });
    setShowModal(true);
  };

  const handleCreateHero = () => {
    setEditingHeroPost(null);
    setHeroFormData({
      title: '',
      content: '',
      image: '',
      isActive: true,
      orientation: 'LANDSCAPE',
    });
    setShowHeroModal(true);
  };

  const handleEdit = (post: Post) => {
    fetch(`/api/posts/${post.id}`)
      .then((res) => res.json())
      .then((data) => {
        setEditingPost(post);
        setFormData({
          title: data.title,
          excerpt: data.excerpt || '',
          content: data.content,
          category: data.category,
          status: data.status,
          featuredImage: data.featuredImage || '',
          orientation: data.orientation || 'LANDSCAPE',
          teamId: data.teamId || '',
        });
        setShowModal(true);
      })
      .catch((err) => {
        console.error('Error fetching post:', err);
        toast.error('Failed to load post');
      });
  };

  const handleEditHero = (post: HeroPost) => {
    setEditingHeroPost(post);
    setHeroFormData({
      title: post.title,
      content: post.content || '',
      image: post.image || '',
      isActive: post.isActive,
      orientation: (post as any).orientation || 'LANDSCAPE', // Type cast if interface not updated yet
    });
    setShowHeroModal(true);
  };

  const handleCreateMagazine = () => {
    setEditingMagazine(null);
    setMagazineFormData({
      title: '',
      description: '',
      coverImage: '',
      embedCode: '',
      pdfUrl: '',
    });
    setShowMagazineModal(true);
  };

  const handleEditMagazine = (magazine: Magazine) => {
    setEditingMagazine(magazine);
    setMagazineFormData({
      title: magazine.title,
      description: magazine.description || '',
      coverImage: magazine.coverImage || '',
      embedCode: magazine.embedCode,
      pdfUrl: (magazine as any).pdfUrl || '', // Type cast if interface not updated yet
    });
    setShowMagazineModal(true);
  };

  const handleCreateGalleryImage = () => {
    setEditingGalleryImage(null);
    setGalleryFormData({
      url: '',
      caption: '',
      category: '',
      width: 800,
      height: 600,
      eventDate: '',
    });
    setShowGalleryModal(true);
  };

  const handleEditGalleryImage = (image: GalleryImage) => {
    setEditingGalleryImage(image);
    setGalleryFormData({
      url: image.url,
      caption: image.caption || '',
      category: image.category || '',
      width: image.width || 800,
      height: image.height || 600,
      eventDate: image.eventDate ? image.eventDate.slice(0, 10) : '',
    });
    setShowGalleryModal(true);
  };

  const handleCreateReport = () => {
    setEditingReport(null);
    setReportFormData({
      title: '',
      description: '',
      year: '',
      fileUrl: '',
      publishedAt: '',
    });
    setShowReportModal(true);
  };

  const handleEditReport = (report: AnnualReport) => {
    setEditingReport(report);
    setReportFormData({
      title: report.title,
      description: report.description || '',
      year: report.year ? String(report.year) : '',
      fileUrl: report.fileUrl,
      publishedAt: report.publishedAt ? report.publishedAt.slice(0, 10) : '',
    });
    setShowReportModal(true);
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setEventFormData({
      title: '',
      description: '',
      date: '',
      location: '',
      image: '',
      status: 'UPCOMING',
      applyLink: '',
    });
    setShowEventModal(true);
  };

  const handleEditEvent = (event: EventItem) => {
    setEditingEvent(event);
    setEventFormData({
      title: event.title,
      description: event.description || '',
      date: event.date ? event.date.slice(0, 16) : '',
      location: event.location || '',
      image: event.image || '',
      status: event.status || 'UPCOMING',
      applyLink: (event as any).applyLink || '',
    });
    setShowEventModal(true);
  };

  const handleDelete = async (id: string) => {
    setDeleteConfirmation({ isOpen: true, type: 'post', id });
  };

  const confirmDeletePost = async () => {
    const id = deleteConfirmation.id;
    if (!id) return;

    const loadingToast = toast.loading('Deleting post...');

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Post deleted successfully', { id: loadingToast });
        fetchPosts();
      } else {
        toast.error('Failed to delete post', { id: loadingToast });
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Error deleting post', { id: loadingToast });
    } finally {
      setDeleteConfirmation({ isOpen: false, type: null, id: null });
    }
  };

  const handleDeleteHero = async (id: string) => {
    setDeleteConfirmation({ isOpen: true, type: 'hero', id });
  };

  const confirmDeleteHero = async () => {
    const id = deleteConfirmation.id;
    if (!id) return;

    const loadingToast = toast.loading('Deleting announcement...');

    try {
      const response = await fetch(`/api/hero-posts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Announcement deleted', { id: loadingToast });
        fetchHeroPosts();
      } else {
        toast.error('Failed to delete', { id: loadingToast });
      }
    } catch (error) {
      console.error('Error deleting hero post:', error);
      toast.error('Error deleting announcement', { id: loadingToast });
    } finally {
      setDeleteConfirmation({ isOpen: false, type: null, id: null });
    }
  };

  const handleDeleteMagazine = async (id: string) => {
    setDeleteConfirmation({ isOpen: true, type: 'magazine', id });
  };

  const handleDeleteGalleryImage = async (id: string) => {
    setDeleteConfirmation({ isOpen: true, type: 'gallery', id });
  };

  const handleDeleteReport = async (id: string) => {
    setDeleteConfirmation({ isOpen: true, type: 'report', id });
  };

  const handleDeleteEvent = async (id: string) => {
    setDeleteConfirmation({ isOpen: true, type: 'event', id });
  };

  const confirmDeleteMagazine = async () => {
    const id = deleteConfirmation.id;
    if (!id) return;

    const loadingToast = toast.loading('Deleting magazine...');

    try {
      const response = await fetch(`/api/magazines/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Magazine deleted successfully', { id: loadingToast });
        fetchMagazines();
      } else {
        toast.error('Failed to delete magazine', { id: loadingToast });
      }
    } catch (error) {
      console.error('Error deleting magazine:', error);
      toast.error('Error deleting magazine', { id: loadingToast });
    } finally {
      setDeleteConfirmation({ isOpen: false, type: null, id: null });
    }
  };

  const confirmDeleteGalleryImage = async () => {
    const id = deleteConfirmation.id;
    if (!id) return;

    const loadingToast = toast.loading('Deleting image...');

    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Image deleted successfully', { id: loadingToast });
        fetchGalleryImages();
      } else {
        toast.error('Failed to delete image', { id: loadingToast });
      }
    } catch (error) {
      console.error('Error deleting gallery image:', error);
      toast.error('Error deleting image', { id: loadingToast });
    } finally {
      setDeleteConfirmation({ isOpen: false, type: null, id: null });
    }
  };

  const confirmDeleteReport = async () => {
    const id = deleteConfirmation.id;
    if (!id) return;

    const loadingToast = toast.loading('Deleting report...');
    try {
      const response = await fetch(`/api/reports/${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Report deleted', { id: loadingToast });
        fetchReports();
      } else {
        toast.error('Failed to delete report', { id: loadingToast });
      }
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error('Error deleting report', { id: loadingToast });
    } finally {
      setDeleteConfirmation({ isOpen: false, type: null, id: null });
    }
  };

  const confirmDeleteEvent = async () => {
    const id = deleteConfirmation.id;
    if (!id) return;

    const loadingToast = toast.loading('Deleting event...');
    try {
      const response = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Event deleted', { id: loadingToast });
        fetchEvents();
      } else {
        toast.error('Failed to delete event', { id: loadingToast });
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Error deleting event', { id: loadingToast });
    } finally {
      setDeleteConfirmation({ isOpen: false, type: null, id: null });
    }
  };

  const handleToggleStatus = async (post: Post) => {
    const newStatus = post.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    const loadingToast = toast.loading(`Changing status to ${newStatus.toLowerCase()}...`);

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success(`Post ${newStatus.toLowerCase()} successfully`, { id: loadingToast });
        fetchPosts();
      } else {
        toast.error('Failed to update status', { id: loadingToast });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error updating status', { id: loadingToast });
    }
  };

  const handleToggleHeroStatus = async (post: HeroPost) => {
    const newStatus = !post.isActive;
    const loadingToast = toast.loading('Updating status...');

    try {
      const response = await fetch(`/api/hero-posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newStatus }),
      });

      if (response.ok) {
        toast.success('Status updated', { id: loadingToast });
        fetchHeroPosts();
      } else {
        toast.error('Failed to update status', { id: loadingToast });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error updating', { id: loadingToast });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Team is optional ("General" post). Backend also accepts missing teamId.

    const loadingToast = toast.loading(editingPost ? 'Updating post...' : 'Creating post...');

    try {
      const url = editingPost ? `/api/posts/${editingPost.id}` : '/api/posts';
      const method = editingPost ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          teamId: formData.teamId || undefined,
        }),
      });

      if (response.ok) {
        toast.success(editingPost ? 'Post updated successfully!' : 'Post created successfully!', { id: loadingToast });
        setShowModal(false);
        fetchPosts();
        setFormData({
          title: '',
          excerpt: '',
          content: '',
          category: '',
          status: 'DRAFT',
          featuredImage: '',
          orientation: 'LANDSCAPE',
          teamId: '',
        });
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save post', { id: loadingToast });
      }
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Error saving post', { id: loadingToast });
    }
  };

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading(editingHeroPost ? 'Updating...' : 'Creating...');

    try {
      const url = editingHeroPost ? `/api/hero-posts/${editingHeroPost.id}` : '/api/hero-posts';
      const method = editingHeroPost ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heroFormData),
      });

      if (response.ok) {
        toast.success('Saved successfully!', { id: loadingToast });
        setShowHeroModal(false);
        fetchHeroPosts();
      } else {
        toast.error('Failed to save', { id: loadingToast });
      }
    } catch (error) {
      console.error('Error saving hero post:', error);
      toast.error('Error saving', { id: loadingToast });
    }
  };

  const handleMagazineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading(editingMagazine ? 'Updating magazine...' : 'Creating magazine...');

    try {
      const url = editingMagazine ? `/api/magazines/${editingMagazine.id}` : '/api/magazines';
      const method = editingMagazine ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(magazineFormData),
      });

      if (response.ok) {
        toast.success(editingMagazine ? 'Magazine updated!' : 'Magazine created!', { id: loadingToast });
        setShowMagazineModal(false);
        fetchMagazines();
      } else {
        toast.error('Failed to save magazine', { id: loadingToast });
      }
    } catch (error) {
      console.error('Error saving magazine:', error);
      toast.error('Error saving magazine', { id: loadingToast });
    }
  };

  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading(editingGalleryImage ? 'Updating image...' : 'Adding image...');

    try {
      const url = editingGalleryImage ? `/api/gallery/${editingGalleryImage.id}` : '/api/gallery';
      const method = editingGalleryImage ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: galleryFormData.url,
          caption: galleryFormData.caption,
          category: galleryFormData.category,
          width: Number(galleryFormData.width),
          height: Number(galleryFormData.height),
          eventDate: galleryFormData.eventDate || null,
        }),
      });

      if (response.ok) {
        toast.success(editingGalleryImage ? 'Image updated!' : 'Image added!', { id: loadingToast });
        setShowGalleryModal(false);
        fetchGalleryImages();
      } else {
        const error = await response.json().catch(() => ({}));
        toast.error(error.error || 'Failed to save image', { id: loadingToast });
      }
    } catch (error) {
      console.error('Error saving gallery image:', error);
      toast.error('Error saving image', { id: loadingToast });
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading(editingReport ? 'Updating report...' : 'Creating report...');

    try {
      const url = editingReport ? `/api/reports/${editingReport.id}` : '/api/reports';
      const method = editingReport ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: reportFormData.title,
          description: reportFormData.description,
          year: reportFormData.year ? Number(reportFormData.year) : null,
          fileUrl: reportFormData.fileUrl,
          publishedAt: reportFormData.publishedAt || null,
        }),
      });

      if (response.ok) {
        toast.success(editingReport ? 'Report updated!' : 'Report created!', { id: loadingToast });
        setShowReportModal(false);
        fetchReports();
      } else {
        const error = await response.json().catch(() => ({}));
        toast.error(error.error || 'Failed to save report', { id: loadingToast });
      }
    } catch (error) {
      console.error('Error saving report:', error);
      toast.error('Error saving report', { id: loadingToast });
    }
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading(editingEvent ? 'Updating event...' : 'Creating event...');

    try {
      const url = editingEvent ? `/api/events/${editingEvent.id}` : '/api/events';
      const method = editingEvent ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: eventFormData.title,
          description: eventFormData.description,
          date: eventFormData.date,
          location: eventFormData.location || null,
          image: eventFormData.image || null,
          status: eventFormData.status,
          applyLink: eventFormData.applyLink || null,
        }),
      });

      if (response.ok) {
        toast.success(editingEvent ? 'Event updated!' : 'Event created!', { id: loadingToast });
        setShowEventModal(false);
        fetchEvents();
      } else {
        const error = await response.json().catch(() => ({}));
        toast.error(error.error || 'Failed to save event', { id: loadingToast });
      }
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Error saving event', { id: loadingToast });
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    const loadingToast = toast.loading('Deleting user...');
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('User deleted successfully', { id: loadingToast });
        fetchUsers();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete user', { id: loadingToast });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user', { id: loadingToast });
    }
  };

  const handleUpdateUserRole = async (id: string, newRole: string) => {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    const loadingToast = toast.loading('Updating user role...');
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        toast.success('User role updated successfully', { id: loadingToast });
        fetchUsers();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update user role', { id: loadingToast });
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Error updating user role', { id: loadingToast });
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const loadingToast = toast.loading('Creating user...');
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createUserFormData),
      });

      if (response.ok) {
        toast.success('User created successfully', { id: loadingToast });
        setShowCreateUserModal(false);
        setCreateUserFormData({
          fullName: '',
          email: '',
          password: '',
          role: 'MEMBER',
        });
        fetchUsers();
      } else {
        const error = await response.json().catch(() => ({}));
        toast.error(error.error || 'Failed to create user', { id: loadingToast });
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Error creating user', { id: loadingToast });
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f8] dark:bg-[#0f0f23] text-[#101018] dark:text-white transition-colors duration-200">
      <Navigation />

      <div className="bg-white dark:bg-[#1a1a2e] border-b border-[#dadae7] dark:border-gray-800 shadow-sm sticky top-16 z-30">
        <div className="mx-auto max-w-[1200px] px-4 md:px-8">
          <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar" aria-label="Dashboard Navigation">
            <button
              onClick={() => setActiveTab('blog')}
              className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'blog'
                ? 'border-primary text-primary dark:text-blue-400'
                : 'border-transparent text-[#5e5f8d] dark:text-gray-400 hover:text-[#101018] dark:hover:text-white hover:border-gray-300'
                }`}
            >
              <span className="material-symbols-outlined text-[20px]">article</span>
              Blog Posts
            </button>
            <button
              onClick={() => setActiveTab('hero')}
              className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'hero'
                ? 'border-primary text-primary dark:text-blue-400'
                : 'border-transparent text-[#5e5f8d] dark:text-gray-400 hover:text-[#101018] dark:hover:text-white hover:border-gray-300'
                }`}
            >
              <span className="material-symbols-outlined text-[20px]">campaign</span>
              Announcements
            </button>
            <button
              onClick={() => setActiveTab('magazines')}
              className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'magazines'
                ? 'border-primary text-primary dark:text-blue-400'
                : 'border-transparent text-[#5e5f8d] dark:text-gray-400 hover:text-[#101018] dark:hover:text-white hover:border-gray-300'
                }`}
            >
              <span className="material-symbols-outlined text-[20px]">menu_book</span>
              Magazines
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'gallery'
                ? 'border-primary text-primary dark:text-blue-400'
                : 'border-transparent text-[#5e5f8d] dark:text-gray-400 hover:text-[#101018] dark:hover:text-white hover:border-gray-300'
                }`}
            >
              <span className="material-symbols-outlined text-[20px]">photo_library</span>
              Gallery
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'reports'
                ? 'border-primary text-primary dark:text-blue-400'
                : 'border-transparent text-[#5e5f8d] dark:text-gray-400 hover:text-[#101018] dark:hover:text-white hover:border-gray-300'
                }`}
            >
              <span className="material-symbols-outlined text-[20px]">description</span>
              Annual Reports
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'events'
                ? 'border-primary text-primary dark:text-blue-400'
                : 'border-transparent text-[#5e5f8d] dark:text-gray-400 hover:text-[#101018] dark:hover:text-white hover:border-gray-300'
                }`}
            >
              <span className="material-symbols-outlined text-[20px]">event</span>
              Upcoming Events
            </button>
            {(session.user as any).role === 'SUPER_ADMIN' && (
              <button
                onClick={() => setActiveTab('users')}
                className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'users'
                  ? 'border-primary text-primary dark:text-blue-400'
                  : 'border-transparent text-[#5e5f8d] dark:text-gray-400 hover:text-[#101018] dark:hover:text-white hover:border-gray-300'
                  }`}
              >
                <span className="material-symbols-outlined text-[20px]">group</span>
                Manage Users
              </button>
            )}
            <button
              onClick={() => setActiveTab('developers')}
              className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'developers'
                ? 'border-primary text-primary dark:text-blue-400'
                : 'border-transparent text-[#5e5f8d] dark:text-gray-400 hover:text-[#101018] dark:hover:text-white hover:border-gray-300'
                }`}
            >
              <span className="material-symbols-outlined text-[20px]">code</span>
              Developers
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f5f5f8] dark:bg-[#0f0f23]">
        <div className="mx-auto max-w-[1200px] flex flex-col gap-6">
          {activeTab === 'blog' && (
            <>
              <header className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-[#101018] dark:text-white text-3xl font-bold tracking-tight">
                    Blog Management
                  </h2>
                  <p className="text-[#5e5f8d] dark:text-gray-400 mt-1 text-sm">
                    Create, edit, and manage your organization&apos;s blog posts.
                  </p>
                </div>
                <button
                  onClick={handleCreate}
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                  <span className="material-symbols-outlined mr-2 text-[20px]">add</span>
                  Add New Post
                </button>
              </header>

              <div className="flex flex-wrap items-center gap-4 rounded-xl border border-[#dadae7] dark:border-gray-700 bg-white dark:bg-[#1a1a2e] p-4 shadow-sm">
                <div className="relative flex-1 min-w-[240px]">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5e5f8d] dark:text-gray-400">
                    <span className="material-symbols-outlined text-[20px]">search</span>
                  </span>
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-10 rounded-lg border border-[#dadae7] dark:border-gray-700 bg-[#f5f5f8] dark:bg-black/20 py-2 pl-10 pr-4 text-sm text-[#101018] dark:text-white placeholder:text-[#5e5f8d] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="relative min-w-[180px]">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="h-10 w-full appearance-none rounded-lg border border-[#dadae7] dark:border-gray-700 bg-[#f5f5f8] dark:bg-black/20 px-4 py-2 pr-10 text-sm text-[#101018] dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    <option value="">All Categories</option>
                    <option value="Diplomacy">Diplomacy</option>
                    <option value="SDG">SDG Goals</option>
                    <option value="Youth & Education">Youth & Education</option>
                    <option value="Climate Action">Climate Action</option>
                  </select>
                </div>
                <div className="relative min-w-[140px]">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-10 w-full appearance-none rounded-lg border border-[#dadae7] dark:border-gray-700 bg-[#f5f5f8] dark:bg-black/20 px-4 py-2 pr-10 text-sm text-[#101018] dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    <option value="">Status: All</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>

              <div className="rounded-xl border border-[#dadae7] dark:border-gray-700 bg-white dark:bg-[#1a1a2e] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#f5f5f8] dark:bg-white/5 text-[#5e5f8d] dark:text-gray-400 border-b border-[#dadae7] dark:border-gray-700">
                      <tr>
                        <th className="whitespace-nowrap px-6 py-4 font-semibold w-[40%]">Post Info</th>
                        <th className="whitespace-nowrap px-6 py-4 font-semibold w-[15%]">Author</th>
                        <th className="whitespace-nowrap px-6 py-4 font-semibold w-[15%]">Date Published</th>
                        <th className="whitespace-nowrap px-6 py-4 font-semibold w-[10%]">Status</th>
                        <th className="whitespace-nowrap px-6 py-4 font-semibold w-[10%]">Engagement</th>
                        <th className="whitespace-nowrap px-6 py-4 font-semibold w-[10%] text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#dadae7] dark:divide-gray-700">
                      {posts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-[#5e5f8d] dark:text-gray-400">
                            No posts found
                          </td>
                        </tr>
                      ) : (
                        posts.map((post) => (
                          <tr
                            key={post.id}
                            className="group hover:bg-[#f8f9fa] dark:hover:bg-white/5 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex gap-4 items-center">
                                {post.featuredImage && (
                                  <div className="h-12 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
                                    <img
                                      src={post.featuredImage}
                                      alt={post.title}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                )}
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-semibold text-[#101018] dark:text-white line-clamp-1">
                                    {post.title}
                                  </span>
                                  <span className="text-xs text-[#5e5f8d] dark:text-gray-400">
                                    Category: {post.category}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-[#5e5f8d] dark:text-gray-300">{post.author}</td>
                            <td className="px-6 py-4 text-[#5e5f8d] dark:text-gray-300">
                              {post.date || 'Not published'}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${post.status === 'PUBLISHED'
                                  ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                                  : post.status === 'DRAFT'
                                    ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
                                    : 'bg-gray-50 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800'
                                  }`}
                              >
                                {post.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4 text-[#5e5f8d] dark:text-gray-400 text-xs font-medium">
                                <div className="flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[16px]">favorite</span>
                                  <span>{post.likes}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[16px]">chat_bubble</span>
                                  <span>{post.comments}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              {((session.user as any).role === 'SUPER_ADMIN' || (session.user as any).id === post.authorId) && (
                                <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => handleEdit(post)}
                                    className="h-8 w-8 inline-flex items-center justify-center rounded hover:bg-[#f5f5f8] dark:hover:bg-white/10 text-[#5e5f8d] dark:text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-colors"
                                    title="Edit"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                  </button>
                                  <button
                                    onClick={() => handleToggleStatus(post)}
                                    className="h-8 w-8 inline-flex items-center justify-center rounded hover:bg-[#f5f5f8] dark:hover:bg-white/10 text-[#5e5f8d] dark:text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-colors"
                                    title="Toggle Status"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">
                                      {post.status === 'PUBLISHED' ? 'visibility' : 'visibility_off'}
                                    </span>
                                  </button>
                                  <button
                                    onClick={() => handleDelete(post.id)}
                                    className="h-8 w-8 inline-flex items-center justify-center rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-[#5e5f8d] dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                    title="Delete"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'hero' && (
            <>
              <header className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-[#101018] dark:text-white text-3xl font-bold tracking-tight">
                    Announcements
                  </h2>
                  <p className="text-[#5e5f8d] dark:text-gray-400 mt-1 text-sm">
                    Manage hero section announcements and news.
                  </p>
                </div>
                <button
                  onClick={handleCreateHero}
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors"
                >
                  <span className="material-symbols-outlined mr-2 text-[20px]">add</span>
                  New Announcement
                </button>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {heroPosts.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-[#5e5f8d] dark:text-gray-400 bg-white dark:bg-[#1a1a2e] rounded-xl border border-[#dadae7] dark:border-gray-700">
                    No announcements found. Create one to get started.
                  </div>
                ) : (
                  heroPosts.map((post) => (
                    <div
                      key={post.id}
                      className="group relative bg-white dark:bg-[#1a1a2e] rounded-xl border border-[#dadae7] dark:border-gray-700 shadow-sm hover:shadow-md transition-all overflow-hidden"
                    >
                      <div className="p-5 flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                          <div className={`w-3 h-3 rounded-full mt-1.5 ${post.isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`} />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditHero(post)}
                              className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                            >
                              <span className="material-symbols-outlined text-[20px]">edit</span>
                            </button>
                            <button
                              onClick={() => handleToggleHeroStatus(post)}
                              className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                              title={post.isActive ? "Deactivate" : "Activate"}
                            >
                              <span className="material-symbols-outlined text-[20px]">{post.isActive ? 'visibility' : 'visibility_off'}</span>
                            </button>
                            <button
                              onClick={() => handleDeleteHero(post.id)}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                            >
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          </div>
                        </div>

                        {post.image && (
                          <div className="w-full h-32 rounded-lg bg-slate-100 dark:bg-black/20 overflow-hidden mb-2">
                            <img src={post.image} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}

                        <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                          {post.title}
                        </h3>
                        {post.content && (
                          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                            {post.content}
                          </p>
                        )}
                        <div className="mt-2 text-xs text-slate-400">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}



          {activeTab === 'magazines' && (
            <>
              <header className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-[#101018] dark:text-white text-3xl font-bold tracking-tight">
                    Magazine Management
                  </h2>
                  <p className="text-[#5e5f8d] dark:text-gray-400 mt-1 text-sm">
                    Manage digital magazine issues and flipbooks.
                  </p>
                </div>
                <button
                  onClick={handleCreateMagazine}
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors"
                >
                  <span className="material-symbols-outlined mr-2 text-[20px]">add</span>
                  Add New Magazine
                </button>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {magazines.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-[#5e5f8d] dark:text-gray-400 bg-white dark:bg-[#1a1a2e] rounded-xl border border-[#dadae7] dark:border-gray-700">
                    No magazines found. Create one to get started.
                  </div>
                ) : (
                  magazines.map((magazine) => (
                    <div
                      key={magazine.id}
                      className="group relative bg-white dark:bg-[#1a1a2e] rounded-xl border border-[#dadae7] dark:border-gray-700 shadow-sm hover:shadow-md transition-all overflow-hidden"
                    >
                      {magazine.coverImage ? (
                        <div className="w-full h-48 bg-slate-100 dark:bg-black/20 overflow-hidden relative">
                          <img src={magazine.coverImage} alt={magazine.title} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-full h-48 bg-slate-100 dark:bg-[#252538] flex items-center justify-center text-slate-400">
                          <span className="material-symbols-outlined text-[48px]">menu_book</span>
                        </div>
                      )}

                      <div className="p-5 flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight line-clamp-1">
                            {magazine.title}
                          </h3>
                        </div>

                        {magazine.description && (
                          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                            {magazine.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          <div className="text-xs text-slate-400">
                            {new Date(magazine.publishedAt).toLocaleDateString()}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditMagazine(magazine)}
                              className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <span className="material-symbols-outlined text-[20px]">edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteMagazine(magazine.id)}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {activeTab === 'gallery' && (
            <>
              <header className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-[#101018] dark:text-white text-3xl font-bold tracking-tight">
                    Gallery Management
                  </h2>
                  <p className="text-[#5e5f8d] dark:text-gray-400 mt-1 text-sm">
                    Add and manage gallery images.
                  </p>
                </div>
                <button
                  onClick={handleCreateGalleryImage}
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                  <span className="material-symbols-outlined mr-2 text-[20px]">add_photo_alternate</span>
                  Add Image
                </button>
              </header>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryImages.length === 0 ? (
                  <div className="col-span-full rounded-xl border border-[#dadae7] dark:border-gray-700 bg-white dark:bg-[#1a1a2e] p-8 text-center text-[#5e5f8d] dark:text-gray-400">
                    No gallery images found
                  </div>
                ) : (
                  galleryImages.map((img) => (
                    <div
                      key={img.id}
                      className="rounded-xl border border-[#dadae7] dark:border-gray-700 bg-white dark:bg-[#1a1a2e] shadow-sm overflow-hidden"
                    >
                      <div className="w-full h-48 bg-slate-100 dark:bg-black/20 overflow-hidden relative">
                        <img src={img.url} alt={img.caption || 'Gallery image'} className="w-full h-full object-cover" />
                      </div>

                      <div className="p-5 flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex flex-col gap-0.5">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight line-clamp-1">
                              {img.caption || 'Untitled'}
                            </h3>
                            <p className="text-xs text-slate-400">
                              {img.category ? `Category: ${img.category}` : 'Category: —'}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditGalleryImage(img)}
                              className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <span className="material-symbols-outlined text-[20px]">edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteGalleryImage(img.id)}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          </div>
                        </div>
                        <div className="text-xs text-slate-400">
                          Date: {new Date(img.eventDate || img.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {activeTab === 'reports' && (
            <>
              <header className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-[#101018] dark:text-white text-3xl font-bold tracking-tight">
                    Annual Reports
                  </h2>
                  <p className="text-[#5e5f8d] dark:text-gray-400 mt-1 text-sm">
                    Upload and manage PDF annual reports.
                  </p>
                </div>
                <button
                  onClick={handleCreateReport}
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                  <span className="material-symbols-outlined mr-2 text-[20px]">note_add</span>
                  Add Report
                </button>
              </header>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.length === 0 ? (
                  <div className="col-span-full rounded-xl border border-[#dadae7] dark:border-gray-700 bg-white dark:bg-[#1a1a2e] p-8 text-center text-[#5e5f8d] dark:text-gray-400">
                    No reports found
                  </div>
                ) : (
                  reports.map((report) => (
                    <div
                      key={report.id}
                      className="rounded-xl border border-[#dadae7] dark:border-gray-700 bg-white dark:bg-[#1a1a2e] shadow-sm overflow-hidden"
                    >
                      <div className="p-5 flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight line-clamp-1">
                              {report.title}
                            </h3>
                            <p className="text-xs text-slate-400">
                              {report.year ? `Year: ${report.year}` : 'Year: —'}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditReport(report)}
                              className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <span className="material-symbols-outlined text-[20px]">edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteReport(report.id)}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          </div>
                        </div>

                        {report.description && (
                          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3">
                            {report.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          <div className="text-xs text-slate-400">
                            Published: {new Date(report.publishedAt).toLocaleDateString()}
                          </div>
                          <a
                            href={report.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-primary hover:underline"
                          >
                            View PDF
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {activeTab === 'events' && (
            <>
              <header className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-[#101018] dark:text-white text-3xl font-bold tracking-tight">
                    Upcoming Events
                  </h2>
                  <p className="text-[#5e5f8d] dark:text-gray-400 mt-1 text-sm">
                    Add and manage public events.
                  </p>
                </div>
                <button
                  onClick={handleCreateEvent}
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                  <span className="material-symbols-outlined mr-2 text-[20px]">add</span>
                  Add Event
                </button>
              </header>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.length === 0 ? (
                  <div className="col-span-full rounded-xl border border-[#dadae7] dark:border-gray-700 bg-white dark:bg-[#1a1a2e] p-8 text-center text-[#5e5f8d] dark:text-gray-400">
                    No events found
                  </div>
                ) : (
                  events.map((event) => (
                    <div
                      key={event.id}
                      className="rounded-xl border border-[#dadae7] dark:border-gray-700 bg-white dark:bg-[#1a1a2e] shadow-sm overflow-hidden"
                    >
                      {event.image ? (
                        <div className="w-full h-40 bg-slate-100 dark:bg-black/20 overflow-hidden relative">
                          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-full h-40 bg-slate-100 dark:bg-black/20 flex items-center justify-center text-slate-300">
                          <span className="material-symbols-outlined text-[48px]">event</span>
                        </div>
                      )}

                      <div className="p-5 flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight line-clamp-1">
                              {event.title}
                            </h3>
                            <p className="text-xs text-slate-400">
                              {new Date(event.date).toLocaleString()}
                              {event.location ? ` • ${event.location}` : ''}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditEvent(event)}
                              className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <span className="material-symbols-outlined text-[20px]">edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(event.id)}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          </div>
                        </div>

                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3">
                          {event.description}
                        </p>

                        <div className="mt-2">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${event.status === 'UPCOMING'
                            ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                            : 'bg-gray-50 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800'
                            }`}>
                            {event.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {activeTab === 'users' && (
            <>
              <header className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-[#101018] dark:text-white text-3xl font-bold tracking-tight">
                    User Management
                  </h2>
                  <p className="text-[#5e5f8d] dark:text-gray-400 mt-1 text-sm">
                    Manage users, admins, and their roles.
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateUserModal(true)}
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                  <span className="material-symbols-outlined mr-2 text-[20px]">person_add</span>
                  Create User
                </button>
              </header>

              <div className="flex flex-wrap items-center gap-4 rounded-xl border border-[#dadae7] dark:border-gray-700 bg-white dark:bg-[#1a1a2e] p-4 shadow-sm">
                <div className="relative flex-1 min-w-[240px]">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5e5f8d] dark:text-gray-400">
                    <span className="material-symbols-outlined text-[20px]">search</span>
                  </span>
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-10 rounded-lg border border-[#dadae7] dark:border-gray-700 bg-[#f5f5f8] dark:bg-black/20 py-2 pl-10 pr-4 text-sm text-[#101018] dark:text-white placeholder:text-[#5e5f8d] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-[#dadae7] dark:border-gray-700 bg-white dark:bg-[#1a1a2e] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#f5f5f8] dark:bg-white/5 text-[#5e5f8d] dark:text-gray-400 border-b border-[#dadae7] dark:border-gray-700">
                      <tr>
                        <th className="whitespace-nowrap px-6 py-4 font-semibold w-[40%]">User</th>
                        <th className="whitespace-nowrap px-6 py-4 font-semibold w-[20%]">Email</th>
                        <th className="whitespace-nowrap px-6 py-4 font-semibold w-[15%]">Role</th>
                        <th className="whitespace-nowrap px-6 py-4 font-semibold w-[10%]">Posts</th>
                        <th className="whitespace-nowrap px-6 py-4 font-semibold w-[15%] text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#dadae7] dark:divide-gray-700">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-[#5e5f8d] dark:text-gray-400">
                            No users found
                          </td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <tr
                            key={user.id}
                            className="group hover:bg-[#f8f9fa] dark:hover:bg-white/5 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex gap-4 items-center">
                                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                                  {user.avatar ? (
                                    <img src={user.avatar} alt={user.fullName} className="h-full w-full object-cover" />
                                  ) : (
                                    <div className="h-full w-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                                      {user.fullName[0].toUpperCase()}
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-semibold text-[#101018] dark:text-white line-clamp-1">
                                    {user.fullName}
                                  </span>
                                  <span className="text-xs text-[#5e5f8d] dark:text-gray-400">
                                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-[#5e5f8d] dark:text-gray-300">{user.email}</td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${user.role === 'SUPER_ADMIN'
                                  ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800'
                                  : user.role === 'ADMIN'
                                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                                    : 'bg-gray-50 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800'
                                  }`}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-[#5e5f8d] dark:text-gray-300">
                              {user._count.blogPosts}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                <select
                                  value={user.role}
                                  onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                                  disabled={user.role === 'SUPER_ADMIN' || user.id === (session.user as any).id}
                                  className="h-8 rounded-md border border-[#dadae7] dark:border-gray-700 bg-[#f5f5f8] dark:bg-black/20 px-2 text-xs text-[#101018] dark:text-white disabled:opacity-50"
                                  title={user.id === (session.user as any).id ? 'Cannot change your own role' : user.role === 'SUPER_ADMIN' ? 'Cannot change a Super Admin role' : 'Change role'}
                                >
                                  <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                                  <option value="ADMIN">ADMIN</option>
                                  <option value="MEMBER">MEMBER</option>
                                  <option value="GUEST">GUEST</option>
                                </select>
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  disabled={user.role === 'SUPER_ADMIN' || user.id === (session.user as any).id}
                                  className="h-8 w-8 inline-flex items-center justify-center rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-[#5e5f8d] dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[#5e5f8d]"
                                  title={user.id === (session.user as any).id ? 'Cannot delete your own account' : user.role === 'SUPER_ADMIN' ? 'Cannot delete a Super Admin account' : 'Delete User'}
                                >
                                  <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'developers' && <DeveloperManagement />}

        </div>
      </main>

      {/* Post Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-2 sm:p-4">
          <div className="w-full max-w-3xl max-h-[90vh] rounded-2xl bg-white dark:bg-[#0f0f23] shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 p-4 sm:p-5">
              <h3 className="text-lg font-bold text-[#101018] dark:text-white">
                {editingPost ? 'Edit Post' : 'Add New Post'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-[#5e5f8d] hover:bg-black/5 dark:text-gray-300 dark:hover:bg-white/10"
                aria-label="Close"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#101018] dark:text-white mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full h-10 rounded-lg border border-[#dadae7] dark:border-gray-700 bg-[#f5f5f8] dark:bg-black/20 px-4 py-2 text-sm text-[#101018] dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#101018] dark:text-white mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-10 rounded-lg border border-[#dadae7] dark:border-gray-700 bg-[#f5f5f8] dark:bg-black/20 px-4 py-2 text-sm text-[#101018] dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g., Technology, Health"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#101018] dark:text-white mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="h-10 w-full rounded-lg border border-[#dadae7] dark:border-gray-700 bg-[#f5f5f8] dark:bg-black/20 px-4 py-2 pr-10 text-sm text-[#101018] dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#101018] dark:text-white mb-1">
                  Excerpt
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full rounded-lg border border-[#dadae7] dark:border-gray-700 bg-[#f5f5f8] dark:bg-black/20 p-2 text-sm text-[#101018] dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  rows={2}
                  placeholder="Short description for the post"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#101018] dark:text-white mb-1">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full rounded-lg border border-[#dadae7] dark:border-gray-700 bg-[#f5f5f8] dark:bg-black/20 p-2 text-sm text-[#101018] dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  rows={6}
                  placeholder="Main content of the post"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#101018] dark:text-white mb-1">
                    Featured Image
                  </label>
                  <ImageUpload
                    value={formData.featuredImage}
                    onChange={(url) => setFormData({ ...formData, featuredImage: url })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#101018] dark:text-white mb-1">
                    Team
                  </label>
                  <select
                    value={formData.teamId}
                    onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
                    className="h-10 w-full rounded-lg border border-[#dadae7] dark:border-gray-700 bg-[#f5f5f8] dark:bg-black/20 px-4 py-2 pr-10 text-sm text-[#101018] dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">General (All Teams)</option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-[#5e5f8d] dark:text-gray-400">
                    Leave as General to publish under all teams.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-black/10 dark:border-white/10 px-5 text-sm font-semibold text-[#101018] dark:text-white hover:bg-black/5 dark:hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
                >
                  {editingPost ? 'Save Changes' : 'Create Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showGalleryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white dark:bg-[#1a1a2e] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#101018] dark:text-white">
                {editingGalleryImage ? 'Edit Image' : 'Add Image'}
              </h3>
              <button
                onClick={() => setShowGalleryModal(false)}
                className="text-[#5e5f8d] dark:text-gray-400 hover:text-[#101018] dark:hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleGallerySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#101018] dark:text-white">
                  Image *
                </label>
                <ImageUpload
                  value={galleryFormData.url}
                  onChange={(url) => setGalleryFormData({ ...galleryFormData, url })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-[#101018] dark:text-white">
                  Caption
                </label>
                <input
                  type="text"
                  value={galleryFormData.caption}
                  onChange={(e) => setGalleryFormData({ ...galleryFormData, caption: e.target.value })}
                  className="w-full rounded-lg border border-[#dadae7] dark:border-gray-700 bg-[#f5f5f8] dark:bg-black/20 px-4 py-2 text-sm text-[#101018] dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-[#101018] dark:text-white">
                  Category
                </label>
                <select
                  value={galleryFormData.category}
                  onChange={(e) => setGalleryFormData({ ...galleryFormData, category: e.target.value })}
                  className="w-full rounded-lg border border-[#dadae7] dark:border-gray-700 bg-[#f5f5f8] dark:bg-black/20 px-4 py-2 text-sm text-[#101018] dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Select category…</option>
                  <option value="Event">Event</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Conference">Conference</option>
                  <option value="MUN">MUN</option>
                  <option value="SDG">SDG</option>
                  <option value="Outreach">Outreach</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-[#101018] dark:text-white">
                  Event / Posted Date
                </label>
                <input
                  type="date"
                  value={galleryFormData.eventDate}
                  onChange={(e) => setGalleryFormData({ ...galleryFormData, eventDate: e.target.value })}
                  className="w-full rounded-lg border border-[#dadae7] dark:border-gray-700 bg-[#f5f5f8] dark:bg-black/20 px-4 py-2 text-sm text-[#101018] dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <p className="text-xs text-[#5e5f8d] dark:text-gray-400 mt-1">
                  Optional. If empty, the system uses the upload date.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#101018] dark:text-white">
                    Width
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={galleryFormData.width}
                    onChange={(e) => setGalleryFormData({ ...galleryFormData, width: Number(e.target.value) })}
                    className="w-full rounded-lg border border-[#dadae7] dark:border-gray-700 bg-[#f5f5f8] dark:bg-black/20 px-4 py-2 text-sm text-[#101018] dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#101018] dark:text-white">
                    Height
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={galleryFormData.height}
                    onChange={(e) => setGalleryFormData({ ...galleryFormData, height: Number(e.target.value) })}
                    className="w-full rounded-lg border border-[#dadae7] dark:border-gray-700 bg-[#f5f5f8] dark:bg-black/20 px-4 py-2 text-sm text-[#101018] dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowGalleryModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-[#5e5f8d] dark:text-gray-400 hover:bg-[#f0f0f5] dark:hover:bg-white/5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!galleryFormData.url}
                  className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50"
                >
                  {editingGalleryImage ? 'Update Image' : 'Add Image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white dark:bg-[#1a1a2e] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#101018] dark:text-white">
                {editingReport ? 'Edit Report' : 'Add Report'}
              </h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-[#5e5f8d] dark:text-gray-400 hover:text-[#101018] dark:hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#101018] dark:text-white">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={reportFormData.title}
                  onChange={(e) => setReportFormData({ ...reportFormData, title: e.target.value })}
                  className="w-full rounded-lg border border-[#dadae7] dark:border-gray-700 bg-[#f5f5f8] dark:bg-black/20 px-4 py-2 text-sm text-[#101018] dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#101018] dark:text-white">
                    Year
                  </label>
                  <input
                    type="number"
                    min={1900}
                    max={3000}
                    value={reportFormData.year}
                    onChange={(e) => setReportFormData({ ...reportFormData, year: e.target.value })}
                    className="w-full rounded-lg border border-[#dadae7] dark:border-gray-700 bg-[#f5f5f8] dark:bg-black/20 px-4 py-2 text-sm text-[#101018] dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#101018] dark:text-white">
                    Published Date
                  </label>
                  <input
                    type="date"
                    value={reportFormData.publishedAt}
                    onChange={(e) => setReportFormData({ ...reportFormData, publishedAt: e.target.value })}
                    className="w-full rounded-lg border border-[#dadae7] dark:border-gray-700 bg-[#f5f5f8] dark:bg-black/20 px-4 py-2 text-sm text-[#101018] dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-[#101018] dark:text-white">
                  PDF *
                </label>
                <PdfUpload
                  value={reportFormData.fileUrl}
                  onChange={(url) => setReportFormData({ ...reportFormData, fileUrl: url })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-[#101018] dark:text-white">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={reportFormData.description}
                  onChange={(e) => setReportFormData({ ...reportFormData, description: e.target.value })}
                  className="w-full rounded-lg border border-[#dadae7] dark:border-gray-700 bg-[#f5f5f8] dark:bg-black/20 px-4 py-2 text-sm text-[#101018] dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-[#5e5f8d] dark:text-gray-400 hover:bg-[#f0f0f5] dark:hover:bg-white/5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!reportFormData.title || !reportFormData.fileUrl}
                  className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50"
                >
                  {editingReport ? 'Update Report' : 'Add Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white dark:bg-[#1a1a2e] rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#101018] dark:text-white">
                {editingEvent ? 'Edit Event' : 'Add Event'}
              </h3>
              <button
                onClick={() => setShowEventModal(false)}
                className="text-[#5e5f8d] dark:text-gray-400 hover:text-[#101018] dark:hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleEventSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#101018] dark:text-white">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={eventFormData.title}
                  onChange={(e) => setEventFormData({ ...eventFormData, title: e.target.value })}
                  className="w-full rounded-lg border border-[#dadae7] dark:border-gray-700 bg-[#f5f5f8] dark:bg-black/20 px-4 py-2 text-sm text-[#101018] dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#101018] dark:text-white">
                    Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={eventFormData.date}
                    onChange={(e) => setEventFormData({ ...eventFormData, date: e.target.value })}
                    className="w-full rounded-lg border border-[#dadae7] dark:border-gray-700 bg-[#f5f5f8] dark:bg-black/20 px-4 py-2 text-sm text-[#101018] dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#101018] dark:text-white">
                    Location
                  </label>
                  <input
                    type="text"
                    value={eventFormData.location}
                    onChange={(e) => setEventFormData({ ...eventFormData, location: e.target.value })}
                    className="w-full rounded-lg border border-[#dadae7] dark:border-gray-700 bg-[#f5f5f8] dark:bg-black/20 px-4 py-2 text-sm text-[#101018] dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#101018] dark:text-white">
                    Status
                  </label>
                  <select
                    value={eventFormData.status}
                    onChange={(e) => setEventFormData({ ...eventFormData, status: e.target.value })}
                    className="w-full rounded-lg border border-[#dadae7] dark:border-gray-700 bg-[#f5f5f8] dark:bg-black/20 px-4 py-2 text-sm text-[#101018] dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="UPCOMING">UPCOMING</option>
                    <option value="ONGOING">ONGOING</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#101018] dark:text-white">
                    Image
                  </label>
                  <ImageUpload
                    value={eventFormData.image}
                    onChange={(url) => setEventFormData({ ...eventFormData, image: url })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-[#101018] dark:text-white">
                  Application form link (Google Form)
                </label>
                <input
                  type="url"
                  value={eventFormData.applyLink}
                  onChange={(e) => setEventFormData({ ...eventFormData, applyLink: e.target.value })}
                  placeholder="https://forms.gle/..."
                  className="w-full rounded-lg border border-[#dadae7] dark:border-gray-700 bg-[#f5f5f8] dark:bg-black/20 px-4 py-2 text-sm text-[#101018] dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <p className="mt-2 text-xs text-[#5e5f8d] dark:text-gray-400">
                  This link will be used by the public “Apply now” button on the Upcoming Events page.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-[#5e5f8d] dark:text-gray-400 hover:bg-[#f0f0f5] dark:hover:bg-white/5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!eventFormData.title || !eventFormData.date || !eventFormData.description}
                  className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50"
                >
                  {editingEvent ? 'Update Event' : 'Add Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Hero Announcements */}
      {
        showHeroModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white dark:bg-[#1a1a2e] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#101018] dark:text-white">
                  {editingHeroPost ? 'Edit Announcement' : 'Create Announcement'}
                </h3>
                <button
                  onClick={() => setShowHeroModal(false)}
                  className="text-[#5e5f8d] dark:text-gray-400 hover:text-[#101018] dark:hover:text-white"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleHeroSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#101018] dark:text-white">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={heroFormData.title}
                    onChange={(e) => setHeroFormData({ ...heroFormData, title: e.target.value })}
                    className="w-full rounded-lg border border-[#dadae7] dark:border-gray-700 bg-[#f5f5f8] dark:bg-black/20 px-4 py-2 text-sm text-[#101018] dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#101018] dark:text-white">
                    Content
                  </label>
                  <textarea
                    value={heroFormData.content}
                    onChange={(e) => setHeroFormData({ ...heroFormData, content: e.target.value })}
                    rows={4}
                    className="w-full rounded-lg border border-[#dadae7] dark:border-gray-700 bg-[#f5f5f8] dark:bg-black/20 px-4 py-2 text-sm text-[#101018] dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#101018] dark:text-white">
                    Orientation
                  </label>
                  <select
                    value={(heroFormData as any).orientation}
                    onChange={(e) => setHeroFormData({ ...heroFormData, orientation: e.target.value } as any)}
                    className="w-full rounded-lg border border-[#dadae7] dark:border-gray-700 bg-[#f5f5f8] dark:bg-black/20 px-4 py-2 text-sm text-[#101018] dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="LANDSCAPE">Landscape (Standard)</option>
                    <option value="PORTRAIT">Portrait (Tall)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#101018] dark:text-white">
                    Announcement Image
                  </label>
                  <ImageUpload
                    value={heroFormData.image}
                    onChange={(url) => setHeroFormData({ ...heroFormData, image: url })}
                    orientation={(heroFormData as any).orientation || 'LANDSCAPE'}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={heroFormData.isActive}
                      onChange={(e) => setHeroFormData({ ...heroFormData, isActive: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-[#101018] dark:text-white">
                      Active (Visible on homepage)
                    </span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowHeroModal(false)}
                    className="px-4 py-2 text-sm font-semibold text-[#5e5f8d] dark:text-gray-400 hover:bg-[#f0f0f5] dark:hover:bg-white/5 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
                  >
                    {editingHeroPost ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }
      {/* Modal for Magazine */}
      {
        showMagazineModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white dark:bg-[#1a1a2e] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#101018] dark:text-white">
                  {editingMagazine ? 'Edit Magazine' : 'Add New Magazine'}
                </h3>
                <button
                  onClick={() => setShowMagazineModal(false)}
                  className="text-[#5e5f8d] dark:text-gray-400 hover:text-[#101018] dark:hover:text-white"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleMagazineSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#101018] dark:text-white">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={magazineFormData.title}
                    onChange={(e) => setMagazineFormData({ ...magazineFormData, title: e.target.value })}
                    className="w-full rounded-lg border border-[#dadae7] dark:border-gray-700 bg-[#f5f5f8] dark:bg-black/20 px-4 py-2 text-sm text-[#101018] dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#101018] dark:text-white">
                    Description
                  </label>
                  <textarea
                    value={magazineFormData.description}
                    onChange={(e) => setMagazineFormData({ ...magazineFormData, description: e.target.value })}
                    rows={3}
                    className="w-full rounded-lg border border-[#dadae7] dark:border-gray-700 bg-[#f5f5f8] dark:bg-black/20 px-4 py-2 text-sm text-[#101018] dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#101018] dark:text-white">
                    Embed Code *
                  </label>
                  <div className="mb-2 text-xs text-[#5e5f8d] dark:text-gray-400">
                    Paste the full iframe embed code provided by the flipbook service.
                  </div>
                  <textarea
                    required
                    value={magazineFormData.embedCode}
                    onChange={(e) => setMagazineFormData({ ...magazineFormData, embedCode: e.target.value })}
                    rows={5}
                    placeholder='<iframe ... ></iframe>'
                    className="w-full rounded-lg border border-[#dadae7] dark:border-gray-700 bg-[#f5f5f8] dark:bg-black/20 px-4 py-2 text-sm font-mono text-[#101018] dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#101018] dark:text-white">
                    PDF Document (Optional)
                  </label>
                  <PdfUpload
                    value={magazineFormData.pdfUrl}
                    onChange={(url) => setMagazineFormData({ ...magazineFormData, pdfUrl: url })}
                  />
                  <p className="text-xs text-[#5e5f8d] dark:text-gray-400 mt-1">
                    Upload a PDF version of the magazine for users to download or view directly.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#101018] dark:text-white">
                    Cover Image
                  </label>
                  <ImageUpload
                    value={magazineFormData.coverImage}
                    onChange={(url) => setMagazineFormData({ ...magazineFormData, coverImage: url })}
                    orientation="PORTRAIT"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowMagazineModal(false)}
                    className="px-4 py-2 text-sm font-semibold text-[#5e5f8d] dark:text-gray-400 hover:bg-[#f0f0f5] dark:hover:bg-white/5 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
                  >
                    {editingMagazine ? 'Update Magazine' : 'Create Magazine'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }

      {/* Delete Confirmation Modal */}
      {
        deleteConfirmation.isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
            <div className="bg-white dark:bg-[#1a1a2e] rounded-xl max-w-sm w-full p-6 shadow-xl border border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-[#101018] dark:text-white mb-2">
                Confirm Delete
              </h3>
              <p className="text-[#5e5f8d] dark:text-gray-400 text-sm mb-6">
                Are you sure you want to delete this {deleteConfirmation.type}? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirmation({ isOpen: false, type: null, id: null })}
                  className="px-4 py-2 text-sm font-semibold text-[#5e5f8d] dark:text-gray-400 hover:bg-[#f0f0f5] dark:hover:bg-white/5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (deleteConfirmation.type === 'post') confirmDeletePost();
                    else if (deleteConfirmation.type === 'hero') confirmDeleteHero();
                    else if (deleteConfirmation.type === 'magazine') confirmDeleteMagazine();
                    else if (deleteConfirmation.type === 'gallery') confirmDeleteGalleryImage();
                    else if (deleteConfirmation.type === 'report') confirmDeleteReport();
                    else if (deleteConfirmation.type === 'event') confirmDeleteEvent();
                  }}
                  className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )
      }

    </div >
  );
}
