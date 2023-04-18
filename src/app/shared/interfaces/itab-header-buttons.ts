export interface iTabHeaderButton {
    fbBtnThemDisable: boolean;
    fbBtnXoaDisable: boolean;
    fbBtnSuaDisable: boolean;
    fbBtnExportExcelDisable: boolean;
    fbBtnChangeSearchDisable: boolean;
    fbBtnDuplicateDisable: boolean;
    fbBtnPreviewMutileDisable: boolean;

    clickThem();
    clickXoa();
    clickSua(value: boolean);
    exportExcel();
    changeSearch();
    previewMutile();
}