import { MLTDiep } from "../enums/MLTDiep.enum";
import { NBan } from "./nban";

export interface MessageInv {
    type?: number;
    //1000 - ky hoa don (pdf,xml)
    //2000 - ky bien ban
    //1003 - ký đồng loạt
    DataPDF?: string; //link pdf need to sign
    DataXML?: string; //link xml need to sign
    NBan?: NBan; //Thong tin can de ky
}

export interface MessageInvTT78 {
    mLTDiep?: MLTDiep;
    urlXML?: string;
    urlPdf?: string;
    dataXML?: string;
    serials?: string[];
    mst?: string;
    tTNKy?: TTNKy;
    dataPDF?: any;
}

export interface TTNKy{
    mst: string;
    ten: string;
    sDThoai: string;
    diaChi: string;
    tenP1: string;
    tenP2: string;
}