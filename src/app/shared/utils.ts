export class RowScrollerToViewEdit { //class này được dùng để giữ active đến dòng của table đã xem/sửa
    private selectedRowToViewEdit: any = []; //dòng được chọn để xem/sửa

    //hàm này cuộn đến dòng đã xem/sửa
    scrollToRow(listData, idFieldName)
    {
        //listData là danh sách dữ liệu đang hiển thị trong các form chứng từ
        //idFieldName là tên trường khóa chính của listData, ví dụ: chungTuBanHangId, chungTuMuaHangId
        let promise = new Promise((resolve) => {
            setTimeout(() => {
              if (this.selectedRowToViewEdit.id == null) return null;
              var listTable = document.getElementsByClassName("ant-table-body"); //đọc các đối tượng là table
              listTable[0].scrollTop = this.selectedRowToViewEdit.offsetY; //di chuyển tới dòng đã xem/sửa của table đầu tiên

              //chọn dòng có id bản ghi đã xem/sửa
              listData.forEach(element => {
                if (element[idFieldName] == this.selectedRowToViewEdit.id){
                  element["selected"] = true;
                  resolve(element);
                }else{
                  element["selected"] = false;
                }
              });
            },0);
        });
        return promise;
    }
    
    //hàm này đọc thông tin của dòng đã xem/sửa
    getRowToViewEdit(inputId){
        //inputId là id bản ghi, ví dụ: chungTuBanHangId, chungTuMuaHangId
        var listTable = document.getElementsByClassName("ant-table-body");
        this.selectedRowToViewEdit.offsetY = listTable[0].scrollTop; //đọc vị trí lúc này của dòng cần xem/sửa
        this.selectedRowToViewEdit.id = inputId;
    }
}

export class KiemTraBangDuLieu{ //lớp này kiểm tra bảng dữ liệu có dòng nào hay ko
  kiemTraBangCoDuLieu(bangChung: any, bangChiTiet: any = null){
    //bangChung: bảng tổng hợp/bảng chung, bangChiTiet: bảng chi tiết
    if (bangChung == null) {
      if (bangChiTiet != null){
        bangChiTiet.length = 0;
      }
      return false;
    }
    
    if (bangChung.length == 0) {
      if (bangChiTiet != null){
        bangChiTiet.length = 0;
      }
      return false;
    }
    
    return true;
  }
}
