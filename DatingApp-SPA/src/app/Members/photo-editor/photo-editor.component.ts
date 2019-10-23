import { AlertifyService } from './../../_services/alertify.service';
import { UserService } from './../../_services/user.service';
import { AuthService } from './../../_services/auth.service';
import { Photo } from './../../_models/photo';
import { User } from './../../_models/user';
import { Component, OnInit, Input } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { error } from 'protractor';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
user: User;
@Input() photos: Photo[];
@Input() uploader: FileUploader; // = new FileUploader({url: URL});
 hasBaseDropZoneOver = false;
 baseUrl = environment.apiUrl;
 currentMainPhoto: Photo;

  constructor(private uathService: AuthService,
              private userService: UserService,
              private alertify: AlertifyService) { }

  ngOnInit() {
    this.initializeUploader();
  }
  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'user/' + this.uathService.decodedToken.nameid + '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });
    this.uploader.onAfterAddingFile = (file) => (file.withCredentials = false);

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const resp: Photo = JSON.parse(response);
        const photo = {
        id: resp.id,
        url: resp.url,
        dateAdded : resp.dateAdded,
        description: resp.description,
        isMain: resp.isMain
        };
        this.photos.push(photo);

      }
    };
  }
  setMainPhoto(photo: Photo) {
    this.userService.setMainPhoto(this.uathService.decodedToken.nameid, photo.id)
    .subscribe(() => {
      this.currentMainPhoto = this.photos.filter(p => p.isMain === true)[0];
      this.currentMainPhoto.isMain = false;
      photo.isMain = true;
      console.log('Successfully set to main..');
    }, error => {
      this.alertify.error(error);
    });
  }
}
