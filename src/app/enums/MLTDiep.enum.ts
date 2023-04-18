export enum MLTDiep {
    /// <summary>
    /// Nhóm thông điệp đáp ứng nghiệp vụ đăng ký, thay đổi thông tin sử dụng hoá đơn điện tử, đề nghị cấp hóa đơn điện tử có mã theo từng lần phát sinh
    /// </summary>
    //Thông điệp gửi tờ khai đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử
    TDGToKhai = 100,

    //Thông điệp gửi tờ khai đăng ký thay đổi thông tin đăng ký sử dụng HĐĐT khi ủy nhiệm/nhận ủy nhiệm lập hóa đơn
    TDGToKhaiUN = 101,

    //Thông điệp thông báo về việc tiếp nhận/không tiếp nhận tờ khai đăng ký/thay đổi thông tin sử dụng HĐĐT, tờ khai đăng ký thay đổi thông tin đăng ký sử dụng HĐĐT khi ủy nhiệm/nhận ủy nhiệm lập hoá đơn
    TBTNToKhai = 102,

    //Thông điệp thông báo về việc chấp nhận/không chấp nhận đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử
    TBCNToKhai = 103,

    //Thông điệp thông báo về việc chấp nhận/không chấp nhận đăng ký thay đổi thông tin đăng ký sử dụng HĐĐT khi ủy nhiệm/nhận ủy nhiệm lập hoá đơn
    TBCNToKhaiUN = 104,

    //Thông điệp thông báo về việc hết thời gian sử dụng hóa đơn điện tử có mã qua cổng thông tin điện tử Tổng cục Thuế/qua ủy thác tổ chức cung cấp dịch vụ về hóa đơn điện tử; không thuộc trường hợp sử dụng hóa đơn điện tử không có mã
    TBHTGHDDT = 105,

    //Thông điệp gửi Đơn đề nghị cấp hóa đơn điện tử có mã của CQT theo từng lần phát sinh
    TDDNCHDDT = 106,

    /// <summary>
    /// Nhóm thông điệp đáp ứng nghiệp vụ lập và gửi hóa đơn điện tử đến cơ quan thuế
    /// </summary>
    //Thông điệp gửi hóa đơn điện tử tới cơ quan thuế để cấp mã
    TDGHDDTTCQTCapMa = 200,

    //Thông điệp gửi hóa đơn điện tử tới cơ quan thuế để cấp mã theo từng lần phát sinh
    TDGHDDTTCQTCMTLPSinh = 201,

    //Thông điệp thông báo kết quả cấp mã hóa đơn điện tử của cơ quan thuế
    TBKQCMHDon = 202,

    //Thông điệp chuyển dữ liệu hóa đơn điện tử không mã đến cơ quan thuế
    TDCDLHDKMDCQThue = 203,

    //Thông điệp thông báo về việc kết quả kiểm tra dữ liệu hóa đơn điện tử
    TDTBKQKTDLHDon = 204,

    //Thông điệp gửi đề nghị cấp hóa đơn điện tử có mã của CQT theo từng lần phát sinh
    TDDNCHDDTCMa = 205,

    //Thông điệp gửi hóa đơn khởi tạo từ máy tính tiền đã cấp mã tới cơ quan thuế
    TDGHDKTTMTT = 206,

    TDNMKHDon = 207,

    TDKMHDon = 208,
    /// <summary>
    /// Nhóm thông điệp đáp ứng nghiệp vụ xử lý hóa đơn có sai sót
    /// </summary>
    //Thông điệp thông báo về hóa đơn điện tử đã lập có sai sót
    TDTBHDDLSSot = 300,

    //Thông điệp gửi thông báo về việc tiếp nhận và kết quả xử lý về việc hóa đơn điện tử đã lập có sai sót
    TBTNVKQXLHDDTSSot = 301,

    //Thông điệp thông báo về hóa đơn điện tử cần rà soát
    TDTBHDDTCRSoat = 302,
    
    //Thông điệp thông báo về hóa đơn điện tử khởi tạo từ máy tính tiền đã lập có sai sót
    TDTBHDDTKTTMTTCSSot = 303,

    /// <summary>
    /// Nhóm thông điệp chuyển bảng tổng hợp dữ liệu hóa đơn điện tử đến cơ quan thuế
    /// </summary>
    //Thông điệp chuyển bảng tổng hợp dữ liệu hóa đơn điện tử đến cơ quan thuế
    TDCBTHDLHDDDTDCQThue = 400,
    //Thông điệp chuyển nhiều bảng tổng hợp dữ liệu hóa đơn điện tử đến cơ quan thuế
    TDCNBTHDLHDDDTDCQThue = 401,

    /// <summary>
    /// Nhóm thông điệp chuyển dữ liệu hóa đơn điện tử do T-VAN uỷ quyền cấp mã đến cơ quan thuế
    /// </summary>
    //Thông điệp chuyển dữ liệu hóa đơn điện tử do T-VAN uỷ quyền cấp mã đến cơ quan thuế
    TDCDLTVANUQCQThue = 500,

    /// <summary>
    /// Nhóm thông điệp khác
    /// </summary>
    //Thông điệp phản hồi kỹ thuật
    TDCDLTVANUQCTQThue = 999
}