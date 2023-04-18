import { AfterViewInit, Component, Directive, ElementRef, EventEmitter, Input, NgZone, OnChanges, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { NzMessageService } from 'ng-zorro-antd';
import { CookieConstant } from 'src/app/constants/constant';
import { FilterColumn, FilterCondition } from 'src/app/models/PagingParams';
import { DinhDangThapPhan } from '../../DinhDangThapPhan';
import { CheckValidDate, isValidDate } from '../../getDate';

@Component({
  selector: 'app-filter-column',
  templateUrl: './filter-column.component.html',
  styleUrls: ['./filter-column.component.scss']
})
export class FilterColumnComponent implements OnInit {
  @Input() title: string;
  @Input() dataType: number; // 1: string, 2 decimal 3 datetime
  data: FilterColumn;
  @Output() submitFilterCol = new EventEmitter<any>();
  dataTemp: FilterColumn;
  conditionName: string;
  conditionValue: any;
  selectColKey: any;
  selectColText: any;
  kyKeKhaiThueGTGT = localStorage.getItem(CookieConstant.KYKEKHAITHUE) == 'Quy' ? 6 : 4;
  tempToDate = this.kyKeKhaiThueGTGT == 6 ? moment().quarter(moment(moment().format('YYYY-MM-DD')).quarter()).endOf('quarter').format('YYYY-MM-DD') : moment().endOf('month').format('YYYY-MM-DD');
  tempFormDate = this.kyKeKhaiThueGTGT == 6 ? moment().quarter(moment(moment().format('YYYY-MM-DD')).quarter()).startOf('quarter').format('YYYY-MM-DD') : moment().startOf('month').format('YYYY-MM-DD');

  fromDate: any = this.tempFormDate;
  toDate: any = this.tempToDate;
  visibleMenu = false;
  isDisabledColKey = false;
  dropdownStyle = {
    width: '100%'
  };
  rawConditions: Array<{ value: number, text: string }> = [
    { value: 1, text: 'Chứa' },
    { value: 2, text: 'Không chứa' },
    { value: 3, text: 'Bằng' },
    { value: 4, text: 'Khác' },
    { value: 5, text: 'Bắt đầu' },
    { value: 6, text: 'Kết thúc' },
    { value: 7, text: 'Nhỏ hơn' },
    { value: 8, text: 'Nhỏ hơn hoặc bằng' },
    { value: 9, text: 'Lớn hơn' },
    { value: 10, text: 'Lớn hơn hoặc bằng' },
    { value: 11, text: 'Trống' },
    { value: 12, text: 'Không trống' },
    { value: 13, text: 'Từ ngày - Đến ngày' },
  ];
  conditions: Array<{ value: number, text: string }> = [];
  listColKey: Array<{ value: string, text: string }> = [];
  ddtp = new DinhDangThapPhan();
  isSearchDate = false;
  constructor(
    private message: NzMessageService,
    private elementRef: ElementRef
  ) { }

  ngOnInit() {
  }
  ngAfterViewInit() {
  }
  inputData(data: any) {
    this.listColKey = [];
    this.data = data;
    this.conditionValue = this.data.filterCondition;
    if (this.data.colKey.includes("|")) {
      this.selectColKey = this.data.colKey.split('|')[0].split(':')[0];
      this.selectColText = this.data.colKey.split('|')[0].split(':')[1];
      this.isSearchDate = this.selectColKey.toLowerCase().includes('ngay');

      this.data.colKey.split('|').forEach(element => {
        var col = element.split(':');
        var colVal = {
          value: col[0],
          text: col[1]
        }
        this.listColKey.push(colVal);
      });
    } else {
      console.log('xzzz');
      this.isDisabledColKey = true;
      var colVal = {
        value: this.data.colKey,
        text: this.title
      }
      this.selectColKey = this.data.colKey;
      this.selectColText = this.title;
      this.listColKey.push(colVal);
      console.log(this.listColKey);

    }
    if (this.dataType === 1) {
      this.conditions = this.rawConditions.filter(x => (x.value >= 1 && x.value <= 6) || (x.value >= 11 && x.value <= 12));
    } else if (this.dataType === 2) {
      this.conditions = this.rawConditions.filter(x => (x.value >= 1 && x.value <= 3) || (x.value >= 7 && x.value <= 12));
    }
    else if (this.dataType == 3) {
      this.conditions = this.rawConditions.filter(x => x.value == 3 || x.value == 4 || (x.value >= 7 && x.value <= 10))
    }

    this.dataTemp = this.data ? Object.assign({}, this.data) : null;
    if (this.dataType === 2) {
      this.dataTemp.colValue = this.dataTemp.colValue || 0;
    }
    this.conditionName = this.data ? this.rawConditions.find(x => x.value === this.data.filterCondition).text : this.conditions[0].text;

    if (this.listColKey.length > 0) {
      this.colChangeValue(this.listColKey[0].value);
    }
  }

  removeFilter() {
    this.data.colValue = null;
    this.data.isFilter = false;
    this.submitFilterCol.emit({
      status: false,
      colKey: this.selectColKey,
      isFilter: false,
    });
  }

  filter() {
    if (this.conditionValue == 13) {
      this.dataTemp.colValue = this.fromDate + '|' + this.toDate;
    }

    this.data.colValue = this.dataTemp.colValue;
    this.data.isFilter = true;
    this.data.colNameVI = this.selectColText;
    this.data.filterCondition = this.conditionValue;

    this.data.colKey = this.selectColKey;
    this.submitFilterCol.emit({
      status: true,
      colKey: this.data.colKey,
      colValue: this.data.colValue,
      filterCondition: this.data.filterCondition,
      isFilter: true,
    });
  }

  clickSelectedCondition(value: any) {
    this.dataTemp.filterCondition = value;
    this.conditionName = this.conditions.find(x => x.value === value).text;
  }
  colChangeValue(event: any) {
    this.selectColText = this.listColKey.find(x => x.value == event).text;
    if (event.toLowerCase().includes('ngay')) {
      this.dataTemp.colValue = moment().format('YYYY-MM-DD');
      this.isSearchDate = true;
      // this.conditions = this.rawConditions.filter(x => (x.value == 3) || (x.value >= 7 && x.value <= 10) || (x.value == 13));
      this.conditions = this.rawConditions.filter(x => (x.value == 3) || (x.value >= 7 && x.value <= 13));
      this.conditionValue = 3;
    } else if (event.toLowerCase().includes('maloaitien')) {
      this.dataType = 1;
      this.dataTemp.colValue = null;
      this.conditions = this.rawConditions.filter(x => (x.value >= 1 && x.value <= 6) || (x.value >= 11 && x.value <= 12));
    }else if (event.toLowerCase().includes('tongtienthanhtoan')) {
      this.dataType = 2;
      this.conditions = this.rawConditions.filter(x => (x.value >= 1 && x.value <= 3) || (x.value >= 7 && x.value <= 12));
    }
    else {
      this.dataTemp.colValue = null;
      this.isSearchDate = false;
      this.conditionValue = this.data.filterCondition;
      if (this.dataType === 1) {
        this.conditions = this.rawConditions.filter(x => (x.value >= 1 && x.value <= 6) || (x.value >= 11 && x.value <= 12));
      } else if (this.dataType === 2) {
        this.conditions = this.rawConditions.filter(x => (x.value >= 1 && x.value <= 3) || (x.value >= 7 && x.value <= 12));
      }
    }
  }
}
