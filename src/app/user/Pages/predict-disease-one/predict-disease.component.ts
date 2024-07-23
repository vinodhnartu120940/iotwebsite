import { Component } from '@angular/core';
import { ServicesService } from '../../Services/services.service';
import { PredictService } from './predict.service';
import { NotificationService } from '../../../Services/notification.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-predict-disease',
  templateUrl: './predict-disease.component.html',
  styleUrl: './predict-disease.component.scss',
})
export class PredictDiseaseCopyComponent {
  matchingDisease: any;
  currentTab: string = 'upload'; // Default tab
  diseasesData: any;
  individualDisease: any;
  uploadedImageSrc: any;
  selectedFile: any;
  constructor(
    private predictService: PredictService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.GetDiseases();
  }

  setTab(tab: string) {
    this.currentTab = tab;
  }
  diseaseModel(disease: any) {
    this.individualDisease = disease;
  }
  loadFile(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      if (this.selectedFile) {
        this.predictService
          .LeafDetection(this.selectedFile)
          .subscribe((res) => {
            if (res.status) {
              this.predictService.uploadFile(this.selectedFile).subscribe(
                (response) => {
                  if (response) {
                    this.predictService.GetDiseases().subscribe((res) => {
                      console.log(res);
                      const predictedClass = response.predicted_class;
                      this.matchingDisease = this.findMatchingDiseases(
                        predictedClass,
                        res
                      );
                    });
                  }
                },
                (error) => {
                  console.error('Error uploading file', error);
                }
              );

              this.currentTab = 'result';
              const reader = new FileReader();
              reader.onload = () => {
                this.uploadedImageSrc = reader.result;
              };
              reader.readAsDataURL(file);
            } else {
              this.notificationService.showError(
                'The uploaded image is not a leaf!'
              );
            }
          });
      }
    }
  }

  findMatchingDiseases(predictedClass: any, result: any) {
    return result.filter((disease: any) =>
      disease.name.toLowerCase().includes(predictedClass.toLowerCase())
    );
  }

  GetDiseases() {
    this.predictService.GetDiseases().subscribe((res) => {
      this.diseasesData = res;
    });
  }
}
