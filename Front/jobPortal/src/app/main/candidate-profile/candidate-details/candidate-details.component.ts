import { Component, OnInit } from '@angular/core';
import { Education } from 'src/app/model/education';
import { UserData } from 'src/app/model/userData';

import { WorkExperience } from 'src/app/model/workExperience';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-candidate-details',
  templateUrl: './candidate-details.component.html',
  styleUrls: ['./candidate-details.component.css'],
})
export class CandidateDetailsComponent implements OnInit {
  constructor(private userService: UsersService) {}
  userData: UserData | null = null;


  ngOnInit(): void {
    this.userService.userData$.subscribe((user) => {
      this.userData = user;
      console.log('User data loaded:', this.userData);
    });
  }

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
}
