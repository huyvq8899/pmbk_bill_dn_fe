export class GlobalConstants {
  public static ModalComponent: any;
  public static PreviousModalComponent: any; //modal đã được mở trước đó
  public static TabComponent: any;
  public static ReportComponent: any;
  public static UserPermissions: any;
  public static ThamSoBaoCaoGocTuTongHop: any;
  public static ThongDiepChungId: any;
  public static CallBack:() => any;
}

export function CheckFunctionByPermission(userPermissions, functionName) {
  if (userPermissions != null) {
    if (userPermissions === true) return true;
    var arrayPermissions = userPermissions.split(',');
    return (arrayPermissions.indexOf(functionName) >= 0);
  }
  return false;
}

export function LamTronTienNgoaiTe(input: number) {
  return Math.round(input * 1e2) / 1e2;
}

export function LamTronTienQuyDoi(input: number) {
  return Math.round(input);
}

export function LamTronTienViet(input: number) {
  return Math.round(input);
}

export function LamTronTyLePhanTram(input: number) {
  return Math.round(input * 1e2) / 1e2;
}

export function SumwidthConfig(widthConfig: any[]): string {
  let sum = 0;
  
  widthConfig.forEach(element => {
    let width = +element.substr(0, element.length - 2);
    sum += width
  });
  return sum + 'px';
}
