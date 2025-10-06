export enum NoteStatus {
  PENDING = 'PENDING',
  TODO = 'TODO', 
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum Category {
  NOTE = 'note',
  TASK = 'task',
}

export interface NoteProps {
  id?: string;
  title: string;
  description?: string | null;
  status?: NoteStatus;
  priority?: Priority;
  category?: Category | null;
  assignedToId?: number | null;
  createdById: number;
  teamId?: number | null;
  dueDate?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Note {
  private props: NoteProps;

  constructor(props: NoteProps) {
    this.props = {
      ...props,
      status: props.status || NoteStatus.PENDING,
      priority: props.priority || Priority.MEDIUM,
      createdAt: props.createdAt || new Date(),
    };
  }

  public get id(): string {
    return this.props.id!;
  }

  public set title(title: string) {
    this.props.title = title;
  }

  public get title(): string {
    return this.props.title;
  }

  public get createdById(): number {
    return this.props.createdById;
  }

  public set status(status: NoteStatus) {
    this.props.status = status;
  }

  public get status(): NoteStatus {
    return this.props.status!; // Sempre tem valor devido ao construtor
  }

  public set priority(priority: Priority) {
    this.props.priority = priority;
  }

  public get priority(): Priority {
    return this.props.priority!; // Sempre tem valor devido ao construtor
  }

  public set description(description: string | null) {
    this.props.description = description;
  }

  public get description(): string | null | undefined {
    return this.props.description;
  }

  public set category(category: Category | null) {
    this.props.category = category;
  }

  public get category(): Category | null | undefined {
    return this.props.category;
  }

  public set assignedToId(assignedToId: number | null) {
    this.props.assignedToId = assignedToId;
  }

  public get assignedToId(): number | null | undefined {
    return this.props.assignedToId;
  }

  public set teamId(teamId: number | null) {
    this.props.teamId = teamId;
  }

  public get teamId(): number | null | undefined {
    return this.props.teamId;
  }

  public set dueDate(dueDate: Date | null) {
    this.props.dueDate = dueDate;
  }

  public get dueDate(): Date | null | undefined {
    return this.props.dueDate;
  }

  public get createdAt(): Date {
    return this.props.createdAt!;
  }

  public get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  public touch() {
    this.props.updatedAt = new Date();
  }

  public isAssignedTo(userId: number): boolean {
    return this.props.assignedToId === userId;
  }

  public isCreatedBy(userId: number): boolean {
    return this.props.createdById === userId;
  }

  public belongsToTeam(): boolean {
    return this.props.teamId !== null && this.props.teamId !== undefined;
  }

  public isCompleted(): boolean {
    return this.props.status === NoteStatus.COMPLETED;
  }

  public canBeEditedBy(userId: number, isTeamAdmin: boolean = false): boolean {
    return this.isCreatedBy(userId) || (this.belongsToTeam() && isTeamAdmin);
  }

  public complete() {
    this.props.status = NoteStatus.COMPLETED;
    this.touch();
  }

  public cancel() {
    this.props.status = NoteStatus.CANCELLED;
    this.touch();
  }

  public startProgress() {
    this.props.status = NoteStatus.IN_PROGRESS;
    this.touch();
  }

  public putTodo() {
    this.props.status = NoteStatus.TODO;
    this.touch();
  }

  public sendToReview() {
    this.props.status = NoteStatus.REVIEW;
    this.touch();
  }

  public assignTo(userId: number) {
    this.props.assignedToId = userId;
    this.touch();
  }

  public unassign() {
    this.props.assignedToId = null;
    this.touch();
  }

  public isOverdue(): boolean {
    if (!this.props.dueDate) return false;
    return new Date() > this.props.dueDate && !this.isCompleted();
  }
}