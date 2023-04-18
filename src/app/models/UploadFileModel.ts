import { RefType } from "./nhat-ky-truy-cap";

export class TaiLieuDinhKem {
    taiLieuDinhKemId?: string;
    loaiNghiepVu?: RefType;
    nghiepVuId?: string;
    tenGoc?: string;
    tenGuid?: string;
    link?: string;
    file?: any;
    files?: any;
    removedFileIds?: any[];
}

export class MauHoaDonUploadImage {
    mauHoaDonId?: any;
    logo?: any;
    background?: any;
    removedLogoFileName?: any;
    removedBackgroundFileName?: any;
}