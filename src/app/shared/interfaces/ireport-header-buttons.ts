export interface iReportHeaderButton
{
    chonBaoCaoClick(): void; //Chọn tham số báo cáo
    onMauClick(idMauBaoCao): void; //Chọn mẫu
    onPrintClick(): void; //In
    onExportClick(): void; //Xuất
    onHelpClick(): void; //Trợ giúp
    closeModal(): void; //Đóng
    onRefreshClick(): void; //Tải lại
}