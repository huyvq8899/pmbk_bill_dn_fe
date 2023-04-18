export function IframeCSS() {
  return `<meta http-equiv="Content-Type" content="text/html; charset=utf-16">
  <title>Mẫu hóa đơn</title>
  <style>
        body {
        padding: 0;
        margin: 0;
        }

        body, table {
        font-size: 14px;
        line-height: 25px;
        text-align: center;
        font-family: Times New Roman;color: #000000;
        }

        .container {
        width: 865px;
        overflow: visible;
        position: relative;
        }

        .ruler-template{
        padding-top: 40px;
        margin-left: 45px;
        margin-right: 45px;
        box-sizing: border-box;
        }

        .content-detail{
        min-height: 1068px;
        max-width: 775px;
        }

        .font-bold{
        font-weight: bold;
        }

        .font-italic{
        font-style: italic;
        }

        .text-left {
        text-align: left;
        }

        .text-center {
        text-align: center;
        }

        .text-right {
        text-align: right;
        }

        .float-left{
        float: left;
        }

        .float-right{
        float: right;
        }

        .clear{
        clear:both;
        }

        .display-table-cell{
        display: table-cell;
        }

        #tbFooter .white-space-nowrap{
        white-space: nowrap;
        }

        .style-title {
        font-weight: bold;
        text-transform: uppercase;
        font-size: 20px;
        }

        .style-title .edit-label-en {
        font-weight: bold;
        text-transform: uppercase;
        font-size: 18px;
        }

        .width-full{
        width:100%;
        }

        .width-half{
        width:50%;
        }

        .width-third{
        width:30%;
        }

        .width-quarter{
        width:25%;
        }

        .display-none{
        display: none;
        }

        .seller-infor .edit-value, .buyer-infor .edit-value, .other-invoice .edit-value, .curency-block .edit-value,
        .seller-infor .edit-label-en, .buyer-infor .edit-label-en, .other-invoice .edit-label-en, .curency-block .edit-label-en, .table-footer .edit-label-en {
        padding-left: 4px;
        }

        .seller-infor, .buyer-infor {
        text-align: left;
        }

        .padding-none{
        padding: 0 !important;
        }

        .frame-template{
        background-image: url('');
        height: 1224.08012599878792px;
        width: 864.3439370181381px;
        background-size:100% 100%;
        position: absolute;
        z-index:-1;
        top:0;
        left:0;
        display: block;
        }

        .frame-template-ve{
          background-image: url('');
          height: 612.04012599878792px;
          width: 864.3439370181381px;
          background-size:100% 100%;
          position: absolute;
          z-index:-1;
          top:0;
          left:0;
          display: block;
          }

        .frame-template{
          background-image: url('');
          height: 1224.08012599878792px;
          width: 864.3439370181381px;
          background-size:100% 100%;
          position: absolute;
          z-index:-1;
          top:0;
          left:0;
          display: block;
          }

        .bg-template-parent{
        position: absolute !important;
        z-index:-1;
        height: 0px;
        width: 0px;
        top: 0;
        left: 0;
        }

        .bg-template{
        background-size:100% 100%;
        background-repeat:no-repeat;
        background-position: center;
        background-image: url('');
        transform: none;
        opacity:0.35;
        height:100%;
        width:100%;
        }

        .bg-template-default {
        position: absolute !important;
        z-index:-1;
        height: 0px;
        width: 0px;
        top: 0;
        left: 0;
        }

        .bg-default {
        background-size:100% 100%;
        background-repeat:no-repeat;
        background-position: center;
        background-image: url('');
        transform: none;
        opacity:0.35;
        height:100%;
        width:100%;
        }

        .logo-template{
        z-index: -1;
        }
        .logo-template-content{
        position: relative;
        background-position-x: 0px;
        background-position-y: center;
        background-size:100% 100%;
        background-image: url();
        height:0;
        width:0;
        top:0px;;
        left:0px;;
        }

        .information-company{
        width: 100%;
        }

        .header-invoice{
        border-top: 1px;
        border-bottom: 1px;
        border-left: 0;
        border-right: 0;
        border-style: solid;
        border-color: #CCC;
        padding-top: 2px;
        }

        .other-invoice{
        }
        .type-invoice{
        }

        .buyer-infor{
        width:86%;
        }

        .qrcode-parent{
          padding: 10px 0 5px 10px;
        }

        .qrcode{
        width: 85px;
        height: 85px;
        
        background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA5YAAAOWAQAAAAC8cDDTAAAABGdBTUEAALGPC/xhBQAAAAJiS0dEAAHdihOkAAAAB3RJTUUH5gURBjsgL91e9wAAAAFvck5UAc+id5oAAAO2SURBVHja7d0xcqMwFAZgZbZI6SNwFB/NHM1H4QguU2SiNQlEQgic3SIome8vEmyh96l9I4FD/Pa8BubvMt/Cdu43zMPP04Rh+ny5X9//PWW1btPQ+X7dbxc9M5lMJpPJZDKZTCazBfNPXKd/bFYyZObWMJPJZDKZTCaTyWQyWzFfQkox63Uyb/f/XVYh7Pef2YrHnJhMJpPJZDKZTCaT+UPMvD297S8pxlX/yWQymUwmk8lkMpnMn2jmRUezm77rwyK1YSaTyWQymUwmk8lktm6WKcx51phrqJ5LvdVXnIfJZDKZTCaTyWQymc2YW4lpL/IlZB1kXDSYW8MbYTKZTCaTyWQymUzm4Wbcz9ZW5ZhKwS4+DpPJZDKZTCaTyWQyjzbLouOsayryFNNeZD58WZrPRd0+VE+1vq+YyWQymUwmk8lkMpmtmHOGaejy8fELW5V58hXH5dtu5uJMJpPJZDKZTCaTyTzcHC+33j5a5DTdcg2LZxTzRxiH9ZLK5jYymUwmk8lkMplMJvNo861StEhZ9Ly+5aU+vNPzMplMJpPJZDKZTCbzOLOcNeaalvEU6+nTcH7wtNtf8fQFk8lkMplMJpPJZDLbMoeQOshEP9qqzM15xZm7eNsNk8lkMplMJpPJZDJbMFctYtw8lzpM15d0Z63/7EP1XCqTyWQymUwmk8lkMpswq1+ngvOx1Z3+cz54essqXNLsfLj7WCOTyWQymUwmk8lkMtsz58RlB3lKS8nPpcZi+BqqP3PBZDKZTCaTyWQymcxmzI+/65Olxaw53dIMxZKGkLrXUP9FRCaTyWQymUwmk8lkHm6WrxeNWdFY34ss8mD2qntlMplMJpPJZDKZTObR5nxVbjZWciuwzxopXUzdaxYmk8lkMplMJpPJZDZn5u+rGUJ6CDEu+8+K+ZZ9nGdvhMlkMplMJpPJZDKZTZk7Kc1uPZzvRc4rLmbnOTOZTCaTyWQymUwm82iz9vWcnaJ9WPWfn0XjZvf6vmImk8lkMplMJpPJZLZg/sMzimOuqX7+7tLcnFLOfl8xk8lkMplMJpPJZDJbMctZkzmm9gP2WcpTrUV23pHDZDKZTCaTyWQymcwmzWoHOV1nRWO2pGuo/qbh52wmk8lkMplMJpPJZP4Asywa18O1vciw3Ko8MZlMJpPJZDKZTCazNbPMVLTMMBW+LIvWhuP/PqPIZDKZTCaTyWQymcxvMLcS9/vPsP2MYp8+rmYzmUwmk8lkMplMJvNoM357mEwmk/mLzb/xCkjopqEEQAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMi0wNS0xN1QwNjo1OToyMiswMDowMJ4EX/8AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjItMDUtMTdUMDY6NTk6MjIrMDA6MDDvWedDAAAAAElFTkSuQmCC') no-repeat center center;
        background-size: cover;
        }

        #tbDetail, #tbFooter {
        border-style: solid;
        border-color: #776b6b;
        border-width: 1px;
        line-height: 20px;
        }

        #tbDetail .tr-symbol td {
        border-bottom: 1px solid #776b6b;
        }

        #tbFooter{
        border:none;
        width:100%;
        }
        #tbFooter td:last-child{
        border-right: 1px solid #776b6b;
        }
        #tbDetail{
        border: none;
        }
        #tbDetail td:first-child, #tbFooter td:first-child{
        border-left: 1px solid #776b6b;
        }

        #tbDetail tr:last-child td{
        border-bottom: 1px solid #776b6b;
        }

        #tbDetail tr:first-child td{
        border-top: 1px solid #776b6b;
        border-bottom: 1px solid #776b6b;
        }

        #tbDetail .tr-header td{
        padding: 2px 0;
        }

        #tbDetail td{
        border-style: none solid dotted none;
        border-color: #776b6b;
        border-width: 1px;
        padding: 2px;
        }

        #tbFooter td{
        padding: 2px 0;
        border-style:  none none solid none;
        border-color: #776b6b;
        border-width: 1px;
        border-collapse: collapse;
        }

        #tbDetail td .edit-value, #tbDetail td .edit-label, #tbDetail td .edit-label-en {
        padding: 0 2px;
        }

        #tbOther td {
        border-left: 1px dashed transparent;
        white-space: nowrap;
        }

        #tbOther tr td:first-child, #tbOther tr td:last-child,{
        border-left: none;
        }

        .style-number-value {
        padding-right: 4px;
        }

        .padding-left-4{
        padding-left: 4px;
        }

        .number {
        text-align: right;
        }

        .content-sign{
          width: 220px;
          padding:5px;
          color: #20b708;
          position: relative;
          margin-top: 20px;
          margin-left: auto;
          margin-right: auto;
          border: 1px solid #20b708;
          line-height: 1.3;
        }

        .vertical-align-top{
          vertical-align: top;
        }

        .background-sign{
          background: url('data:image/png;base64,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') no-repeat center center;
          background-size: 90px;
          // background-position: right 115px bottom 12px;
          width: 100%;
        }

        .block-tax-code{
        width: 20px;border:
        1px solid #b7b7b7;
        line-height: 20px;
        padding-top: 2px;
        }

        .sign-xml-block {
        margin-top: 8px;
        }

        .invoice-information {
        width: 100%;
        border-collapse: collapse;
        }

        .element-help-center {
        width: 145px;
        }

        .inv-series-no {
        width: 145px;
        }

        .inv-series-no-en {
        width: 190px;
        }

        .vertical-align-top {
        vertical-align: top;
        }

        .edit-label-en {
        font-style: italic;
        font-size: 13px;
        }

        .sign-content-convert {
        margin-top: 90px;
        }

        .padding-left-2 {
        padding-left: 2px;
        }

        .width-converter {
        width: 550px;
        }

        .display-cannot-show {
        display: none;
        }

        .padding-left-16 {
        padding-left: 16px;
        }

        .seller-infor .edit-label-en, .seller-infor .edit-label, .buyer-infor .edit-label-en, .buyer-infor .edit-label {
        white-space: nowrap;
        }

        .other-table-container {
        vertical-align: top;
        }

        .text-en-fake {
        white-space: nowrap;
        font-style: italic;
        font-size: 13px;
        }

        #signXml .white-space-nowrap {
        white-space: nowrap;
        }

        .template-table{
        background-image: url('data:image/png;base64,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');
        background-repeat:no-repeat;
        background-position: center;
        position:absolute;
        z-index: 100;
        width:100%;
        height:100%
        }

        .p-relative {
        position: relative;
        }

        #tbFooter .tr-multi-tax td {
          border-left: 1px solid #776b6b;
        }

        .esign-value-company {word-break: break-word;}</style>
<link type="text/css" rel="stylesheet" href="https://meinvoice.misacdn.net/appbeta/Component/jquery.ui/css/jquery.ui.css"><link type="text/css" rel="stylesheet" href="https://meinvoice.misacdn.net/appbeta/Component/jquery.colorpicker/css/bootstrap-colorpicker-plus.min.css"><link type="text/css" rel="stylesheet" href="https://meinvoice.misacdn.net/appbeta/Component/jquery.colorpicker/css/bootstrap-colorpicker.min.css"><link type="text/css" rel="stylesheet" href="https://meinvoice.misacdn.net/appbeta/Content/css/Views/IPTemplateV3/PreViewTemplate.css?t=637657377368691842"><style type="text/css">  .JColResizer{table-layout:fixed;} .JColResizer > tbody > tr > td, .JColResizer > tbody > tr > th{overflow:hidden;padding-left:0!important; padding-right:0!important;}  .JCLRgrips{ height:0px; position:relative;} .JCLRgrip{margin-left:-5px; position:absolute; z-index:5; } .JCLRgrip .JColResizer{position:absolute;background-color:red;filter:alpha(opacity=1);opacity:0;width:10px;height:100%;cursor: e-resize;top:0px} .JCLRLastGrip{position:absolute; width:1px; } .JCLRgripDrag{ border-left:1px dotted black;	} .JCLRFlex{width:auto!important;} .JCLRgrip.JCLRdisabledGrip .JColResizer{cursor:default; display:none;}

        .buyer-qr-infor {
          display: flex;
        }

        .buyer-infor {
          flex: 1;
        }

        .qrcode-parent {
          width: 100px;
        }

        .main-buyer-wrapper {
          display: flex;
        }

        .left-main-buyer {
          width: 86%;
        }

        .bg-picked-by-user .left-main-buyer {
          outline: 1px dashed #1492E6;
        }

        .padding-left-none {
          padding-left: 0 !important;
        }

        .tbl-thong-tin-nguoi-ky {
          table-layout: fixed;
        }
</style>
    `;
}

export function IframeScript(container: HTMLElement) {
  const link = [
      'https://meinvoice.misacdn.net/appbeta/Scripts/Lib/jquery-3.3.1.min.js',
      'https://meinvoice.misacdn.net/appbeta/Component/jquery.ui/js/jquery-ui.js',
      'https://meinvoice.misacdn.net/appbeta/Component/jquery.colorpicker/js/bootstrap-colorpicker.min.js',
      'https://meinvoice.misacdn.net/appbeta/Component/jquery.colorpicker/js/bootstrap-colorpicker-plus.min.js',
      'https://meinvoice.misacdn.net/appbeta/Scripts/Lib/jquery.ui.rotatable.js',
      'https://meinvoice.misacdn.net/appbeta/Scripts/Lib/colResizable-1.6.min.js',
      'https://meinvoice.misacdn.net/appbeta/Scripts/Lib/jQuery.resizableColumns.js',
      // 'https://meinvoice.misacdn.net/appbeta/Scripts/Views/IPTemplateV3/PreViewTemplate.js?t=637657377368691842'
  ];

  link.forEach((item: any) => {
      var s = document.createElement("script");
      s.type = "text/javascript";
      s.src = item;
      container.appendChild(s);
  });
}