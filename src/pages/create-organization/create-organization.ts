import { Component } from '@angular/core';
import { Modal, IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ActionSheetController, ToastController, LoadingController, Loading } from 'ionic-angular';
import { CityProvider } from '../../providers/city/city';
import { OrganizationProvider } from '../../providers/organization/organization';
import { SelectSearchable } from "ionic-select-searchable";
import { Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera} from "@ionic-native/camera";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageProvider } from "../../providers/storage/storage";
import { WidgetProvider } from "../../providers/widget/widget";

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-create-organization',
  templateUrl: 'create-organization.html',
})
export class CreateOrganizationPage {
  nav: any;
  org_ID: any;
  tag: string = "";
  organizationDetails: any;
  pageLabel: String;
  btnLabel: String;
  selectedCountryID: any;
  selectedStateID: any;
  selectedCityID: any;
  SpData: any;
  organization_name: any;
  organization_type: any;
  address: any;
  landmark: any;
  selectedCountry: any;
  selectedState: any;
  selectedCity: any;
  email: any;
  contact_name: any;
  phone1: any;
  phone2: any;
  website: any;
  itemsOrgType: any;
  itemsCountryList: any;
  itemsStateList: any;
  itemsCityList: any;
  lastImage: string = null;
  loading: Loading;
  create_org_form: FormGroup;
  titleCountry: any = "Select Country";
  titleState: any = "Select State";
  titleCity: any = "Search by City Name";
  flags: string;
  array: any[] = [];
  optionTitle1: any;
  ports: any = [] = [];
  optionId: any;
  cityObj: { "optionTitle": any; "optionId": any; };
  constructor(private camera: Camera, private cityService: CityProvider,
              public formBuilder: FormBuilder, private transfer: Transfer, private file: File, private filePath: FilePath,
    public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform,
    public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams,
    public org_service: OrganizationProvider, private localStorage: StorageProvider, private widget: WidgetProvider) {

    this.org_ID = navParams.get('id');
    this.tag = navParams.get('tag');

    this.nav = navParams.get("navigate");
    this.ports = this.cityService.getResults("");

    this.fetchSData();
    this.getOrgType();
    // this.getCountry();


    this.create_org_form = formBuilder.group({

      organization_name: ['', [Validators.required, Validators.minLength(2)]],
      contact_name: ['', [Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-Z_ \.]*$')]],
      organization_type: ['', Validators.required],
      address: ['', Validators.required],
      landmark: ['', Validators.required],
      selectedCountry: ['',],
      selectedState: ['',],
      selectedCity: ['', Validators.required],
      // contact_name: ['',[Validators.required,Validators.minLength(2),Validators.pattern('[a-zA-Z]*')]],
      email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}')]],
      phone1: ['', [Validators.required, Validators.pattern('[0-9]*'),Validators.maxLength(16), Validators.minLength(6)]],
      phone2: ['', [Validators.pattern('[0-9]*'), Validators.maxLength(16), Validators.minLength(6)]],
      website: ['',]
    });

    platform.registerBackButtonAction(() => {
        this.navCtrl.pop().then();
    });
  }

  ionViewDidLoad() {}

  getOrganisationDetails(Org_ID) {
    let body = new FormData();

    body.append('option', 'get_org');
    body.append('Org_ID', Org_ID);

    this.org_service.getOrganisationDetails('organisation.php', body).subscribe(
      (data: any) => {
        if (data.status == "failed") {
          this.widget.presentToast(data.message).then();
        } else {
          this.organizationDetails = data.organisation;

          this.localStorage.getStorage('cityObj').then((val: any) => {
            this.cityObj = val;
            this.optionId = val.optionId;
            this.titleCity = "";
            this.create_org_form.get('selectedCity').setValue(val);
          });
          this.create_org_form.get('organization_name').setValue(this.organizationDetails.organisation_name);
          this.create_org_form.get('contact_name').setValue(this.organizationDetails.Contact_name);
          this.create_org_form.get('organization_type').setValue(this.organizationDetails.organisation_type);
          //   this.create_org_form.get('selectedState').setValue(this.organizationDetails.State);
          //   this.create_org_form.get('selectedCity').setValue(this.organizationDetails.City);
          this.create_org_form.get('address').setValue(this.organizationDetails.organisation_address);
          this.create_org_form.get('landmark').setValue(this.organizationDetails.organisation_branch);
          this.create_org_form.get('email').setValue(this.organizationDetails.organisation_email);
          this.create_org_form.get('phone1').setValue(this.organizationDetails.organisation_phone);
          this.create_org_form.get('phone2').setValue(this.organizationDetails.organisation_phone1);
          this.create_org_form.get('website').setValue(this.organizationDetails.Website);
        }
      },
      err => {
        console.log("ERROR!: ", err);
      });
  }

  createOrganization() {

    this.widget.showLoading('').then();
    let body = new FormData();

    if (this.tag == "update") {
      body.append('option', 'update_org');
      body.append('Org_ID', this.org_ID);
    } else {
      body.append('option', 'create_org');
    }

    body.append('Employer_ID', this.SpData.ID);
    body.append('Organisation_Name', this.create_org_form.get("organization_name").value);
    body.append('Organisation_type', this.create_org_form.get("organization_type").value);

    body.append('ContactName', this.create_org_form.get("contact_name").value);
    // body.append('Website', this.create_org_form.get("website").value);
    body.append('Organisation_branch', this.create_org_form.get("landmark").value);
    body.append('Address', this.create_org_form.get("address").value);
    // body.append('Country', this.create_org_form.get("selectedCountry").value.ID);
    // body.append('State', this.create_org_form.get("selectedState").value.ID);
    body.append('City', this.optionId);
    body.append('Mobile', this.create_org_form.get("phone1").value);
    body.append('Mobile1', this.create_org_form.get("phone2").value);
    body.append('Email_ID', this.create_org_form.get("email").value);
    body.append('Token', 'hotel123');

    this.org_service.createOrganization('organisation.php', body).subscribe(
      (data: any) => {
        if (data.status == 'success') {
          this.localStorage.setStorage("cityObj", this.cityObj);

          if (this.tag == "update") {
            this.widget.presentToast('Organisation Updated Successfully').then();
          } else {
            this.widget.presentToast("Organisation Created Successfully").then();
          }
          this.back();
        } else {
          this.widget.presentToast(data.message).then();
        }
        this.widget.hideLoading().then();
      },
      err => {
        console.log("ERROR!: ", err);
        this.widget.hideLoading().then();
      }
    );
  }

  getOrgType() {
    let body = new FormData();

    body.append('option', 'OrgTypes');

    this.org_service.createOrganization('common-operations.php', body).subscribe(
      data => {
        this.itemsOrgType = data;
      },
      err => {
        console.log("ERROR!: ", err);
      }
    );
  }

  getCity(state_id) {
    this.widget.showLoading('').then();
    let body = new FormData();

    body.append('option', 'ShowCity');
    body.append('state_id', state_id);

    this.org_service.createOrganization('common-operations.php', body).subscribe(
      data => {
        this.itemsCityList = data;
        this.widget.hideLoading().then();
      },
      err => {
        console.log("ERROR!: ", err);

      }
    );
  }

  fetchSData() {
    this.localStorage.getStorage('employeer_details').then((val: any) => {
      this.SpData = JSON.parse(val);
      if (this.tag == "update") {
        this.pageLabel = "Update Organisation";
        this.btnLabel = "Update";
        this.getOrganisationDetails(this.org_ID);
      } else {
        this.pageLabel = "Create Organisation";
        this.btnLabel = "Next";
      }

    });

  }
  searchPorts(event: { component: SelectSearchable, text: string }) {
    let text = (event.text || '').trim().toLowerCase();

    if (!text) {
      event.component.items = [];
      return;
    } else if (event.text.length < 3) {
      return;
    }

    event.component.isSearching = true;

    this.cityService.getResults(text).subscribe(ports => {
      event.component.items = ports.filter(port => {
        return port.optionTitle.toLowerCase().indexOf(text) !== -1;
      });
      event.component.isSearching = false;
    });
  }


  portSelectCity(event: { component: SelectSearchable, value: any }) {
    this.titleCity = "";
    this.flags = "search";

    let city = event.value;
    this.array = city.optionTitle.split(",");
    this.optionId = event.value.optionId;
    this.optionTitle1 = event.value.optionTitle;
    this.create_org_form.get('selectedCity').setValue(event.value);

    this.cityObj = {
      "optionTitle": event.value.optionTitle,
      "optionId": event.value.optionId,
    }

  }

  portChangeCity(event: { component: SelectSearchable, value: any }) {
    this.titleCity = "";
    this.selectedCityID = event.value.ID;
  }


  getSelecetedOrganization_type(org_type) {
    this.organization_type = org_type;
  }

  back(): void {
      this.navCtrl.pop().then();
  }

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present().then();
  }

  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    let options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {

      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        let currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        let correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.widget.presentToast('Error while selecting image.').then();
    });
    this.loading = this.loadingCtrl.create({
      content: 'Uploading...',
    });
    this.loading.present().then();
  }

  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      this.widget.presentToast('copyFileToLocalDir-.' + this.lastImage).then();
      this.uploadImage();
    }, error => {
      this.widget.presentToast('Error while storing file.').then();
    });
  }

  public uploadImage() {
    // Destination URL
    let url = "http://pocketinfotech.com/demo/app_demo/task_management/taskAPI/upload.php";

    let targetPath = this.pathForImage(this.lastImage);
    this.widget.presentToast('Image successful uploaded.' + targetPath).then();
    // File name only
    let filename = this.lastImage;

    let options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: { 'fileName': filename }
    };

    const fileTransfer: TransferObject = this.transfer.create();

    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options).then(data => {
      this.widget.showLoading('').then();
      this.widget.presentToast('Image successful uploaded.' + data.response).then();
    }, err => {
      this.widget.showLoading('').then();
      this.widget.presentToast('Error while uploading file.').then();
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
}
