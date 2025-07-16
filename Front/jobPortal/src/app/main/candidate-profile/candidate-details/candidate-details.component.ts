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

  userData: UserData | null = null;
  candidate!: Candidate;

  experiences: WorkExperience[] = [];
  educations: Education[] = [];

  showEduForm: boolean = false;
  showExpForm: boolean = false;

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
    this.experienceForm = this.fb.group({
      jobTitle: ['', [Validators.required, Validators.maxLength(120)]],
      company: ['', Validators.required],
      startPeriod: [null, Validators.required],
      endPeriod: [null],
      description: ['', [Validators.required, Validators.maxLength(4000)]],
    });

    this.userService.userData$.subscribe((user) => {
      this.userData = user;

      this.workExperience.idCandidate = user?.candidate?.id ?? 0;
      this.education.idCandidate = user?.candidate?.id ?? 0;

      console.log('User data loaded:', this.userData);
      this.candidateService.getCandidateProfile().subscribe((candidate) => {
        this.candidate = candidate;
        console.log('Candidate profile loaded:', this.candidate);

        this.candidateService
          .getExperienceByCandidateId(this.candidate.id!)
          .subscribe((experiences) => {
            this.experiences = experiences;
            console.log('Work experiences loaded', this.experiences);
          });

        this.candidateService
          .getEducationByCandidateId(this.candidate.id!)
          .subscribe((educations) => {
            this.educations = educations;
            console.log('Educations loaded', this.educations);
          });
      });
    });
  }

 addExperience() {
  if (this.experienceForm.valid) {
    const newExperience = this.experienceForm.value;
    newExperience.idCandidate = this.userData?.candidate?.id ?? 0;

    this.candidateService.addWorkExperience(newExperience).subscribe({
      next: (response) => {
        this.experiences = [...this.experiences, response];
        this.snackBar.open('Experiencia añadida correctamente', 'Cerrar', {
          duration: 3000,
          panelClass: 'successSnackbar',
          verticalPosition: 'top',
        });
        this.showExpForm = false;
        this.experienceForm.reset();
        console.log('Experiencia añadida correctamente');
      },
      error: (error) => {
        console.error('Error al añadir experiencia', error);
        this.snackBar.open('Error al crear la experiencia', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top',
        });
      },
    });
  } else {
    this.experienceForm.markAllAsTouched();
  }
}

  addEducation() {
    this.educations.push({ ...this.education });
    this.education = {
      idCandidate: this.userData?.candidate?.id ?? 0,
      degree: '',
      institution: '',
      startPeriod: '',
      endPeriod: '',
      description: '',
    };
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
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }
}
