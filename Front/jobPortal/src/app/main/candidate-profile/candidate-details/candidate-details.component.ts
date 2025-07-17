import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Candidate } from 'src/app/model/candidate';
import { Education } from 'src/app/model/education';
import { WorkExperience } from 'src/app/model/workExperience';
import { UserData } from 'src/app/model/userData';

import { CandidateProfileService } from 'src/app/services/candidate-profile.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-candidate-details',
  templateUrl: './candidate-details.component.html',
  styleUrls: ['./candidate-details.component.css'],
})
export class CandidateDetailsComponent implements OnInit {
  experienceForm!: FormGroup;
  educationForm!: FormGroup;

  userData: UserData | null = null;
  candidate!: Candidate;

  experiences: WorkExperience[] = [];
  educations: Education[] = [];

  showEduForm: boolean = false;
  showExpForm: boolean = false;

  startDate = new Date();

  workExperience: WorkExperience = {
    idCandidate: 0,
    jobTitle: '',
    company: '',
    startPeriod: '',
    endPeriod: '',
    description: '',
  };

  education: Education = {
    idCandidate: 0,
    degree: '',
    institution: '',
    startPeriod: '',
    endPeriod: '',
    description: '',
  };

  constructor(
    private userService: UsersService,
    private candidateService: CandidateProfileService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.loadUserData();
  }

  formatDate(dateString: string | undefined | null): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; 
    
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short',
      timeZone: 'UTC' 
    };
    
    return date.toLocaleDateString('es-ES', options);
  }

  private initializeForms(): void {
    this.experienceForm = this.fb.group({
      jobTitle: ['', [Validators.required, Validators.maxLength(120)]],
      company: ['', Validators.required],
      startPeriod: [null, Validators.required],
      endPeriod: [null],
      description: ['', [Validators.required, Validators.maxLength(4000)]],
    });

    this.educationForm = this.fb.group({
      degree: ['', Validators.required],
      institution: ['', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null],
      description: ['', [Validators.required, Validators.maxLength(4000)]],
    });
  }

  private loadUserData(): void {
    this.userService.userData$.subscribe((user) => {
      this.userData = user;

      if (!user || !user.candidate) {
        return;
      }
      this.candidateService.getCandidateProfile().subscribe((candidate) => {
        this.candidate = candidate;
        console.log('Candidate profile loaded:', this.candidate);
        this.loadExperiences();
        this.loadEducations();
      });
    });
  }

  private loadExperiences(): void {
    if (!this.candidate?.id) return;

    this.candidateService
      .getExperienceByCandidateId(this.candidate.id)
      .subscribe({
        next: (experiences) => {
          this.experiences = experiences;
          console.log('Experiences loaded', this.experiences);
        },
        error: (error) => {
          console.error('Error loading experiences:', error);
          this.snackBar.open('Error al cargar las experiencias', 'Cerrar', {
            duration: 3000,
          });
        },
      });
  }

  private loadEducations(): void {
    if (!this.candidate?.id) return;

    this.candidateService
      .getEducationByCandidateId(this.candidate.id)
      .subscribe({
        next: (educations) => {
          this.educations = educations;
          console.log('Educations loaded', this.educations);
        },
        error: (error) => {
          console.error('Error loading educations:', error);
          this.snackBar.open(
            'Error al cargar la formación académica',
            'Cerrar',
            {
              duration: 3000,
            }
          );
        },
      });
  }

  addExperience(): void {
    if (this.experienceForm.valid) {
      const experienceData = {
        ...this.experienceForm.value,
        idCandidate: this.candidate?.id || 0,
      };
      this.candidateService.addWorkExperience(experienceData).subscribe({
        next: (response) => {
          this.experiences = [...this.experiences, response];
          this.snackBar.open('Experiencia añadida correctamente', 'Cerrar', {
            duration: 3000,
          });
          this.showExpForm = false;
          this.experienceForm.reset();
        },
        error: (error) => {
          console.error('Error adding experience:', error);
          this.snackBar.open('Error al añadir la experiencia', 'Cerrar', {
            duration: 3000,
          });
        },
      });
    }
  }

  addEducation(): void {
    if (this.educationForm.valid) {
      const educationData = {
        ...this.educationForm.value,
        idCandidate: this.candidate?.id || 0,
        startPeriod: this.educationForm.value.startDate,
        endPeriod: this.educationForm.value.endDate || null,
      };

      delete educationData.startDate;
      delete educationData.endDate;

      this.candidateService.addEducation(educationData).subscribe({
        next: (response) => {
          this.educations = [...this.educations, response];
          this.snackBar.open(
            'Formación académica añadida correctamente',
            'Cerrar',
            {
              duration: 3000,
            }
          );
          this.showEduForm = false;
          this.educationForm.reset();
        },
        error: (error) => {
          console.error('Error adding education:', error);
          this.snackBar.open(
            'Error al añadir la formación académica',
            'Cerrar',
            {
              duration: 3000,
            }
          );
        },
      });
    }
  }

  isCandidate(): boolean {
    return (
      !!this.userData?.candidate ||
      (!!this.userData?.user && this.userData.user.role_id === 3)
    );
  }

  isOwner(): boolean {
    if (!this.userData?.candidate?.id || !this.candidate?.id) {
      return false;
    }
    return this.userData.candidate.id === this.candidate.id;
  }

  editCandidate(): void {
    // Implementar lógica de edición si se desea
  }

  capitalizeFirst(text: string | undefined | null): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  openLink(url: string): void {
    if (url) {
      window.open(url, '_blank');
    }
  }

  onEndPeriodChange(date: Date | null) {
    if (date) {
      const isoString = date.toISOString().split('T')[0];
      this.workExperience.endPeriod = isoString;
    } else {
      this.workExperience.endPeriod = '';
    }
  }

  onStartPeriodChange(date: Date | null) {
    if (date) {
      const isoString = date.toISOString().split('T')[0];
      this.workExperience.startPeriod = isoString;
    } else {
      this.workExperience.startPeriod = '';
    }
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['error-snackbar'],
    });
  }
}
