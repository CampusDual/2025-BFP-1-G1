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
import { ActivatedRoute } from '@angular/router';
import { UrlUtils } from 'src/app/utils/url.utils';

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

  // URL formatting utilities
  formatUrl = UrlUtils.formatUrl;

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
  readonly MAX_IMAGE_SIZE_BYTES = 20971520;

  private destroy$ = new Subject<void>();

  constructor(
    private userService: UsersService,
    private candidateService: CandidateProfileService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  parseDate(dateString: string | null | undefined): Date | null {
    if (!dateString) return null;
    // Try to parse the date string
    const date = new Date(dateString);
    // Check if the date is valid
    return isNaN(date.getTime()) ? null : date;
  }

  ngOnInit(): void {
    this.initializeForms();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCandidate(+id);
    } else {
      this.loadUserData();
    }
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

  private loadCandidate(id: number): void {
    this.candidateService
      .getCandidateById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (candidate) => {
          this.candidate = candidate;
          this.candidateForm.patchValue({
            name: this.candidate.name,
            surname: this.candidate.surname,
            qualification: this.candidate.qualification,
            location: this.candidate.location,
            experience: this.candidate.experience,
            employmentStatus:
              this.candidate.employmentStatus?.toLowerCase() || 'no definido',
            modality: this.candidate.modality?.toLowerCase() || 'indiferente',
            availability: this.candidate.availability,
            aboutMe: this.candidate.aboutMe,
            linkedin: this.candidate.linkedin,
            github: this.candidate.github,
            web: this.candidate.web,
            email: this.candidate.user?.email,
            phone: this.candidate.phone,
            birthDate: this.candidate.birthDate,
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
        },
        error: () =>
          this.snackBar.open('Error al cargar el perfil', 'Cerrar', {
            duration: 3000,
            panelClass: ['errorSnackbar'],
            verticalPosition: 'top',
            horizontalPosition: 'center',
          }),
      });
  }

  private initializeForms(): void {
    this.experienceForm = this.fb.group({
      jobTitle: ['', [Validators.required, Validators.maxLength(100)]],
      company: ['', [Validators.required, Validators.maxLength(100)]],
      startPeriod: [null, [Validators.required, Validators.maxLength(100)]],
      endPeriod: [null, [Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
    });

    this.educationForm = this.fb.group({
      degree: ['', [Validators.required, Validators.maxLength(100)]],
      institution: ['', [Validators.required, Validators.maxLength(100)]],
      startPeriod: [null, [Validators.required, Validators.maxLength(100)]],
      endPeriod: [null, [Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
    });

    this.candidateForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(60)]],
      surname: ['', [Validators.required, Validators.maxLength(100)]],
      qualification: ['', [Validators.maxLength(200)]],
      location: ['', [Validators.maxLength(120)]],
      experience: ['', [Validators.maxLength(180)]],
      employmentStatus: ['no definido', [Validators.required]],
      modality: ['indiferente', [Validators.required]],
      availability: ['', [Validators.maxLength(128)]],
      aboutMe: ['', [Validators.maxLength(1000)]],
      linkedin: [
        '',
        [
          Validators.maxLength(2048),
          Validators.pattern('^(https?://)?(www\\.)?linkedin\\.com/.*'),
        ],
      ],
      github: [
        '',
        [
          Validators.maxLength(2048),
          Validators.pattern('^(https?://)?(www\\.)?github\\.com/.*'),
        ],
      ],
      web: [
        '',
        [
          Validators.maxLength(2048),
          Validators.pattern('^(https?://)?(www\\.)?.*'),
        ],
      ],
      email: [
        { value: '' },
        [Validators.required, Validators.email, Validators.maxLength(255)],
      ],
      phone: [
        '',
        [
          Validators.pattern('^[0-9]{9}$'),
          Validators.minLength(9),
          Validators.maxLength(15),
        ],
      ],
      birthDate: [null, [Validators.required, Validators.maxLength(100)]],
      profileImg: [''],
    });
  }

  private loadUserData(): void {
    this.userService.userData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.userData = user;
        if (!user || !user.candidate) return;

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
              employmentStatus:
                this.candidate.employmentStatus?.toLowerCase() || 'no definido',
              modality: this.candidate.modality?.toLowerCase() || 'indiferente',
              availability: this.candidate.availability,
              aboutMe: this.candidate.aboutMe,
              linkedin: this.candidate.linkedin,
              github: this.candidate.github,
              web: this.candidate.web,
              email: this.userData?.user?.email,
              phone: this.candidate.phone,
              birthDate: this.candidate.birthDate,
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
            panelClass: ['snackbarError'],
            verticalPosition: 'top',
            horizontalPosition: 'center',
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
      panelClass: ['snackbarSuccess'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
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
            verticalPosition: 'top',
            horizontalPosition: 'center',
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
              verticalPosition: 'top',
              horizontalPosition: 'center',
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

      // Format dates for new experience as well, similar to edit
      if (
        experienceData.startPeriod instanceof Date &&
        !isNaN(experienceData.startPeriod.getTime())
      ) {
        experienceData.startPeriod = experienceData.startPeriod
          .toISOString()
          .split('T')[0];
      }
      if (
        experienceData.endPeriod instanceof Date &&
        !isNaN(experienceData.endPeriod.getTime())
      ) {
        experienceData.endPeriod = experienceData.endPeriod
          .toISOString()
          .split('T')[0];
      } else if (experienceData.endPeriod === '') {
        experienceData.endPeriod = null;
      }

      this.candidateService
        .addWorkExperience(experienceData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.experiences = [...this.experiences, response];
            this.snackBar.open('Experiencia añadida correctamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['successSnackbar'],
              verticalPosition: 'top',
              horizontalPosition: 'center',
            });
            this.showExpForm = false;
            this.experienceForm.reset();
          },
          error: (error) => {
            console.error('Error adding experience:', error);
            this.snackBar.open('Error al añadir la experiencia', 'Cerrar', {
              duration: 3000,
              panelClass: ['errorSnackbar'],
              verticalPosition: 'top',
              horizontalPosition: 'center',
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

      // Format dates for new education as well, similar to edit
      if (
        educationData.startPeriod instanceof Date &&
        !isNaN(educationData.startPeriod.getTime())
      ) {
        educationData.startPeriod = educationData.startPeriod
          .toISOString()
          .split('T')[0];
      }
      if (
        educationData.endPeriod instanceof Date &&
        !isNaN(educationData.endPeriod.getTime())
      ) {
        educationData.endPeriod = educationData.endPeriod
          .toISOString()
          .split('T')[0];
      } else if (educationData.endPeriod === '') {
        educationData.endPeriod = null;
      }

      this.candidateService
        .addEducation(educationData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.educations = [...this.educations, response];
            this.snackBar.open('Educación añadida correctamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['successSnackbar'],
              verticalPosition: 'top',
              horizontalPosition: 'center',
            });
            this.showEduForm = false;
            this.educationForm.reset();
          },
          error: (error) => {
            console.error('Error adding education:', error);
            this.snackBar.open('Error al añadir la educación', 'Cerrar', {
              duration: 3000,
              panelClass: ['errorSnackbar'],
              verticalPosition: 'top',
              horizontalPosition: 'center',
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
      const formData = this.candidateForm.getRawValue();

      let formattedBirthdate: string | null = null;
      if (
        formData.birthDate instanceof Date &&
        !isNaN(formData.birthDate.getTime())
      ) {
        formattedBirthdate = formData.birthDate.toISOString().split('T')[0];
      } else if (typeof formData.birthDate === 'string' && formData.birthDate) {
        formattedBirthdate = formData.birthDate;
      }

      formData.employmentStatus =
        formData.employmentStatus?.toLowerCase() || 'no definido';
      formData.modality = formData.modality?.toLowerCase() || 'indiferente';

      const candidateDataToUpdate: any = {
        id: this.candidate.id,
        ...formData,
        birthDate: formattedBirthdate,
        user: {
          ...this.candidate.user,
          email: formData.email,
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
              verticalPosition: 'top',
              horizontalPosition: 'center',
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
            verticalPosition: 'top',
            horizontalPosition: 'center',
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
          panelClass: ['errorSnackbar'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
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
    this.experienceForm.patchValue({
      ...exp,
      startPeriod: exp.startPeriod ? new Date(exp.startPeriod) : null,
      endPeriod: exp.endPeriod ? new Date(exp.endPeriod) : null,
    });
    this.showExpForm = false;
  }

  editExperience(): void {
    if (this.experienceForm.valid) {
      if (
        this.editingExpId === null ||
        this.editingExpId === undefined ||
        this.editingExpId === 0
      ) {
        this.snackBar.open(
          'Error: No se ha seleccionado una experiencia para editar.',
          'Cerrar',
          {
            duration: 3000,
            panelClass: ['errorSnackbar'],
            verticalPosition: 'top',
            horizontalPosition: 'center',
          }
        );
        return;
      }

      const experience = {
        ...this.experienceForm.value,
        id: this.editingExpId,
        idCandidate: this.candidate?.id || 0,
      };

      // Ensure startPeriod and endPeriod are formatted as strings before sending
      if (
        experience.startPeriod instanceof Date &&
        !isNaN(experience.startPeriod.getTime())
      ) {
        experience.startPeriod = experience.startPeriod
          .toISOString()
          .split('T')[0];
      }
      if (
        experience.endPeriod instanceof Date &&
        !isNaN(experience.endPeriod.getTime())
      ) {
        experience.endPeriod = experience.endPeriod.toISOString().split('T')[0];
      } else if (experience.endPeriod === '') {
        experience.endPeriod = null; // Send null if empty string to backend
      }

      this.candidateService
        .updateWorkExperience(experience)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.snackBar.open('Experiencia editada correctamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['successSnackbar'],
              verticalPosition: 'top',
              horizontalPosition: 'center',
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
              verticalPosition: 'top',
              horizontalPosition: 'center',
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
          panelClass: ['errorSnackbar'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
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
      // Added check for editingEduId
      if (
        this.editingEduId === null ||
        this.editingEduId === undefined ||
        this.editingEduId === 0
      ) {
        this.snackBar.open(
          'Error: No se ha seleccionado una educación para editar.',
          'Cerrar',
          {
            duration: 3000,
            panelClass: ['errorSnackbar'],
            verticalPosition: 'top',
            horizontalPosition: 'center',
          }
        );
        return;
      }

      const education = {
        ...this.educationForm.value,
        id: this.editingEduId,
        idCandidate: this.candidate?.id || 0,
      };

      // Ensure startPeriod and endPeriod are formatted as strings before sending
      if (
        education.startPeriod instanceof Date &&
        !isNaN(education.startPeriod.getTime())
      ) {
        education.startPeriod = education.startPeriod
          .toISOString()
          .split('T')[0];
      }
      if (
        education.endPeriod instanceof Date &&
        !isNaN(education.endPeriod.getTime())
      ) {
        education.endPeriod = education.endPeriod.toISOString().split('T')[0];
      } else if (education.endPeriod === '') {
        education.endPeriod = null; // Send null if empty string to backend
      }

      this.candidateService
        .updateEducation(education)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.snackBar.open('Educación editada correctamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['successSnackbar'],
              verticalPosition: 'top',
              horizontalPosition: 'center',
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
              verticalPosition: 'top',
              horizontalPosition: 'center',
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
          panelClass: ['errorSnackbar'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
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
