export interface iModalHeaderButton
{
    fbBtnPlusDisable: boolean;
    fbBtnEditDisable: boolean;
    fbBtnDeleteDisable: boolean;
    fbBtnPrinterDisable: boolean;
    fbBtnBackwardDisable: boolean;
    fbBtnForwardDisable: boolean;
    fbBtnSaveDisable: boolean;
    fbBtnFirst: boolean;
    fbBtnLast: boolean;
    spinning: boolean;

    first(): void; //Về đầu
    forward(): void; //Trước
    backward(): void; //Sau
    last(): void; //Về cuối
    onAddObjClick(): void; //Thêm
    onEditClick(): void; //Sửa
    submitForm(): void; //Lưu
    onDeleteClick(): void; //Xóa
    onPrintClick(): void; //In
    onHelpClick(): void; //Trợ giúp
    closeModal(): void; //Đóng
}