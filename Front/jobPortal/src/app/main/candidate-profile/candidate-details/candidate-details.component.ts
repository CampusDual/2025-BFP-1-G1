import { Component, OnInit } from '@angular/core';
import { Candidate } from 'src/app/model/candidate';
import { Education } from 'src/app/model/education';
import { UserData } from 'src/app/model/userData';

import { WorkExperience } from 'src/app/model/workExperience';
import { CandidateProfileService } from 'src/app/services/candidate-profile.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-candidate-details',
  templateUrl: './candidate-details.component.html',
  styleUrls: ['./candidate-details.component.css'],

})

export class CandidateDetailsComponent implements OnInit {
  constructor(
    private userService: UsersService,
    private candidateService: CandidateProfileService
  ) {}
  userData: UserData | null = null;
  candidate!: Candidate;
  experiences: WorkExperience[] = [];
  educations: Education[] = [];
  showEduForm: boolean = false;
  showExpForm: boolean = false;

  workExperience: WorkExperience = {
    idCandidate: this.userData?.candidate?.id ?? 0,
    jobTitle: '',
    company: '',
    startPeriod: '',
    endPeriod: '',
    description: '',
  };

  education: Education = {
    idCandidate: this.userData?.candidate?.id ?? 0,
    degree: '',
    institution: '',
    startPeriod: '',
    endPeriod: '',
    description: '',
  };

  ngOnInit(): void {
    this.userService.userData$.subscribe((user) => {
      this.userData = user;
      console.log('User data loaded:', this.userData);
      this.candidateService.getCandidateProfile().subscribe((candidate) => {
        this.candidate = candidate;
        console.log('Candidate profile loaded:', this.candidate);
        this.candidateService.getExperienceByCandidateId(this.candidate.id!).subscribe((experiences) => {
          this.experiences = experiences;
          console.log('Work experiences loaded', this.experiences);
        });
        this.candidateService.getEducationByCandidateId(this.candidate.id!).subscribe((educations) => {
          this.educations = educations;
          console.log('Edications loaded', this.educations);
        });
      });
    });
  }


  addExperience() {
    this.experiences.push({ ...this.workExperience });
    this.workExperience = {
      idCandidate: this.userData?.candidate?.id ?? 0,
      jobTitle: '',
      company: '',
      startPeriod: '',
      endPeriod: '',
      description: '',
    };
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
  editCandidate(): void {}

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
}
