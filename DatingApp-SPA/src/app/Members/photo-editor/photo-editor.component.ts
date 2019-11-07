import { AlertifyService } from './../../_services/alertify.service';
import { UserService } from './../../_services/user.service';
import { AuthService } from './../../_services/auth.service';
import { Photo } from './../../_models/photo';
import { User } from './../../_models/user';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
user: User;
@Input() photos: Photo[];
@Input() uploader: FileUploader; // = new FileUploader({url: URL});
@Output() getMemberChangePhoto = new EventEmitter<string>();
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

        if (photo.isMain) {
          this.uathService.changeMemberPhoto(photo.url);
          this.uathService.currentUser.photoUrl = photo.url;
          localStorage.setItem('user', JSON.stringify(this.uathService.currentUser));
        }
      }
    };
  }
  setMainPhoto(photo: Photo) {
    this.userService.setMainPhoto(this.uathService.decodedToken.nameid, photo.id)
    .subscribe(() => {
      this.currentMainPhoto = this.photos.filter(p => p.isMain === true)[0];
      this.currentMainPhoto.isMain = false;
      photo.isMain = true;
      this.uathService.changeMemberPhoto(photo.url);
      this.uathService.currentUser.photoUrl = photo.url;
      localStorage.setItem('user', JSON.stringify(this.uathService.currentUser));
    }, error => {
      this.alertify.error(error);
    });
  }
  deletePhoto(id: number) {
    this.alertify.confirm('Are you sure you want to delete this photo?', () => {
      this.userService.deletePhoto(this.uathService.decodedToken.nameid, id).subscribe(() => {
        this.photos.splice(this.photos.findIndex(p => p.id === id), 1);
        this.alertify.success('Photo has been deleted');
      }, error => {
        this.alertify.error('Failed to delete the photo');
      });
    });
  }
}
