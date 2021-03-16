import { Component, OnInit, Inject } from '@angular/core';
import { MatchPrice } from '../../../core/models/matchPrice';
import { NewCoupon } from '../../../core/models/coupon';
import { ApiService } from '../../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-mdialog',
  templateUrl: './mdialog.component.html',
  styleUrls: ['./mdialog.component.css']
})
export class MdialogComponent implements OnInit {

  public detail: any;
  public isLoading:boolean = false
  constructor( public dialogRef: MatDialogRef<MdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly api: ApiService) {

      this.isLoading = false;
      this.api.coupon(data.id).subscribe(detail => { 
        this.detail = detail.data;
        this.isLoading = true;

      });
  }

  ngOnInit(): void {
  }
  closeDialog(): void {
    this.dialogRef.close();

  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }
}
