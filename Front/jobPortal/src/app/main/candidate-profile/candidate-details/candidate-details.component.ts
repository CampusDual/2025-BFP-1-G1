import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';

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
export class CandidateDetailsComponent implements OnInit, OnDestroy {
  experienceForm!: FormGroup;
  educationForm!: FormGroup;
  candidateForm!: FormGroup;

  userData: UserData | null = null;
  candidate!: Candidate;

  experiences: WorkExperience[] = [];
  educations: Education[] = [];

  showEduForm: boolean = false;
  showExpForm: boolean = false;

  startDate = new Date();

  editingCandidate: boolean = false;
  editingExpId: number | null = null;
  editingEduId: number | null | undefined = null;

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

  selectedFile: File | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  selectedFileName: string = '';
  readonly MAX_IMAGE_SIZE_BYTES = 20971520; // 20 MB

  private destroy$ = new Subject<void>();

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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (
      this.imagePreviewUrl &&
      (this.imagePreviewUrl as string).startsWith('blob:')
    ) {
      URL.revokeObjectURL(this.imagePreviewUrl as string);
    }
  }

  formatDate(dateString: string | undefined | null): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      timeZone: 'UTC',
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
      startPeriod: [null, Validators.required],
      endPeriod: [null],
      description: ['', [Validators.required, Validators.maxLength(4000)]],
    });

    this.candidateForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      surname: ['', [Validators.required, Validators.maxLength(100)]],
      qualification: ['', Validators.maxLength(100)],
      location: ['', Validators.maxLength(100)],
      experience: [''],
      employmentStatus: [''],
      availability: [''],
      modality: [''],
      aboutMe: ['', Validators.maxLength(4000)],
      linkedin: [
        '',
        Validators.pattern('^(https?://)?(www\\.)?linkedin\\.com/.*'),
      ],
      github: ['', Validators.pattern('^(https?://)?(www\\.)?github\\.com/.*')],
      web: ['', Validators.pattern('^(https?://)?(www\\.)?.*')],
      email: [
        { value: '' },
        [Validators.required, Validators.email],
      ],
      phone: [
        '',
        [
          Validators.pattern('^[0-9]{9}$'),
          Validators.minLength(9),
          Validators.maxLength(15),
        ],
      ],
      birthdate: [null],
      profileImg: [''],
    });
  }

  private loadUserData(): void {
    this.userService.userData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.userData = user;

        if (!user || !user.candidate) {
          return;
        }
        this.candidateService
          .getCandidateProfile()
          .pipe(takeUntil(this.destroy$))
          .subscribe((candidate) => {
            this.candidate = candidate;
            this.candidateForm.patchValue({
              name: this.candidate.name,
              surname: this.candidate.surname,
              qualification: this.candidate.qualification,
              location: this.candidate.location,
              experience: this.candidate.experience,
              employmentStatus: this.candidate.employmentStatus,
              availability: this.candidate.availability,
              modality: this.candidate.modality,
              aboutMe: this.candidate.aboutMe,
              linkedin: this.candidate.linkedin,
              github: this.candidate.github,
              web: this.candidate.web,
              email: this.userData?.user?.email,
              phone: this.candidate.phone,
              birthdate: this.candidate.birthdate
                ? new Date(this.candidate.birthdate)
                : null,
              profileImg: this.candidate.profileImg || '',
            });
            if (this.candidate.profileImg) {
              this.imagePreviewUrl = this.candidate.profileImg;
            } else {
              this.imagePreviewUrl = null;
            }
            this.selectedFile = null;
            this.selectedFileName = '';

            this.loadExperiences();
            this.loadEducations();
          });
      });
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];

      if (file.size > this.MAX_IMAGE_SIZE_BYTES) {
        this.snackBar.open(
          `La imagen excede el tamaño máximo permitido de ${
            this.MAX_IMAGE_SIZE_BYTES / (1024 * 1024)
          } MB.`,
          'Cerrar',
          {
            duration: 5000,
            panelClass: ['snackbar-error'],
          }
        );
        this.selectedFile = null;
        this.selectedFileName = '';
        element.value = '';
        return;
      }

      this.selectedFile = file;
      this.selectedFileName = file.name;

      if (
        this.imagePreviewUrl &&
        (this.imagePreviewUrl as string).startsWith('blob:')
      ) {
        URL.revokeObjectURL(this.imagePreviewUrl as string);
      }
      this.imagePreviewUrl = URL.createObjectURL(file);
    } else {
      this.selectedFile = null;
      this.selectedFileName = '';
      if (this.candidateForm.get('profileImg')?.value) {
        this.imagePreviewUrl = this.candidateForm.get('profileImg')?.value;
      } else {
        this.imagePreviewUrl = null;
      }
    }
  }

  removeProfileImage(): void {
    this.candidateForm.get('profileImg')?.setValue(null);
    this.selectedFile = null;
    this.selectedFileName = '';
    this.imagePreviewUrl = null;
    this.snackBar.open('Imagen de perfil eliminada', 'Cerrar', {
      duration: 2000,
    });
  }

  private loadExperiences(): void {
    if (!this.candidate?.id) return;

    this.candidateService
      .getExperienceByCandidateId(this.candidate.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (experiences) => {
          this.experiences = experiences;
        },
        error: (error) => {
          console.error('Error loading experiences:', error);
          this.snackBar.open('Error al cargar las experiencias', 'Cerrar', {
            duration: 3000,
            panelClass: ['errorSnackbar'],
          });
        },
      });
  }

  private loadEducations(): void {
    if (!this.candidate?.id) return;

    this.candidateService
      .getEducationByCandidateId(this.candidate.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (educations) => {
          this.educations = educations;
        },
        error: (error) => {
          console.error('Error loading educations:', error);
          this.snackBar.open(
            'Error al cargar la formación académica',
            'Cerrar',
            {
              duration: 3000,
              panelClass: ['errorSnackbar'],
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
      this.candidateService
        .addWorkExperience(experienceData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.experiences = [...this.experiences, response];
            this.snackBar.open('Experiencia añadida correctamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['successSnackbar'],
            });
            this.showExpForm = false;
            this.experienceForm.reset();
          },
          error: (error) => {
            console.error('Error adding experience:', error);
            this.snackBar.open('Error al añadir la experiencia', 'Cerrar', {
              duration: 3000,
              panelClass: ['errorSnackbar'],
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
      };
      this.candidateService
        .addEducation(educationData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.educations = [...this.educations, response];
            this.snackBar.open('Educación añadida correctamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['successSnackbar'],
            });
            this.showEduForm = false;
            this.educationForm.reset();
          },
          error: (error) => {
            console.error('Error adding education:', error);
            this.snackBar.open('Error al añadir la educación', 'Cerrar', {
              duration: 3000,
              panelClass: ['errorSnackbar'],
            });
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
    this.editingCandidate = true;
    this.showExpForm = false;
    this.showEduForm = false;
    this.editingExpId = null;
    this.editingEduId = null;
    this.selectedFile = null;
    this.selectedFileName = '';
    if (this.candidateForm.get('profileImg')?.value) {
      this.imagePreviewUrl = this.candidateForm.get('profileImg')?.value;
    } else {
      this.imagePreviewUrl = null;
    }
  }

  saveCandidate(): void {
    if (this.candidateForm.valid) {
      const candidateDataToUpdate: Candidate = {
        id: this.candidate.id,
        name: this.candidateForm.get('name')?.value,
        surname: this.candidateForm.get('surname')?.value,
        qualification: this.candidateForm.get('qualification')?.value,
        location: this.candidateForm.get('location')?.value,
        experience: this.candidateForm.get('experience')?.value,
        employmentStatus: this.candidateForm.get('employmentStatus')?.value,
        availability: this.candidateForm.get('availability')?.value,
        modality: this.candidateForm.get('modality')?.value,
        aboutMe: this.candidateForm.get('aboutMe')?.value,
        linkedin: this.candidateForm.get('linkedin')?.value,
        github: this.candidateForm.get('github')?.value,
        web: this.candidateForm.get('web')?.value,
        phone: this.candidateForm.get('phone')?.value,
        birthdate: this.candidateForm.get('birthdate')?.value
          ? new Date(this.candidateForm.get('birthdate')?.value)
          : undefined,
        profileImg: this.candidateForm.get('profileImg')?.value || null,
        user: {
          ...this.candidate.user,
          email: this.candidateForm.get('email')?.value,
        },
      };

      let updateObservable;
      if (this.selectedFile) {
        updateObservable =
          this.candidateService.updateCandidateProfileWithImage(
            candidateDataToUpdate,
            this.selectedFile
          );
      } else {
        updateObservable = this.candidateService.updateCandidateProfile(
          candidateDataToUpdate
        );
      }

      updateObservable.pipe(takeUntil(this.destroy$)).subscribe({
        next: (response) => {
          this.candidate = response;
          if (this.userData) {
            this.userData.candidate = { ...response };
            if (this.userData.user && response.user && response.user.email) {
              this.userData.user.email = response.user.email;
            }

            this.userService.setUserData(this.userData);
            this.snackBar.open('Perfil actualizado correctamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['successSnackbar'],
            });
            this.editingCandidate = false;
            this.selectedFile = null;
            this.selectedFileName = '';
            this.imagePreviewUrl = this.candidate.profileImg || null;
            if (
              this.imagePreviewUrl &&
              (this.imagePreviewUrl as string).startsWith('blob:')
            ) {
              URL.revokeObjectURL(this.imagePreviewUrl as string);
            }
          }
        },
        error: (error) => {
          console.error('Error al actualizar el perfil:', error);
          this.snackBar.open('Error al actualizar el perfil', 'Cerrar', {
            duration: 3000,
            panelClass: ['errorSnackbar'],
          });
        },
      });
    } else {
      this.candidateForm.markAllAsTouched();
      this.snackBar.open(
        'Por favor, completa los campos requeridos y corrige los errores de validación.',
        'Cerrar',
        {
          duration: 5000,
          panelClass: ['snackbar-error'],
        }
      );
    }
  }

  cancelEditingCandidate(): void {
    this.editingCandidate = false;
    this.loadUserData();
    this.selectedFile = null;
    this.selectedFileName = '';
    this.imagePreviewUrl = this.candidate?.profileImg || null;
    if (
      this.imagePreviewUrl &&
      (this.imagePreviewUrl as string).startsWith('blob:')
    ) {
      URL.revokeObjectURL(this.imagePreviewUrl as string);
    }
  }

  startEditingExperience(exp: any): void {
    this.editingExpId = exp.id;
    this.experienceForm.patchValue(exp);
    this.showExpForm = false;
  }

  editExperience(): void {
    if (this.experienceForm.valid) {
      const experience = {
        ...this.experienceForm.value,
        id: this.editingExpId,
        idCandidate: this.candidate?.id || 0,
      };

      this.candidateService
        .updateWorkExperience(experience)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.snackBar.open('Experiencia editada correctamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['successSnackbar'],
            });

            this.loadExperiences();
            this.editingExpId = null;
            this.experienceForm.reset();
          },
          error: (error) => {
            console.error('Error al editar la experiencia:', error);
            this.snackBar.open('Error al editar la experiencia', 'Cerrar', {
              duration: 3000,
              panelClass: ['errorSnackbar'],
            });
          },
        });
    } else {
      this.experienceForm.markAllAsTouched();
      this.snackBar.open(
        'Por favor, completa los campos requeridos de la experiencia.',
        'Cerrar',
        {
          duration: 3000,
          panelClass: ['snackbar-error'],
        }
      );
    }
  }

  startEditingEducation(edu: Education): void {
    this.editingEduId = edu.id;
    this.educationForm.patchValue({
      ...edu,
      startPeriod: edu.startPeriod ? new Date(edu.startPeriod) : null,
      endPeriod: edu.endPeriod ? new Date(edu.endPeriod) : null,
    });
    this.showEduForm = false;
  }

  editEducation(): void {
    if (this.educationForm.valid) {
      const education = {
        ...this.educationForm.value,
        id: this.editingEduId,
        idCandidate: this.candidate?.id || 0,
      };

      this.candidateService
        .updateEducation(education)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.snackBar.open('Educación editada correctamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['successSnackbar'],
            });

            this.loadEducations();
            this.editingEduId = null;
            this.educationForm.reset();
          },
          error: (error) => {
            console.error('Error al editar la educación:', error);
            this.snackBar.open('Error al editar la educación', 'Cerrar', {
              duration: 3000,
              panelClass: ['errorSnackbar'],
            });
          },
        });
    } else {
      this.educationForm.markAllAsTouched();
      this.snackBar.open(
        'Por favor, completa los campos requeridos de la educación.',
        'Cerrar',
        {
          duration: 3000,
          panelClass: ['snackbar-error'],
        }
      );
    }
  }

  capitalizeFirst(text: string | undefined | null): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  openLink(url: string): void {
    if (url) {
      const formattedUrl =
        url.startsWith('http://') || url.startsWith('https://')
          ? url
          : `http://${url}`;
      window.open(formattedUrl, '_blank');
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
}