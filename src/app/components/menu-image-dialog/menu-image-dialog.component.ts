import { Component, Inject, OnInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-menu-image-dialog',
  templateUrl: './menu-image-dialog.component.html',
  styleUrl: './menu-image-dialog.component.css'
})
export class MenuImageDialogComponent implements OnInit {

  imageToShow: any;

  constructor(private service: MenuService, @Inject(MAT_DIALOG_DATA) public data: any, public matDialogRef: MatDialogRef<MenuImageDialogComponent>, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getImageFromService();
  }
  
  getImageFromService() {
    this.service.getImage(this.data.id).subscribe(data => {
      this.createImageFromBlob(data);
    }, error => {
      this.snackBar.open('Error loading image', undefined, {
        duration: 3000,
      });
    });
  }

  createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.imageToShow = reader.result;
    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
  }

}
