import { Component } from '@angular/core';

@Component({
  selector: 'app-predict-disease',
  templateUrl: './predict-disease.component.html',
  styleUrl: './predict-disease.component.scss'
})
export class PredictDiseaseComponent {

  //  uploadedImageSrc: string | ArrayBuffer | null = null;
  //   diseaseName: string = 'No disease detected';
  //   diseaseMeasures: string = 'Upload an image to get suggestions';

  //   loadFile(event: Event) {
  //     const file = (event.target as HTMLInputElement).files?.[0];
  //     if (file) {
  //       const reader = new FileReader();
  //       reader.onload = () => {
  //         this.uploadedImageSrc = reader.result;
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   }

  //   detectDisease() {
  //     // Placeholder function to simulate disease detection
  //     this.diseaseName = 'Leaf Rust';
  //     this.diseaseMeasures = '1. Remove affected leaves\n2. Use fungicide\n3. Ensure good air circulation';
  //   }

  uploadedImageSrc: string | ArrayBuffer | null = null;
  diseaseName: string = 'No disease detected';
  diseaseMeasures: string = 'Upload an image to get suggestions';
  diseases: any[] = [
    {
      title: "Cercospora Leaf Spot",
      image: "cercospora.jpg",
      details: "Cercospora leaf spot is a common fungal disease affecting coffee plants.",
      symptoms: [
        "Brown or gray spots with a yellow halo on leaves",
        "Premature leaf drop",
        "Reduced photosynthesis",
        "Weakened plants"
      ],
      remedies: [
        "Remove and destroy affected leaves.",
        "Apply appropriate fungicides.",
        "Maintain proper plant spacing for air circulation."
      ],
      preventive_measures: [
        "Plant resistant coffee varieties.",
        "Practice crop rotation.",
        "Avoid overhead irrigation.",
        "Ensure good field sanitation."
      ],
      what_caused_it: "Cercospora leaf spot is caused by the fungus Cercospora coffeicola."
    },
    {
      title: "Coffee Leaf Rust",
      image: "rust.jpg",
      details: "Coffee leaf rust is a fungal disease that severely impacts coffee plants.",
      symptoms: [
        "Yellow-orange powdery lesions on the underside of leaves",
        "Defoliation",
        "Reduced yield",
        "Weakened plants"
      ],
      remedies: [
        "Remove affected leaves.",
        "Apply fungicides.",
        "Monitor regularly."
      ],
      preventive_measures: [
        "Plant resistant coffee varieties.",
        "Ensure proper spacing between plants for good air circulation.",
        "Implement good agricultural practices to maintain plant health.",
        "Regularly inspect plants for early signs of the disease."
      ],
      what_caused_it: "Coffee leaf rust is caused by the fungus Hemileia vastatrix."
    },
    {
      title: "Coffee Leaf Miner",
      image: "miner.png",
      details: "Coffee leaf miner is an insect pest that damages coffee leaves.",
      symptoms: [
        "Irregular, serpentine mines on leaves",
        "Leaves become dry and brittle",
        "Premature leaf drop",
        "Reduced photosynthesis"
      ],
      remedies: [
        "Hand-pick and destroy affected leaves.",
        "Use biological control agents.",
        "Apply insecticides if necessary."
      ],
      preventive_measures: [
        "Encourage natural predators.",
        "Use trap crops to attract miners away from coffee plants.",
        "Maintain field hygiene."
      ],
      what_caused_it: "Coffee leaf miner damage is caused by the larvae of the moth Leucoptera coffeella."
    },
    {
      title: "Coffee Phoma",
      image: "Phoma.png",
      details: "Coffee Phoma is a fungal disease that affects coffee plants.",
      symptoms: [
        "Dark brown to black lesions on leaves and berries",
        "Premature fruit drop",
        "Dieback of branches",
        "Reduced yield"
      ],
      remedies: [
        "Prune and destroy affected parts of the plant.",
        "Apply appropriate fungicides.",
        "Improve air circulation by proper spacing."
      ],
      preventive_measures: [
        "Avoid overhead irrigation.",
        "Plant resistant varieties.",
        "Implement proper field sanitation.",
        "Regularly monitor plants for early detection."
      ],
      what_caused_it: "Coffee Phoma is caused by the fungus Phoma spp."
    }
  ];

  ngOnInit() {
    this.loadCarousel();
  }

  loadFile(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.uploadedImageSrc = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  detectDisease() {
    // Placeholder function to simulate disease detection
    this.diseaseName = 'Leaf Rust';
    this.diseaseMeasures = '1. Remove affected leaves\n2. Use fungicide\n3. Ensure good air circulation';
  }

  loadCarousel() {
    const carouselInner = document.querySelector('.carousel-inner');
    this.diseases.forEach((disease, index) => {
      const isActive = index === 0;
      const carouselItem = this.createCarouselItem(disease, isActive);
      if (carouselInner) {
        carouselInner.innerHTML += carouselItem;
      }
    });
  }

  createCarouselItem(disease: any, isActive: boolean): string {
    const activeClass = isActive ? 'active' : '';
    return `
    <div class="carousel-item ${activeClass}">
      <div class="row">
        <div class="col-md-6">
          <img src="${disease.image}" class="d-block w-100" alt="${disease.title}">
        </div>
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">${disease.title}</div>
            <div class="card-body">
              <p class="card-text">${disease.details}</p>
              <h5>Symptoms</h5>
              <ul>${disease.symptoms.map((symptom: any) => `<li>${symptom}</li>`).join('')}</ul>
              <h5>Remedies</h5>
              <ul>${disease.remedies.map((remedy: any) => `<li>${remedy}</li>`).join('')}</ul>
              <h5>Preventive Measures</h5>
              <ul>${disease.preventive_measures.map((measure: any) => `<li>${measure}</li>`).join('')}</ul>
              <h5>What Caused It</h5>
              <p>${disease.what_caused_it}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  }

}
