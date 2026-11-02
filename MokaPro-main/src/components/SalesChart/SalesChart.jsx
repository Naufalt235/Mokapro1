import './SalesChart.css';

export default function SalesChart({ history }) {
  // 1. Kelompokkan total penjualan berdasarkan jam
  const salesByHour = {};
  history.forEach(trx => {
    // Asumsi trx.date berformat "DD/MM/YYYY, HH.MM.SS" atau sejenisnya.
    // Kita ambil jam-nya saja (2 digit pertama dari string waktu).
    // Jika format waktu Anda berbeda, sesuaikan logika ini.
    const timeString = trx.date.split(', ')[1] || trx.date; 
    const hour = timeString.split(':')[0] || timeString.split('.')[0];
    
    if (hour && !isNaN(hour)) {
      salesByHour[hour] = (salesByHour[hour] || 0) + trx.total;
    }
  });

  // 2. Siapkan data untuk SVG (jam 08:00 sampai 22:00)
  const hours = Array.from({ length: 15 }, (_, i) => (i + 8).toString().padStart(2, '0'));
  const maxSales = Math.max(...Object.values(salesByHour), 100000); // Minimal 100rb untuk skala

  // 3. Hitung koordinat SVG
  const width = 600;
  const height = 200;
  const padding = 30;
  
  const points = hours.map((hour, index) => {
    const sales = salesByHour[hour] || 0;
    const x = padding + (index * (width - padding * 2) / (hours.length - 1));
    const y = height - padding - (sales / maxSales) * (height - padding * 2);
    return { x, y, sales, hour };
  });

  // 4. Buat path string untuk SVG (Garis)
  const pathData = points.map(p => `${p.x},${p.y}`).join(' L ');

  return (
    <div className="chart-wrapper">
      <svg viewBox={`0 0 ${width} ${height}`} className="sales-svg">
        {/* Garis Grid Horizontal */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#ede5dc" strokeWidth="1" />
        <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#f2ece6" strokeWidth="1" strokeDasharray="4 4" />
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#f2ece6" strokeWidth="1" strokeDasharray="4 4" />

        {/* Garis Grafik Data */}
        {history.length > 0 && (
          <path d={`M ${pathData}`} fill="none" stroke="#bd733d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        )}

        {/* Titik-titik Data */}
        {points.map((p, i) => (
          <g key={i}>
            {p.sales > 0 && (
              <circle cx={p.x} cy={p.y} r="4" fill="#3b2519" stroke="#ffffff" strokeWidth="2" />
            )}
            {/* Label Jam di Bawah */}
            <text x={p.x} y={height - 5} textAnchor="middle" fontSize="10" fill="#8a7c73">{p.hour}:00</text>
          </g>
        ))}
      </svg>
      
      {history.length === 0 && (
        <div className="chart-empty">Belum ada data transaksi untuk ditampilkan.</div>
      )}
    </div>
  );
}