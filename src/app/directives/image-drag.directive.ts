import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appImageDrag]'
})
export class ImageDragDirective {
  @Output() files: EventEmitter<any[]> = new EventEmitter();

  constructor() { }

  @HostListener("dragover", ["$event"]) public onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  @HostListener("dragleave", ["$event"]) public onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  @HostListener('drop', ['$event']) public onDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();

    let files: any[] = [];
    for (let i = 0; i < evt.dataTransfer.files.length; i++) {
      const file = evt.dataTransfer.files[i];
      files.push(file);
    }
    if (files.length > 0) {
      this.files.emit(files);
    }
  }
}
