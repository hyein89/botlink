"use client";
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { appConfig } from '../../config.js'; 

export default function ListPage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [notif, setNotif] = useState(null);
  
  const limit = 10; 

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const fetchLinks = useCallback(async (currentPage) => {
    setLoading(true);
    const offset = (currentPage - 1) * limit;

    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/links?select=*&order=created_at.desc&limit=${limit + 1}&offset=${offset}`, {
        headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.length > limit) {
          setHasMore(true);
          setLinks(data.slice(0, limit)); 
        } else {
          setHasMore(false);
          setLinks(data);
        }
      } else {
        showNotif('Gagal mengambil data dari database.', 'danger');
      }
    } catch (error) {
      showNotif('Terjadi kesalahan jaringan.', 'danger');
    }
    setLoading(false);
  }, [supabaseUrl, supabaseKey]);

  useEffect(() => {
    fetchLinks(page);
  }, [page, fetchLinks]);

  const showNotif = (msg, type = 'success') => {
    setNotif({ msg, type });
    setTimeout(() => setNotif(null), 3000);
  };

  const handleCopy = (stringAcak) => {
    const fullLink = `https://${stringAcak}.${appConfig.DOMAIN}`;
    navigator.clipboard.writeText(fullLink);
    showNotif(`Tercopy: ${fullLink}`);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/links?id=eq.${id}`, {
        method: 'DELETE',
        headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
      });
      if (res.ok) {
        showNotif('Link berhasil dihapus.');
        fetchLinks(page); 
      } else {
        showNotif('Gagal menghapus link.', 'danger');
      }
    } catch (err) {
      showNotif('Terjadi kesalahan sistem.', 'danger');
    }
    setLoading(false);
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

      <style dangerouslySetInnerHTML={{__html: `
        body { font-family: 'Poppins', sans-serif; background-color: #f4f7f6; color: #2b2d42; margin: 0; }
        .list-wrapper { min-height: 100vh; padding: 40px 20px; max-width: 1200px; margin: 0 auto; }
        .header-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; flex-wrap: wrap; gap: 15px; }
        .brand-title { font-weight: 700; font-size: 24px; color: #1d3557; display: flex; align-items: center; gap: 8px; margin: 0; }
        .btn-custom { background: #3a86ff; color: #fff; border-radius: 8px; font-weight: 500; padding: 10px 20px; text-decoration: none; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s; font-size: 14px; }
        .btn-custom:hover { background: #2563eb; color: #fff; box-shadow: 0 4px 12px rgba(58, 134, 255, 0.2); }
        .btn-outline { background: #fff; color: #3a86ff; border: 1px solid #3a86ff; }
        .btn-outline:hover { background: #f0f4ff; }
        .btn-delete { background: #fee2e2; color: #ef4444; border-radius: 6px; padding: 6px 12px; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; font-weight: 500; font-size: 13px; transition: background 0.2s;}
        .btn-delete:hover { background: #fca5a5; color: #991b1b; }
        .btn-copy { background: #e0e7ff; color: #4f46e5; border-radius: 6px; padding: 6px 12px; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; font-weight: 500; font-size: 13px; transition: background 0.2s; margin-right: 8px;}
        .btn-copy:hover { background: #c7d2fe; color: #3730a3; }
        
        /* Table Styling */
        .table-container { background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); overflow-x: auto; border: 1px solid #e9ecef; width: 100%; }
        table { width: 100%; border-collapse: collapse; text-align: left; }
        th { background: #f8f9fa; color: #6c757d; font-weight: 600; font-size: 13px; padding: 16px 20px; border-bottom: 2px solid #e9ecef; white-space: nowrap; }
        td { padding: 16px 20px; border-bottom: 1px solid #f1f3f5; color: #495057; font-size: 14px; white-space: nowrap; vertical-align: middle; }
        tr:hover { background-color: #fcfdfd; }
        
        .path-text { color: #3a86ff; font-weight: 600; display: block; font-size: 15px; }
        .date-text { font-size: 12px; color: #868e96; }
        
        .notif-bar { position: fixed; top: 20px; right: 20px; background: #2b9348; color: #fff; padding: 12px 24px; border-radius: 8px; font-weight: 500; font-size: 14px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); z-index: 1000; display: flex; align-items: center; gap: 8px; animation: slideIn 0.3s ease; }
        .notif-danger { background: #d90429; }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        
        .pagination { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; }
      `}} />

      {/* Notifikasi Elegan */}
      {notif && (
        <div className={`notif-bar ${notif.type === 'danger' ? 'notif-danger' : ''}`}>
          <span className="material-icons notranslate" translate="no" style={{ fontSize: '18px' }}>
            {notif.type === 'danger' ? 'error_outline' : 'check_circle'}
          </span>
          {notif.msg}
        </div>
      )}

      <div className="list-wrapper">
        <div className="header-bar">
          <h2 className="brand-title">
            <span className="material-icons notranslate" translate="no" style={{ color: '#3a86ff' }}>list_alt</span>
            Daftar Link
          </h2>
          <Link href="/admin" className="btn-custom btn-outline">
            <span className="material-icons notranslate" translate="no" style={{ fontSize: '18px' }}>add_circle</span>
            Buat Link Baru
          </Link>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Target & Path URL</th>
                <th>Total Hits</th>
                <th>Dibuat Tanggal</th>
                <th>Aksi / Kelola</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>
                    <span className="material-icons notranslate" translate="no" style={{ animation: 'spin 2s linear infinite', color: '#3a86ff', fontSize: '30px' }}>autorenew</span>
                  </td>
                </tr>
              ) : links.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#adb5bd' }}>Belum ada data link.</td>
                </tr>
              ) : (
                links.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: '#eef2ff', padding: '10px', borderRadius: '8px', display: 'flex', color: '#3a86ff' }}>
                          <span className="material-icons notranslate" translate="no">public</span>
                        </div>
                        <div>
                          <span className="path-text">/{item.path_tambahan}</span>
                          <span style={{ fontSize: '12px', color: '#6c757d' }}>{item.string_acak}.{appConfig.DOMAIN}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#f1f3f5', padding: '4px 10px', borderRadius: '20px', fontWeight: '600', color: '#495057' }}>
                        <span className="material-icons notranslate" translate="no" style={{ fontSize: '14px', color: '#f59f00' }}>local_fire_department</span>
                        {item.hit_count}
                      </div>
                    </td>
                    <td>
                      <div className="date-text">{new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                      <div className="date-text">{new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td>
                      <button onClick={() => handleCopy(item.string_acak)} className="btn-copy">
                        <span className="material-icons notranslate" translate="no" style={{ fontSize: '15px' }}>content_copy</span> Copy
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="btn-delete">
                        <span className="material-icons notranslate" translate="no" style={{ fontSize: '15px' }}>delete_outline</span> Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button 
            className="btn-custom btn-outline" 
            disabled={page === 1 || loading} 
            onClick={() => setPage(page - 1)}
            style={{ opacity: page === 1 ? 0.5 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer' }}
          >
            <span className="material-icons notranslate" translate="no" style={{ fontSize: '18px' }}>chevron_left</span> Prev
          </button>
          
          <span style={{ fontWeight: '500', color: '#6c757d', fontSize: '14px' }}>Halaman {page}</span>
          
          <button 
            className="btn-custom btn-outline" 
            disabled={!hasMore || loading} 
            onClick={() => setPage(page + 1)}
            style={{ opacity: !hasMore ? 0.5 : 1, cursor: !hasMore ? 'not-allowed' : 'pointer' }}
          >
            Next <span className="material-icons notranslate" translate="no" style={{ fontSize: '18px' }}>chevron_right</span>
          </button>
        </div>

      </div>
    </>
  );
}
