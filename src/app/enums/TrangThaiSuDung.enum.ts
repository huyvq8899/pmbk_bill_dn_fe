export enum TrangThaiSuDung {
    TatCa = -1,
    ChuaXacThuc = 0,
    DaXacThuc = 1,
    DangSuDung = 2,
    NgungSuDung = 3,
    HetHieuLuc = 4
}

export const TrangThaiSuDungDescription = new Map<number, string>([
    [TrangThaiSuDung.TatCa, 'Tất cả'],
    [TrangThaiSuDung.ChuaXacThuc, 'Chưa xác thực'],
    [TrangThaiSuDung.DaXacThuc, 'Đã xác thực'],
    [TrangThaiSuDung.DangSuDung, 'Đang sử dụng'],
    [TrangThaiSuDung.NgungSuDung, 'Ngừng sử dụng'],
    [TrangThaiSuDung.HetHieuLuc, 'Hết hiệu lực']
]);

export enum TrangThaiSuDung2 {
    None = 0,
    KhongSuDung = 1,
    DangSuDung = 2,
    NgungSuDung = 3
}
