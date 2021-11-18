import { Component } from '@angular/core';
import { IonicPage, Modal, ModalController, ModalOptions, NavController, NavParams, ViewController } from 'ionic-angular';
import { OrganizationProvider } from '../../providers/organization/organization';
import { Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ActionSheetController, ToastController, LoadingController, Loading } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject, FileUploadOptions } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { StorageProvider } from "../../providers/storage/storage";
import { WidgetProvider } from "../../providers/widget/widget";
import { EmployeerProvider } from "../../providers/employeer/employeer";

declare var cordova: any;
@IonicPage()
@Component({
  selector: 'page-organization',
  templateUrl: 'organization.html',
})
export class OrganizationPage {
  coverpic:any="assets/imgs/upload-ext-photo.jpg";
  interior:any ="assets/imgs/upload-int-photo.jpg";
  ORG_ID: any;
  lastImage: any;
  notification_count: number;
  notification_data: any;
  loading: Loading;
  organizationList: any[] = [];
  galleryImages:any[]=[];
  SpData: any;
  EMP_ID: any;
  index: number;
  appCloseOpen: boolean = false;
  openPage: boolean = true;
  constructor(private camera: Camera,public navCtrl: NavController,public toastCtrl: ToastController,private modalCtrl: ModalController,
              public loadingCtrl: LoadingController, public navParams: NavParams,public actionSheetCtrl: ActionSheetController,
              private transfer: Transfer, private file: File, private filePath: FilePath, public org_service: OrganizationProvider,
              private localStorage: StorageProvider, public alertCtrl: AlertController, public platform: Platform, private widget: WidgetProvider,
              private empProvider: EmployeerProvider) {
    this.widget.showLoading('').then();
  }

  ionViewDidLoad(): void {}

  ionViewWillEnter(): void {
    console.log('ionViewWillEnter');
    this.fetchSData();
    this.backButton();
    //this.getMyOrganizationImages();
  }

  backButton(): void {
    this.widget.appClose();
  }

  showNotification(): void {
    this.widget.openNotification();
  }

  getMyOrganizationImages(ID) {
    console.log("org id---->",ID);
    
    this.org_service.getMyOrganizationImages(ID).subscribe((data: any) => {
      console.log("organizations images------->",data)

         if (data.galleryImg && data.galleryImg.length == 1) {
           this.interior = 'https://hoteljobber.com/images/org_album/' + data.galleryImg[0].small;
           console.log(this.interior);
                   
         }
        if(data.organisation.organisation_image){
          this.coverpic = 'https://hoteljobber.com/images/org_cover_photo/' + data.organisation.organisation_image;
          console.log(this.coverpic);

        }
        this.widget.hideLoading().then();
      },
      err => {
        console.log("ERROR!: ", err);
        this.widget.hideLoading().then();
      }
    );
  }

  getMyOrganization(ID) {
    this.org_service.getMyOrganization(ID).subscribe((data: any) => {
      console.log("organizations------->",data.organisation)
        this.organizationList = data.organisation;
        if (this.organizationList == undefined) {
          this.organizationList = [];
          if(this.openPage) {
            this.openPage = false;
            this.createOrganizationPage();
          }
        }
       
        this.widget.hideLoading().then();
      },
      err => {
        console.log("ERROR!: ", err);
        this.widget.hideLoading().then();
      }
    );
  }
  createOrganizationPage(): void  {
    this.navCtrl.push('CreateOrganizationPage',{
      navigate:"create",
      tag:"create"
    }).then();
  }


  postJobPage(org_ID, totalJob): void  {
    let postJob = { org_ID: org_ID, totalJob: totalJob };
    this.navCtrl.push('SpecialPage', { postJob: postJob }).then();
  }

  updateOrg(org_id): void {
    this.navCtrl.push('CreateOrganizationPage', { id: org_id, tag:"update" }).then();
  }

  remove(org_ID) {
    console.log('OrgID:', org_ID);
    const modalOptions: ModalOptions = { enableBackdropDismiss: false };
    let modal = this.modalCtrl.create('ReportDialogPage',{ broadcast:'remove_Org', org_ID: org_ID }, modalOptions);
    modal.onDidDismiss((data: any) => {
      if (data == 'success') {
       //If success then call
        this.getMyOrganization(this.SpData.ID);
      }
    });
    modal.present().then();
  }

  fetchSData(): void{
    this.localStorage.fetchSP().then((val: any) => {
      this.SpData = JSON.parse(val);
      this.EMP_ID = JSON.parse(val).ID;
      this.getMyOrganization(this.EMP_ID);
    });
  }

  /*gotoMyJobs(): void {
    this.navCtrl.parent.select(3);
  }*/

  changeLogo(Org_id, index) {
    console.log("Org ids-----", Org_id)
   console.log('transfer file', this.transfer.create());
    this.ORG_ID = Org_id;
    this.index = index;
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'From Gallery',
          icon: 'ios-film-outline',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
            //console.log('Source Library Type:',this.camera.PictureSourceType.PHOTOLIBRARY );
          }
        },
        {
          text: 'Use Camera',
          icon: 'ios-camera-outline',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
            //console.log('Source Camera Type:',this.camera.PictureSourceType.CAMERA );
          }
        },
        {
          text: 'Cancel',
          icon: 'ios-close-outline',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present().then();
  }

  public takePicture(sourceType) {
    this.widget.showLoading('').then();
    // Create options for the Camera Dialog
    let options = {
      quality: 50,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      targetWidth: 230,
      targetHeight: 250
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      let base64Image = 'data:image/jpeg;base64,' + imagePath;
      let url = "https://www.hoteljobber.com/new-api/organisation.php";

      let options: FileUploadOptions  = {
        fileKey: "fileToUpload",
        fileName: 'org_logo.jpg',
        chunkedMode: false,
        mimeType: "image/jpeg",
        params : { 'myFile': base64Image,'option':'update-logo','Org_ID':this.ORG_ID,'Employer_ID': this.EMP_ID }
      };

      const fileTransfer: TransferObject = this.transfer.create();

      fileTransfer.upload(base64Image, url, options).then((data: any) => {
        let res = JSON.parse(data.response);
        console.log("changed logo-------->",data.response)
        if (res.status == 'success') {
          this.widget.presentToast(res.message).then();
          this.organizationList[this.index].organisation_logo = res.Image;
        }
      }, err => {
        this.widget.presentToast('Profile upload failed').then();
      });

      // Special handling for Android library
      /*if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            this.widget.presentToast('Gallery').then();
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        let currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        let correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }*/

    }, (err) => {
      this.widget.presentToast('Error while selecting image.').then();
    });
  }

  private createFileName() {
    let todayDate = new Date(),
      n = todayDate.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      this.uploadImage();
    }, error => {
      this.widget.presentToast('Error while storing file.').then();
    });
  }

  public uploadImage() {
    // Destination URL
    // "https://www.hoteljobber.com/uploadLogo.php"
    let url = "https://www.hoteljobber.com/new-api/organisation.php";

    // File name only
    let filename = this.lastImage;
    let options = {
      fileKey: "fileToUpload",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params : { 'myFile': filename,'option':'update-logo','Org_ID':'3633','Employer_ID':'5292' }
    };

    const fileTransfer: TransferObject = this.transfer.create();

    fileTransfer.upload(this.pathForImage(this.lastImage), url, options).then((data: any) => {
      let response = JSON.parse(data);
      if (response.status == 'success') {
        this.organizationList[0].organisation_logo = response.Image;
      } else {
        this.widget.presentAlert('Failed 270', response.status).then();
      }
    }, err => {
      this.widget.presentAlert('Profile upload failed',''+err).then();
    });
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  //Open my job list specific for organization
  openMyJobs(items) {
    console.log("items log------>",items)
     let orgInfo = { org_ID: items.ID, emp_ID: items.EMP_ID, jobTitle: items.organisation_name };
     this.navCtrl.push('MyJobsPage', { orgInfo: orgInfo}).then();
  }

  doRefresh(event): void {
    this.fetchSData();
    setTimeout(() => {
      event.complete();
    }, 2000);
  }


  changeExterior(Org_id, index){
   // console.log("Org ids-----", Org_id)
    console.log('transfer file', this.transfer.create());
     this.ORG_ID = Org_id;
     this.index = index;
     let actionSheet = this.actionSheetCtrl.create({
       title: 'Select Image Source',
       buttons: [
         {
           text: 'From Gallery',
           icon: 'ios-film-outline',
           handler: () => {
             this.takeExPicture(this.camera.PictureSourceType.PHOTOLIBRARY);
             //console.log('Source Library Type:',this.camera.PictureSourceType.PHOTOLIBRARY );
           }
         },
         {
           text: 'Use Camera',
           icon: 'ios-camera-outline',
           handler: () => {
             this.takeExPicture(this.camera.PictureSourceType.CAMERA);
             //console.log('Source Camera Type:',this.camera.PictureSourceType.CAMERA );
           }
         },
         {
           text: 'Cancel',
           icon: 'ios-close-outline',
           role: 'cancel'
         }
       ]
     });
     actionSheet.present().then();
  }

  public takeExPicture(sourceType) {
    this.widget.showLoading('').then();
    // Create options for the Camera Dialog
    let options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      targetWidth: 230,
      targetHeight: 250
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      let base64Image = 'data:image/jpeg;base64,' + imagePath;
      //this.coverpic  = base64Image;
      let url = "https://www.hoteljobber.com/new-api/organisation.php";

      let options: FileUploadOptions  = {
       // fileKey: "fileToUpload",
       fileKey: "org_cover_photo",

        //fileName: 'org_logo.jpg',
        fileName: 'org_cover_photo.jpg',

        chunkedMode: false,
        mimeType: "image/jpeg",
        //params : { 'myFile': base64Image,'option':'org_gallery','Org_ID':this.ORG_ID,'Employer_ID': this.EMP_ID }
        params : { 'org_cover_photo': base64Image,'option':'org_gallery','Org_ID':this.ORG_ID,'Employer_ID': this.EMP_ID }

      };
      console.log("file upload option exterior------------->",options,this.ORG_ID)
      const fileTransfer: TransferObject = this.transfer.create();

      fileTransfer.upload(base64Image, url, options).then((data: any) => {
        let res = JSON.parse(data.response);
        console.log("changed gallery-------->",data.response)
        if (res.status == 'success') {
          this.widget.presentToast(res.message).then();
          this.getMyOrganization(this.EMP_ID)
          this.coverpic  = 'https://hoteljobber.com/images/org_cover_photo/'+ res.org_cover_photo
          //this.organizationList[this.index].organisation_logo = res.Image;
        }
      }, err => {
        this.widget.presentToast('Profile upload failed').then();
      });

      // Special handling for Android library
      /*if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            this.widget.presentToast('Gallery').then();
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        let currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        let correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }*/

    }, (err) => {
      this.widget.presentToast('Error while selecting image.').then();
    });
  }

  changeInterior(Org_id, index){
    console.log("Org ids-----", Org_id)
    console.log('transfer file', this.transfer.create());
     this.ORG_ID = Org_id;
     this.index = index;
     let actionSheet = this.actionSheetCtrl.create({
       title: 'Select Image Source',
       buttons: [
         {
           text: 'From Gallery',
           icon: 'ios-film-outline',
           handler: () => {
             this.takeInPicture(this.camera.PictureSourceType.PHOTOLIBRARY);
             //console.log('Source Library Type:',this.camera.PictureSourceType.PHOTOLIBRARY );
           }
         },
         {
           text: 'Use Camera',
           icon: 'ios-camera-outline',
           handler: () => {
             this.takeInPicture(this.camera.PictureSourceType.CAMERA);
             //console.log('Source Camera Type:',this.camera.PictureSourceType.CAMERA );
           }
         },
         {
           text: 'Cancel',
           icon: 'ios-close-outline',
           role: 'cancel'
         }
       ]
     });
     actionSheet.present().then();
  }

  public takeInPicture(sourceType) {
    this.widget.showLoading('').then();
    // Create options for the Camera Dialog
    let options = {
      quality: 50,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      targetWidth: 230,
      targetHeight: 250
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      let base64Image = 'data:image/jpeg;base64,' + imagePath;
      //this.interior  = base64Image;
      let url = "https://www.hoteljobber.com/new-api/organisation.php";

      let options: FileUploadOptions  = {
        //fileKey: "fileToUpload",
        fileKey: "org_album",
        //fileName: 'org_logo.jpg',
        fileName: 'org_album.jpg',

        chunkedMode: false,
        mimeType: "image/jpeg",
        params : { 'myFile': base64Image,'option':'org_gallery','Org_ID':this.ORG_ID,'Employer_ID': this.EMP_ID }
      };
console.log("file upload option------------->",options,this.ORG_ID)
      const fileTransfer: TransferObject = this.transfer.create();

      fileTransfer.upload(base64Image, url, options).then((data: any) => {
        let res = JSON.parse(data.response);
        console.log("changed gallery-------->",data.response)
        if (res.status == 'success') {
          this.widget.presentToast(res.message).then();
          this.getMyOrganization(this.EMP_ID)
          this.interior ='https://hoteljobber.com/images/org_album/'+res.Image
          //this.organizationList[this.index].organisation_logo = res.Image;
        }
      }, err => {
        this.widget.presentToast('Profile upload failed').then();
      });

      // Special handling for Android library
      /*if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            this.widget.presentToast('Gallery').then();
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        let currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        let correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }*/

    }, (err) => {
      this.widget.presentToast('Error while selecting image.').then();
    });
  }
}
