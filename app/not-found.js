export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', alignItems: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '3rem', margin: '0', color: '#ff4444' }}>404</h1>
      <h2>Link Tidak Ditemukan</h2>
      <p style={{ color: '#666' }}>URL yang kamu tuju salah, tidak terdaftar, atau sudah dihapus.</p>
    </div>
  )
}
