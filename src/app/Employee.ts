import {Qualification} from "./Qualification";

export class Employee {
  constructor(public id?: number,
              public lastName?: string,
              public firstName?: string,
              public street?: string,
              public postcode?: string,
              public city?: string,
              public phone?: string,
              public skillSet: Qualification[] = []
  ) {}

  addQualification(qualification: Qualification) {
    if(!this.skillSet.find(q => q.id === qualification.id)) {
      this.skillSet.push(qualification);
    }
  }

  removeQualification(qualification: Qualification) {
    this.skillSet = this.skillSet.filter(q => q.id !== qualification.id);
  }


}
