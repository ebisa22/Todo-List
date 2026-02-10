 export class Task {
   constructor(project, title, checklist, isCompleted, dueDate,dueTime) {
     this.id=crypto.randomUUID();
     this.project = project;
     this.title = title;
     this.checklist = checklist;
     this.isCompleted = isCompleted;
     this.dueDate = dueDate;
     this.dueTime=dueTime;
   }
 }
