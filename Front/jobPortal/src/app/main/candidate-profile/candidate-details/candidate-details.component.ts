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
      });
    });
  }

  experiences: WorkExperience[] = [];
  educations: Education[] = [];

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
}
