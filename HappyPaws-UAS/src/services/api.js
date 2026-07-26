// Domain C (Warung Digital) tidak mewajibkan data dari REST API publik,
// jadi file ini disediakan sebagai tempat ekstensi jika suatu saat
// Happy Paws ingin mengambil data eksternal (contoh: kurs, ongkir, dsb).
// Saat ini tidak digunakan oleh screen manapun.

export async function fetchDummyData(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Gagal mengambil data');
    return await res.json();
  } catch (e) {
    console.warn('api.fetchDummyData error', e);
    return null;
  }
}
