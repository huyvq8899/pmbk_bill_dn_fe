(function(window) {
    window.__env = window.__env || {};

    // API url
    // window.__env.apiUrl = 'https://hoadon-da.pmbk.vn';
    window.__env.apiUrl = 'https://localhost:44354';
    window.__env.apiUrlQlkh = 'https://qlkh.pmbk.vn';

    window.__env.taxCodeTCGP = '0202029650';
    window.__env.taxCodeTCTN = 'V0200784873';
    window.__env.taxCodeNotAddMtt = ['0202029650'];// ds mst này là để cho KH vé không được thêm sửa xóa hóa đơn MTT vì đã tạo hóa đơn trên pmql vé rồi.
    
    window.__env.apiApp = 'https://app.pmbk.vn';
    // Whether or not to enable debug mode
    // Setting this to false will disable console output
    window.__env.enableDebug = false;

}(this));
