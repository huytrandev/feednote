import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService, CommonService } from 'src/app/core/services';

@Component({
  selector: 'app-reset-password-dialog',
  templateUrl: './reset-password-dialog.component.html',
  styleUrls: ['./reset-password-dialog.component.scss'],
})
export class ResetPasswordDialogComponent implements OnInit {
  password: string = '';
  showPassword: boolean = false;
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<ResetPasswordDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  resetPassword() {
    this.loading = true;
    this.authService.resetPassword(this.data.userId).subscribe((res) => {
      const { status } = res;
      if (!status) {
        this.commonService.openAlert('Khôi phục mật khẩu thất bại', 'danger');
        return;
      }

      const { data } = res;
      this.password = data;
      this.commonService.openAlert('Khôi phục mật khẩu thành công', 'success');
      this.loading = false;
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}
